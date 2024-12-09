import { Static, Type } from '@fastify/type-provider-typebox'
import { Nullable } from './misc'

export const VariantInventoryItemSchema = Type.Object({
  id: Type.String(),
  inventoryLevels: Type.Object({
    nodes: Type.Array(Type.Object({
      location: Type.Object({
        id: Type.String(),
        name: Type.String()
      }),
      quantities: Type.Array(Type.Object({
        name: Type.String(),
        quantity: Type.Integer()
      }))
    }))
  })
})
export type VariantInventoryItem = Static<typeof VariantInventoryItemSchema>

export const UpdateInventoryRequestSchema = Type.Object({
  // This productId is in the form of a raw number(as a string) like 7507889357006, not wrapped in a shopify gid url
  productId: Type.Optional(Type.String()),
  variantId: Type.Optional(Type.String()),
  locationId: Type.Optional(Type.String()),
  quantity: Type.Integer()
})
export type UpdateInventoryRequest = Static<typeof UpdateInventoryRequestSchema>

export const UpdateInventoryResponseSchema = Type.Object({
  inventoryAdjustmentGroup: Nullable(Type.Object({
    reason: Type.String(),
    changes: Type.Array(Type.Object({
      name: Type.String(),
      delta: Type.Integer()
    }))
  })),
  userErrors: Type.Array(Type.Object({
    field: Type.String(),
    message: Type.String()
  }))
})
export type UpdateInventoryResponse = Static<typeof UpdateInventoryResponseSchema>
