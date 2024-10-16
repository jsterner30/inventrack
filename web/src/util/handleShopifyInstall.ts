import { BadRequestStatus, PostMethod } from "@redotech/http/semantics";
import { Response } from "@redotech/nodejs-http-server/response";
import { createChildLogger } from "@redotech/server/logger";
import { add, findByShopURL } from "@redotech/server/models/Team";
import { ShopifyIntegration, User } from "@redotech/server/models/index";
import * as shopify from "@redotech/server/utils/shopify/utils";
import { getShopFromCallback } from "@redotech/server/utils/shopify/utils";
import { hexEncoding } from "@redotech/util/encoding";
import axios from "axios";
import { JSDOM } from "jsdom";
import { createHmac, timingSafeEqual } from "node:crypto";
import * as querystring from "node:querystring";
import * as request from "request-promise";
import { getInstallationURL } from "./install";

const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET!;
const installWebhookURL = process.env.INSTALL_SLACK_WEBHOOK_URL;

const logger = createChildLogger();

const BLOCKED_EMAILS = [/@aftership\.com/, /@returngo\.ai/];

export async function handler(event: any, context: any) {
    if (event.httpMethod !== PostMethod.name) {
        return Response({});
    } else {
        const { shop, hmac, code, state, redirectToMobile } = event.body;
        // state contains a string of URL query params. In order to cleanly parse that,
        // we need it to look like a full URL.
        const params = new URLSearchParams(
            new TextDecoder().decode(hexEncoding.read(state)),
        );
        const email = params.get("email") || "";
        if (BLOCKED_EMAILS.some((blockedPattern) => blockedPattern.test(email))) {
            return Response({
                status: BadRequestStatus.code,
                body: "Invalid user",
            });
        }
        const firstName = params.get("firstName") || "";
        const lastName = params.get("lastName") || "";
        const next = params.get("next") || "";
        const requestOrigination: "web" | "mobile" =
            redirectToMobile === "true" ? "mobile" : "web";
        if (shop && hmac && code) {
            const map = event.body;

            delete map["signature"];
            delete map["hmac"];
            delete map["protocol"];
            delete map["locale"];

            const message = querystring.stringify(map);
            const providedHmac = Buffer.from(hmac, "utf-8");
            const generatedHash = Buffer.from(
                createHmac("sha256", apiSecret).update(message).digest("hex"),
                "utf-8",
            );

            let hashEquals = false;

            try {
                hashEquals = timingSafeEqual(generatedHash, providedHmac);
            } catch (e) {
                logger.exception("Failed to verify hash", e);
                hashEquals = false;
            }

            if (!hashEquals) {
                return Response({
                    status: BadRequestStatus.code,
                    body: "HMAC validation failed",
                });
            }

            // Get an access token after shopify authorizes
            const accessTokenRequestUrl =
                "https://" + shop + "/admin/oauth/access_token";
            const accessTokenPayload = {
                client_id: apiKey,
                client_secret: apiSecret,
                code,
            };

            const {
                access_token: accessToken,
                scope = "",
                associated_user = {},
            } = await request.post(accessTokenRequestUrl, {
                json: accessTokenPayload,
            });

            // The first callback will include the online access token with the associated user.
            const shopifyStaffId = associated_user?.id;
            if (shopifyStaffId) {
                // todo add back in after we have read_users scope - will give us non account owners that can install the app
                // const user = await request.get(`https://${shop}/admin/api/2023-07/users/${shopifyStaffId}.json`);

                // Return the redirect url again now that we know the user
                if (associated_user.account_owner) {
                    // Account owner will be eligible to update the app
                    const url = await getInstallationURL(
                        shop,
                        true,
                        requestOrigination,
                        false,
                        next,
                        associated_user,
                    );
                    return Response({ json: { installationURL: url } });
                } else {
                    // Non account owner will be able to continue to the app even if we are requesting an update
                    const url = await getInstallationURL(
                        shop,
                        false,
                        requestOrigination,
                        false,
                        next,
                        associated_user,
                    );
                    return Response({
                        json: {
                            installationURL: url,
                        },
                    });
                }
            } else {
                // After the first callback it will be our offline access token,
                //  which is permanent and does not contain the user specific information.
                //  But we do have the user's email, which was passed through OAuth state
                const accessScope = scope.split(",");
                // DONE: Use access token to make API call to 'shop' endpoint
                const shopResponseJson = await getShopFromCallback(shop, accessToken);

                let team = await findByShopURL(shop);
                const shopifyShop = shopResponseJson.shop;
                const name = shopResponseJson.name;
                // Get the user
                let user = await User.findOne({
                    email: email.toLowerCase(),
                    team: team?._id,
                });
                if (!user) {
                    user = await User.create({
                        name: `${firstName} ${lastName}`.trim(),
                        firstName: firstName.trim(),
                        lastName: lastName.trim(),
                        email: email.toLowerCase().trim(),
                        roles: ["admin"],
                    });
                }
                const isRedoUser = email.endsWith("@getredo.com");
                const teamUserRole = {
                    user,
                    email: email.toLowerCase().trim(),
                    roles: ["admin"],
                };

                if (team) {
                    const teamUsers = team.users;
                    const userExistsOnTeam = teamUsers.some(
                        (teamUser: any) => teamUser.user == user.id,
                    );
                    if (!userExistsOnTeam && !isRedoUser) {
                        team.users.push(teamUserRole);
                        user.team = team._id;
                        await user.save();
                    }
                    if (user && !user.team) {
                        user.team = team._id;
                        await user.save();
                    }

                    team.accessToken = accessToken;
                    team.accessScope = accessScope;
                    team.email = email;
                    team.name = name;
                    team.adminName = shopifyShop.shop_owner;
                    team.adminPhone = shopifyShop.phone;
                    team._shopify = shopifyShop;

                    await team.save();
                } else {
                    // Install the app for the first time
                    const shopData = shopResponseJson.shop;
                    // Check required address fields before continuing with install
                    if (
                        !shopData.address1 ||
                        !shopData.city ||
                        !shopData.province_code ||
                        !shopData.province ||
                        !shopData.zip ||
                        !shopData.country ||
                        !shopData.name
                    ) {
                        return Response({
                            status: BadRequestStatus.code,
                            body: "No address found in shopify response",
                        });
                    }
                    team = await add(
                        name,
                        shop,
                        email,
                        accessToken,
                        accessScope,
                        [teamUserRole],
                        shopifyShop,
                    );
                    try {
                        user.team = team._id;
                        await user.save();
                    } catch (e) {
                        logger.exception("Failed to save user", e);
                    }
                }

                const shopify = await ShopifyIntegration.findOne({ team });
                if (shopify) {
                    const enabled = shopify.enabled;
                    shopify._shop = team._shopify;
                    shopify.enabled = true;
                    shopify.shopifyDomain = team.storeUrl;
                    await shopify.save();
                    if (installWebhookURL && !enabled) {
                        try {
                            await notifyInstall(team, installWebhookURL, true);
                        } catch (error) {
                            logger.exception("Failed to send reinstall notification", error);
                        }
                    }
                } else {
                    await ShopifyIntegration.create({
                        shopifyDomain: team.storeUrl,
                        enabled: true,
                        scriptTagsEnabled: !team.email.endsWith("@shopify.com"),
                        team,
                        _shop: team._shopify,
                    });
                    if (installWebhookURL && !isRedoUser) {
                        try {
                            await notifyInstall(team, installWebhookURL);
                        } catch (error) {
                            logger.exception("Failed to send install notification", error);
                        }
                    }
                }

                const data: any = team.generateAuthResponse(user.toObject());
                data.url =
                    next +
                    `${requestOrigination === "mobile" ? "?redirectToMobile=true" : ""}`;
                return Response({ json: data });
            }
        } else {
            return Response({
                status: BadRequestStatus.code,
                body: "Required parameters missing",
            });
        }
    }
}

