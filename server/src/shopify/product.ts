import { ShopifyGraphQLClient } from './shopify-client'
import { logger } from '../util/logger'
import { ProductSchema, Product, PageInfo, PageInfoSchema } from 'shared'
import { isValid } from '../util/validate'

const internalProductQuery = /* GraphQL */ `
id
handle
variants(first: 100) {
  nodes {
    id
    title
    image {
      url
    }
    contextualPricing(context: {}) {
      price {
        amount
        currencyCode
      }
    }
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

  const product: unknown = data.product
  if (!isValid<Product>(ProductSchema, product, 'product')) {
    return null
  }
  return product
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
  }) as any

  logger.info(data)
  logger.info(errors)

  if (errors != null) {
    throw errors
  }

  const products: Product[] = []
  for (const edge of data?.products.edges) {
    const product = edge.node
    if (!isValid<Product>(ProductSchema, product, 'product')) {
      throw new Error('Error mapping product')
    }
    products.push(product)
  }
  const pageInfo = data?.products.pageInfo
  if (!isValid<PageInfo>(PageInfoSchema, pageInfo, 'page info')) {
    throw new Error('Error mapping page info')
  }
  return [products, pageInfo]
}
