import { Static, Type } from '@fastify/type-provider-typebox'
import { ImageObjSchema } from './image.model'
import { VariantSchema } from './variant.model'

export const ProductSchema = Type.Object({
  id: Type.String(),
  handle: Type.String(),
  title: Type.String(),
  images: Type.Object({
    nodes: Type.Array(ImageObjSchema)
  }),
  variants: Type.Object({
    nodes: Type.Array(VariantSchema)
  })
})
export type Product = Static<typeof ProductSchema>

export const GetProductResponseSchema = Type.Object({
  result: ProductSchema
})
export type GetProductResponse = Static<typeof GetProductResponseSchema>

export const GetProductRequestSchema = Type.Object({
  id: Type.String()
})
export type GetProductRequest = Static<typeof GetProductRequestSchema>
