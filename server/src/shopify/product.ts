import { ShopifyGraphQLClient } from './shopify-client'
import { ProductSchema, Product } from 'shared'
import { isValid } from '../util/validate'

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
