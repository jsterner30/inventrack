import { Static, Type } from '@fastify/type-provider-typebox'
import { Nullable } from './misc'

export const PageInfoSchema = Type.Object({
  hasNextPage: Type.Boolean(),
  hasPreviousPage: Type.Boolean(),
  startCursor: Nullable(Type.String()),
  endCursor: Nullable(Type.String())
})
export type PageInfo = Static<typeof PageInfoSchema>
