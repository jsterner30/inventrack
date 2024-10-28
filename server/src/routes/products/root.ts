import { TypeBoxTypeProvider, FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import {
  GetProductsRequestSchema,
  GetProductsResponseSchema
} from 'shared'
import { ShopifyGraphQLClient } from '../../shopify/shopify-client'
import { getProducts } from '../../shopify/product'
import { logger } from '../../util/logger'

// maybe use a generic argument for FastifyPluginAsync if we use options with fastify instance
const getProduct: FastifyPluginAsyncTypebox = async (fastifyApp): Promise<void> => {
  const fastify = fastifyApp.withTypeProvider<TypeBoxTypeProvider>()

  fastify.get('/', {
    schema: {
      querystring: GetProductsRequestSchema,
      response: {
        200: GetProductsResponseSchema
      }
    }
  }, async (request, reply) => {
    if (process.env.ACCESS_TOKEN == null || process.env.STORE_URL == null) {
      throw new Error('Missing environment variables')
    }

    logger.info(process.env.ACCESS_TOKEN)
    logger.info(process.env.STORE_URL)

    const client = new ShopifyGraphQLClient(process.env.ACCESS_TOKEN, process.env.STORE_URL)
    const products = await getProducts(client, request.query.pageSize)

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    reply.status(200).send({ result: products })
  })
}

export default getProduct
