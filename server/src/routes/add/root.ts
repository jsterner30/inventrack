import { TypeBoxTypeProvider, FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { AddResponseSchema, AddRequestSchema } from 'shared'

// maybe use a generic argument for FastifyPluginAsync if we use options with fastify instance
const add: FastifyPluginAsyncTypebox = async (fastifyApp, { }): Promise<void> => {
    const fastify = fastifyApp.withTypeProvider<TypeBoxTypeProvider>()

    fastify.get('/', {
        schema: {
            querystring: AddRequestSchema,
            response: {
                200: AddResponseSchema
            }
        }
    }, async (request, reply) => {
        const { a, b } = request.query
        reply.status(200).send({ result: a + b})
    })
}

export default add
