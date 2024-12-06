import { Static, Type } from '@fastify/type-provider-typebox'
import { ImageObjSchema } from './image.model'
import { VariantSchema } from './variant.model'
import { PageInfoSchema } from './response.model'

export const ProductSchema = Type.Object({
  id: Type.String(),
  handle: Type.String(),
  title: Type.String(),
  images: Type.Object({
    nodes: Type.Array(ImageObjSchema)
  }),
  variants: Type.Object({
    nodes: Type.Array(VariantSchema)
  }),
  totalInventory: Type.Integer(),
  totalAvailableInventory: Type.Integer(),
  totalCommittedInventory: Type.Integer()
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

export const GetProductsRequestSchema = Type.Object({
  pageSize: Type.Integer(),
  after: Type.Optional(Type.String()),
  before: Type.Optional(Type.String())
})
export type GetProductsRequest = Static<typeof GetProductsRequestSchema>

export const GetProductsResponseSchema = Type.Object({
  result: Type.Array(ProductSchema),
  pageInfo: PageInfoSchema
})
export type GetProductsResponse = Static<typeof GetProductsResponseSchema>
