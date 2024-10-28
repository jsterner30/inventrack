import { ShopifyGraphQLClient } from './shopify-client'
import { logger } from '../util/logger'
import { Product } from 'shared'

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

const getProductsQuery = /* TODO: page Size */ `
  query {
    products(first: 10) {
      nodes {
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
  pageSize: number
): Promise<Product[]> {
  const { data, errors } = await client.request(getProductsQuery, {
    // pageSize: `${pageSize}`
  }) as any

  logger.info(data)
  logger.info(errors)

  if (errors != null) {
    throw errors
  }

  const products: Product[] = []
  for (const prod of data?.products.nodes) {
    products.push({
      id: prod.id,
      title: prod.title,
      totalInventory: prod.totalInventory
    })
  }

  return products
}
