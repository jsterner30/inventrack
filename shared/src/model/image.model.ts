import { Static, Type } from '@fastify/type-provider-typebox'

export const ImageObjSchema = Type.Object({
  url: Type.String(),
  id: Type.String()
})
export type ImageObj = Static<typeof ImageObjSchema>
