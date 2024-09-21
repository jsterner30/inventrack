import { Static, Type } from '@fastify/type-provider-typebox'

export const AddResponseSchema = Type.Object({
  result: Type.String()
})
export type AddResponse = Static<typeof AddResponseSchema>

export const AddRequestSchema = Type.Object({
  a: Type.Number(),
  b: Type.String()
})
export type AddRequest = Static<typeof AddRequestSchema>

