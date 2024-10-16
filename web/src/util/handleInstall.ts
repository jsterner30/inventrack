import querystring from "node:querystring";
import {createHmac} from "node:crypto";
import { Client } from "../client/client";

export async function handleInstall (url: URL, client: Client | undefined): Promise<void> {
    const hmac = url.searchParams.get('hmac')
    if (hmac == null) {
        return
    }
    // if there is an hmac query param, send the query params to the backend so they can validate it.
    if (!client) {
        return
    }

    // basically the idea was that we'd send the query params to the backend, have them validate, and then get authcode stuff via these docs
    // https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/authorization-code-grant

    const map: Record<string, string> = {}
    for (const [key, value] of url.searchParams.entries()) {
        if (key !== 'hmac') {
            map[key] = value
        }
    }
    const message = querystring.stringify(map);
    const providedHmac = Buffer.from(hmac, "utf-8");
    const generatedHash = Buffer.from(
        createHmac("sha256", apiSecret).update(message).digest("hex"),
        "utf-8",
    );
}
