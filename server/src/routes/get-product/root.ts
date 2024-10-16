import { TypeBoxTypeProvider, FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { GetProductRequestSchema, GetProductResponseSchema } from 'shared'
import { ShopifyGraphQLClient } from '../../shopify/shopify-client'
import { getProductById } from '../../shopify/product'
import { NotFoundError } from '../../util/errors'
import { logger } from '../../util/logger'

// maybe use a generic argument for FastifyPluginAsync if we use options with fastify instance
const getProduct: FastifyPluginAsyncTypebox = async (fastifyApp, { }): Promise<void> => {
    const fastify = fastifyApp.withTypeProvider<TypeBoxTypeProvider>()

    fastify.get('/', {
        schema: {
            querystring: GetProductRequestSchema,
            response: {
                200: GetProductResponseSchema,
            }
        }
    }, async (request, reply) => {
        if (!process.env.ACCESS_TOKEN || !process.env.STORE_URL) {
            throw new Error('Missing environment variables')
        }

        logger.info(process.env.ACCESS_TOKEN)
        logger.info(process.env.STORE_URL)

        const client = new ShopifyGraphQLClient(process.env.ACCESS_TOKEN, process.env.STORE_URL)
        const productTitle = await getProductById(client, request.query.id)
        if (!productTitle) {
            throw new NotFoundError('Product not found')
        }

        reply.status(200).send({result: { title: productTitle }})
    })
}

export default getProduct
