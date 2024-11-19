import { TypeBoxTypeProvider, FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { GetProductRequestSchema, GetProductResponseSchema, Product } from 'shared'
import { getProductById } from '../../shopify/product'
import { NotFoundError } from '../../util/errors'
import { ErrorResSchema } from '../../models/errors.model'
import { ServerOptions } from '../../server'

// maybe use a generic argument for FastifyPluginAsync if we use options with fastify instance
const getProduct: FastifyPluginAsyncTypebox<ServerOptions> = async (fastifyApp, { shopifyClient }): Promise<void> => {
  const fastify = fastifyApp.withTypeProvider<TypeBoxTypeProvider>()

  fastify.get('/', {
    schema: {
      querystring: GetProductRequestSchema,
      response: {
        200: GetProductResponseSchema,
        400: ErrorResSchema,
        404: ErrorResSchema
      }
    }
  }, async (request, reply) => {
    const product: Product | null = await getProductById(shopifyClient, request.query.id)
    if (product == null) {
      throw new NotFoundError('Product not found')
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    reply.status(200).send({ result: product })
  })
}

export default getProduct
