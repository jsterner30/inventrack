import { Static, Type } from '@fastify/type-provider-typebox'

// Best to use default values (i.e. { default: ... }) for Response types. They aren't as useful for request types.

export const AddResponseSchema = Type.Object({
  result: Type.Number({ default: 42 })
})
export type AddResponse = Static<typeof AddResponseSchema>

export const AddRequestSchema = Type.Object({
  a: Type.Number(),
  b: Type.Number()
})
export type AddRequest = Static<typeof AddRequestSchema>

