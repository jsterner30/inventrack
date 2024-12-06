import { ShopifyGraphQLClient } from './shopify-client'
import { logger } from '../util/logger'
import {
  ProductSchema,
  Product,
  PageInfo,
  PageInfoSchema,
  UpdateInventoryResponse,
  UpdateInventoryResponseSchema
} from 'shared'
import { isValid } from '../util/validate'

const MAX_VARIANTS_COUNT = 10
const MAX_LOCATIONS_COUNT = 5

export const internalVariantQuery = /* GraphQL */ `
id
inventoryItem {
    id
    inventoryLevels(first: ${MAX_LOCATIONS_COUNT}) {
        nodes {
            id
            location {
                id
                name
            }
            quantities(names: ["available"]) {
                name
                quantity
            }
        }
    }
}
`

const internalProductQuery = /* GraphQL */ `
id
variants(first: ${MAX_VARIANTS_COUNT}) {
  nodes {
    ${internalVariantQuery}
  }
}
`

const getVariantLocationsQuery = /* GraphQL */ `
  query variantLocations($id: ID!) {
    productVariant(id: $id) {
      ${internalVariantQuery}
    }
  }
`

const getProductLocationsQuery = /* GraphQL */ `
  query productLocations($id: ID!) {
    product(id: $id) {
      ${internalProductQuery}
    }
  }
`

const inventoryItemMutation = /* GraphQL */ `
  mutation inventorySetQuantities($input: InventorySetQuantitiesInput!) {
    inventorySetQuantities(input: $input) {
      inventoryAdjustmentGroup {
        reason
        referenceDocumentUri
        changes {
          name
          delta
          quantityAfterChange
        }
      }
      userErrors {
        code
        field
        message
      }
    }
  }
`

interface InventoryLocation {
  inventoryItemId: string
  locationId: string
}

export async function getVariantInventoryLocation (
  client: ShopifyGraphQLClient,
  variantId: string
): Promise<InventoryLocation[] | null> {
  const { data, errors } = await client.request(getVariantLocationsQuery, {
    id: variantId
  }) as { data: Record<string, any>, errors: unknown }

  if (errors != null) {
    throw errors
  }

  // fail fast if there was no match
  if (data == null || data.productVariant == null) {
    return null
  }

  const variant = data.productVariant
  const inventoryLocations: InventoryLocation[] = []
  for (const inventoryLevel of variant.inventoryItem.inventoryLevels.nodes) {
    inventoryLocations.push({
      inventoryItemId: variant.inventoryItem.id,
      locationId: inventoryLevel.location.id
    })
  }

  return inventoryLocations
}

export async function getProductInventoryLocation (
  client: ShopifyGraphQLClient,
  productId: string
): Promise<InventoryLocation[] | null> {
  const { data, errors } = await client.request(getProductLocationsQuery, {
    id: productId
  }) as { data: Record<string, any>, errors: unknown }

  if (errors != null) {
    throw errors
  }

  // fail fast if there was no match
  if (data == null || data.product == null) {
    return null
  }

  const inventoryLocations: InventoryLocation[] = []
  for (const variant of data.product.variants.nodes) {
    for (const inventoryLevel of variant.inventoryItem.inventoryLevels.nodes) {
      inventoryLocations.push({
        inventoryItemId: variant.inventoryItem.id,
        locationId: inventoryLevel.location.id
      })
    }
  }

  return inventoryLocations
}

export async function updateAvailableInventory (
  client: ShopifyGraphQLClient,
  inventoryItemId: string,
  locationId: string,
  quantity: number
): Promise<UpdateInventoryResponse> {
  const { data, errors } = await client.request(inventoryItemMutation, {
    input: {
      ignoreCompareQuantity: true,
      reason: 'correction',
      name: 'available',
      quantities: [
        {
          inventoryItemId,
          locationId,
          quantity
        }
      ]
    }
  }) as { data: Record<string, unknown>, errors: unknown }

  if (errors != null) {
    throw errors
  }
  const response: any = data.inventorySetQuantities
  if (!isValid<UpdateInventoryResponse>(UpdateInventoryResponseSchema, response, 'inventory response')) {
    throw new Error('Error mapping response. Changes may have been made.')
  }
  return response
}
