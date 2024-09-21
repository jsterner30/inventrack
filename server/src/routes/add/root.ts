import { Type, TypeBoxTypeProvider, FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'

// maybe use a generic argument for FastifyPluginAsync if we use options with fastify instance
const add: FastifyPluginAsyncTypebox = async (fastifyApp, { }): Promise<void> => {
    const fastify = fastifyApp.withTypeProvider<TypeBoxTypeProvider>()

    fastify.get('/', {
        schema: {
            querystring: Type.Object({
                a: Type.Number(),
                b: Type.Number()
            }),
            response: {
                200: Type.Object({result: Type.Number()})
            }
        }
    }, async (request, reply) => {
        const { a, b } = request.query
        reply.status(200).send({ result: a + b})
    })
}

export default add
