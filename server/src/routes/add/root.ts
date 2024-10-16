import { TypeBoxTypeProvider, FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { AddResponseSchema, AddRequestSchema } from 'shared'
import { Value } from '@sinclair/typebox/value'

// maybe use a generic argument for FastifyPluginAsync if we use options with fastify instance
const add: FastifyPluginAsyncTypebox = async (fastifyApp): Promise<void> => {
  const fastify = fastifyApp.withTypeProvider<TypeBoxTypeProvider>()

  fastify.get('/', {
    schema: {
      querystring: AddRequestSchema,
      response: {
        200: AddResponseSchema
      }
    }
  }, async (request, reply) => {
    // Example of implementing the route
    // const { a, b } = request.query
    // const response = { result: a + b }

    // Example of mocking a route with Typebox
    const response = Value.Create(AddResponseSchema)

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    reply.status(200).send(response)
  })
}

export default add
