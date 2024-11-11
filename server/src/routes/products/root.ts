import { TypeBoxTypeProvider, FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import {
  GetProductsRequestSchema,
  GetProductsResponseSchema
} from 'shared'
import { getProducts } from '../../shopify/product'
import { ServerOptions } from '../../server'

// maybe use a generic argument for FastifyPluginAsync if we use options with fastify instance
const getProduct: FastifyPluginAsyncTypebox<ServerOptions> = async (fastifyApp, { shopifyClient }): Promise<void> => {
  const fastify = fastifyApp.withTypeProvider<TypeBoxTypeProvider>()

  fastify.get('/', {
    schema: {
      querystring: GetProductsRequestSchema,
      response: {
        200: GetProductsResponseSchema
      }
    }
  }, async (request, reply) => {
    const pageSize = request.query.pageSize
    const before = request.query.before ?? null
    const after = request.query.after ?? null
    const [products, pageInfo] = await getProducts(shopifyClient, pageSize, before, after)

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    reply.status(200).send({ result: products, pageInfo })
  })
}

export default getProduct
