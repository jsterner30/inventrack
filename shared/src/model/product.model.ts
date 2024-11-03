import { Static, Type } from '@fastify/type-provider-typebox'
import { PageInfoSchema } from "./response.model";

// Best to use default values (i.e. { default: ... }) for Response types. They aren't as useful for request types.
export const ProductSchema = Type.Object({
  id: Type.String(),
  title: Type.String(),
  totalInventory: Type.Integer()
})
export type Product = Static<typeof ProductSchema>

export const GetProductRequestSchema = Type.Object({
  id: Type.String()
})
export type GetProductRequest = Static<typeof GetProductRequestSchema>

export const GetProductResponseSchema = Type.Object({
  result: ProductSchema
})
export type GetProductResponse = Static<typeof GetProductResponseSchema>

export const GetProductsRequestSchema = Type.Object({
  pageSize: Type.Integer(),
  after: Type.Optional(Type.String()),
  before: Type.Optional(Type.String()),
})
export type GetProductsRequest = Static<typeof GetProductsRequestSchema>

export const GetProductsResponseSchema = Type.Object({
  result: Type.Array(ProductSchema),
  pageInfo: PageInfoSchema
})
export type GetProductsResponse = Static<typeof GetProductsResponseSchema>
