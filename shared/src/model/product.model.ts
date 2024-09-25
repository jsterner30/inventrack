import { Static, Type } from '@fastify/type-provider-typebox'

// Best to use default values (i.e. { default: ... }) for Response types. They aren't as useful for request types.

export const GetProductResponseSchema = Type.Object({
    result: Type.Object({
        title: Type.String(),
    })
})
export type GetProductResponse = Static<typeof GetProductResponseSchema>

export const GetProductRequestSchema = Type.Object({
    id: Type.String(),
})
export type GetProductRequest = Static<typeof GetProductRequestSchema>

