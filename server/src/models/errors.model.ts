import { Type } from '@fastify/type-provider-typebox'

export const ErrorResSchema = Type.Object({
  error: Type.Object({
    code: Type.Number(),
    message: Type.String()
  })
})
