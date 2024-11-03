import { ShopifyGraphQLClient } from './shopify-client'
import { logger } from '../util/logger'
import { Product, PageInfo } from 'shared'

const getProductByIdQuery = /* GraphQL */ `
  query productById($id: ID!) {
    product(id: $id) {
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
    }
  }
`

export async function getProductById (
  client: ShopifyGraphQLClient,
  id: string
): Promise<Product | null> {
  const { data, errors } = await client.request(getProductByIdQuery, {
    id: `gid://shopify/Product/${id}`
  }) as any

  logger.info(data)
  logger.info(errors)

  if (errors != null) {
    throw errors
  }

  if (data?.product == null) {
    return null
  }

  return {
    id: data?.product.id,
    title: data?.product.title,
    totalInventory: data?.product.totalInventory
  }
}

const getProductsQuery = /* GraphQL */ `
  query products($first: Int, $last: Int, $before: String, $after: String) {
    products(first: $first, last: $last, before: $before, after: $after) {
      edges {
        node {
            id
            title
            totalInventory
            handle
            variantsCount {
                count
                precision
            }
            variants(first: 20) {
                nodes {
                    title
                    sku
                    displayName
                    inventoryQuantity
                }
            }
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

export async function getProducts (
  client: ShopifyGraphQLClient,
  pageSize: number,
  before: String | null,
  after: String | null
): Promise<[Product[], PageInfo]> {
  const { data, errors } = await client.request(getProductsQuery, {
    last: (before == null) ? null : pageSize,
    first: (before == null) ? pageSize : null,
    before: before,
    after: after
  }) as any

  logger.info(data)
  logger.info(errors)

  if (errors != null) {
    throw errors
  }

  const products: Product[] = []
  for (const edge of data?.products.edges) {
    const prod = edge.node
    products.push({
      id: prod.id,
      title: prod.title,
      totalInventory: prod.totalInventory
    })
  }
  return [products, data?.products.pageInfo]
}
