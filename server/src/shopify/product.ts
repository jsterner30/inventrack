import { ShopifyGraphQLClient } from './shopify-client'
import { logger } from '../util/logger'

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
): Promise<string | null> {
  const { data, errors } = await client.request(getProductByIdQuery, {
    id: `gid://shopify/Product/${id}`
  }) as any

  logger.info(data)
  logger.info(errors)

  if (errors != null) {
    throw errors
  }

  return data?.product?.title != null ? data?.product?.title : null
}