const dateFormat = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
});
const numberFormat = new Intl.NumberFormat("en-US");

export async function notifyInstall(
    team: any,
    slackWebhook: any,
    reinstall = false,
) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const numOrdersResponse = await shopify.get({
        endpoint: "orders/count",
        team: team,
        query: {
            created_at_min: thirtyDaysAgo.toISOString(),
            status: "any",
        },
    });

    const url = `https://${team._shopify.domain}/`;
    let iconUrl;
    try {
        const pageResponse = await fetch(url);
        const html = await pageResponse.text();
        const dom = new JSDOM(html);

        for (const link of Array.from(
            dom.window.document.getElementsByTagName("link"),
        )) {
            if (link.getAttribute("rel")?.split(" ").includes("icon")) {
                iconUrl = String(new URL(link.href, url));
                break;
            }
        }
    } catch (error) {
        logger.exception("Failed to get icon url", error);
    }

    // Send a slack message to the installs channel in slack
    const text = `🙌 ${team.name} has ${
        reinstall ? "reinstalled" : "installed"
    } Redo!`.trim();
    const slackMessage = {
        text,
        blocks: [
            { type: "header", text: { type: "plain_text", text } },
            {
                type: "context",
                elements: [
                    ...(iconUrl
                        ? [
                            {
                                type: "image",
                                image_url: iconUrl,
                                alt_text: "Logo",
                            },
                        ]
                        : []),
                    { type: "mrkdwn", text: url },
                ],
            },
            {
                type: "section",
                fields: [
                    { type: "mrkdwn", text: "*Owner*" },
                    { type: "mrkdwn", text: team._shopify.shop_owner },
                    { type: "mrkdwn", text: "*Owner Email*" },
                    { type: "mrkdwn", text: team.email },
                    { type: "mrkdwn", text: "*Address*" },
                    {
                        type: "mrkdwn",
                        text: `${team._shopify.address1}, ${team._shopify.city}, ${team._shopify.province_code}, ${team._shopify.country}`,
                    },
                    { type: "mrkdwn", text: "*Phone*" },
                    { type: "mrkdwn", text: team._shopify.phone },
                ],
            },
            {
                type: "section",
                fields: [
                    { type: "mrkdwn", text: "*Shopify Domain*" },
                    { type: "mrkdwn", text: team.storeUrl },
                    { type: "mrkdwn", text: "*Shopify Started*" },
                    {
                        type: "mrkdwn",
                        text: dateFormat.format(new Date(team._shopify.created_at)),
                    },
                    { type: "mrkdwn", text: "*Shopify Plan*" },
                    { type: "mrkdwn", text: team._shopify.plan_display_name },
                    { type: "mrkdwn", text: "*Orders in Last 30 Days*" },
                    {
                        type: "mrkdwn",
                        text: numberFormat.format(numOrdersResponse.count),
                    },
                ],
            },
        ],
    };
    await axios.post(slackWebhook, slackMessage);
}