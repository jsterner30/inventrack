import { ShopifyGraphQLClient } from './shopify-client'
import { logger } from '../util/logger'
import { ProductSchema, Product, PageInfo, PageInfoSchema } from 'shared'
import { isValid } from '../util/validate'
import {getVariantInventory, internalVariantQuery} from "./productVariant";

const internalProductQuery = /* GraphQL */ `
id
handle
variants(first: 100) {
  nodes {
    ${internalVariantQuery}
  }
}
title
totalInventory
images(first: 1) {
  nodes {
    url
    id
  }
}
`

const getProductByIdQuery = /* GraphQL */ `
  query productById($id: ID!) {
    product(id: $id) {
      ${internalProductQuery}
    }
  }
`

const getProductsQuery = /* GraphQL */ `
  query products($first: Int, $last: Int, $before: String, $after: String) {
    products(first: $first, last: $last, before: $before, after: $after) {
      edges {
        node {
          ${internalProductQuery}
        }
        cursor
      }
      pageInfo {
          hasPreviousPage
          hasNextPage
          startCursor
          endCursor
      }
    }
  }
`

async function parseProduct(product: any, client: ShopifyGraphQLClient): Promise<Product> {
  for (const variant of product.variants.nodes) {
    variant.inventory = await getVariantInventory(client, variant.id, variant.inventoryItem.locationsCount.count) // TODO: Reduce API calls
  }
  if (!isValid<Product>(ProductSchema, product, 'product')) {
    throw new Error('Error mapping product')
  }
  return product
}

export async function getProductById (
  client: ShopifyGraphQLClient,
  id: string
): Promise<Product | null> {
  const { data, errors } = await client.request(getProductByIdQuery, {
    id: `gid://shopify/Product/${id}`
  }) as { data: Record<string, unknown>, errors: unknown }

  if (errors != null) {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw errors
  }

  // fail fast if there was no match
  if (data == null || data.product == null) {
    return null
  }

  return await parseProduct(data.product, client)
}

export async function getProducts (
  client: ShopifyGraphQLClient,
  pageSize: number,
  before: String | null,
  after: String | null
): Promise<[Product[], PageInfo]> {
  const { data, errors } = await client.request(getProductsQuery, {
    last: (before == null) ? null : pageSize,
    first: (before == null) ? pageSize : null,
    before,
    after
  }) as Record<string, any>

  if (errors != null) {
    throw errors
  }

  if (data == null || data.products == null || data.products.edges == null || data.products.pageInfo == null) {
    logger.fatal('FATAL: data.products (or one of its children, edges or pageInfo) were null coming back from Shopify')
    throw new Error('Error getting data from Shopify GraphQL Endpoint')
  }

  const products: Product[] = []
  for (const edge of data.products.edges) {
    products.push(await parseProduct(edge.node, client))
  }
  const pageInfo = data.products.pageInfo
  if (!isValid<PageInfo>(PageInfoSchema, pageInfo, 'page info')) {
    throw new Error('Error mapping page info')
  }
  return [products, pageInfo]
}
