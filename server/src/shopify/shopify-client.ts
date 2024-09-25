import {
    AdminOperations,
    ClientResponse,
    ReturnData,
} from "@shopify/admin-api-client";
import "@shopify/shopify-api/adapters/node";

import { ApiVersion, LogSeverity, shopifyApi } from "@shopify/shopify-api";
import { GraphqlClient } from "@shopify/shopify-api/lib/clients/admin/graphql/client";

export class ShopifyGraphQLClient {
    private client: GraphqlClient;

    constructor(
        accessToken: string,
        storeUrl: string,
        private tries: number = 3,
    ) {
        const shopify = shopifyApi({
            apiKey: "key",
            apiSecretKey: "secret",
            adminApiAccessToken: accessToken,
            isCustomStoreApp: true,
            hostName: storeUrl,
            logger: { level: LogSeverity.Warning },
            isEmbeddedApp: false,
            apiVersion: "2024-07" as ApiVersion,
        });
        const session = shopify.session.customAppSession(storeUrl);

        this.client = new shopify.clients.Graphql({
            session,
            apiVersion: "2024-07" as ApiVersion,
        });
    }

    public request<T = unknown, V extends Record<string, any> = {}>(
        operation: string,
        variables?: V,
    ): Promise<
        ClientResponse<
            T extends undefined ? ReturnData<string, AdminOperations> : T
            >
        > {
        return this.client.request<T>(operation, {
            variables,
            retries: this.tries,
        });
    }
}