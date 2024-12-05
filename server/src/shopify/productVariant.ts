import {ShopifyGraphQLClient} from "./shopify-client";
import {VariantInventory, ProductSchema} from "shared";
import {isValid} from "../util/validate";
import {ClientResponse} from "@shopify/admin-api-client";

export const internalVariantQuery = /* GraphQL */ `
id
title
image {
    id
    url
}
sku
displayName
image {
    url
    id
}
contextualPricing(context: {}) {
    price {
        amount
        currencyCode
    }
}
inventoryQuantity
inventoryItem {
    locationsCount {
        count
        precision
    }
}
`

const getVariantInventoryQuery = /* GraphQL */ `
    query variant_inventory($variant_id: ID!, $location_count: Int!) {
        productVariant(id: $variant_id) {
            inventoryQuantity
            inventoryItem {
                inventoryLevels(first: $location_count) {
                    nodes {
                        id
                        location {
                            id
                            name
                        }
                        quantities(names: ["available", "committed"]) {
                            name
                            quantity
                        }
                    }
                }
            }
        }
    }
`


interface VariantInventoryGQLResponse {
        productVariant: {
            inventoryQuantity: number,
            inventoryItem: {
                inventoryLevels: {
                    nodes: [
                        {
                            id: string,
                            location: {
                                id: string,
                                name: string
                            },
                            quantities: [
                                {
                                    name: string,
                                    quantity: number
                                }
                            ]
                        }
                    ]
                }
            }
        }
}

export async function getVariantInventory (
    client: ShopifyGraphQLClient,
    variant_id: string,
    location_count: number
): Promise<VariantInventory | null> {
    const res: ClientResponse<VariantInventoryGQLResponse> = await client.request<VariantInventoryGQLResponse>(getVariantInventoryQuery, {
        variant_id,
        location_count
    })

    if (res.errors != null) {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw res.errors
    }

    // fail fast if there was no match
    if (res.data == null || res.data.productVariant == null) {
        return null
    }

    let inventory: VariantInventory = {
        totalInventory: res.data.productVariant.inventoryQuantity,
        totalAvailableInventory: 0,
        totalCommittedInventory: 0,
        inventoryItem: {
            inventoryLevels: null
        }
    } // TODO: aggregate values
    return inventory
}