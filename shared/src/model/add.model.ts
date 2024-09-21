import { Static, Type } from '@sinclair/typebox'

export const AddResponseSchema = Type.Object({
  result: Type.Number()
})
export type AddResponse = Static<typeof AddResponseSchema>

export const AddRequestSchema = Type.Object({
  a: Type.Number(),
  b: Type.Number()
})
export type AddRequest = Static<typeof AddRequestSchema>

