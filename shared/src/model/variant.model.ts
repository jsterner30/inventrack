import { Static, Type } from '@fastify/type-provider-typebox'
import { ImageObjSchema } from './image.model'
import { Nullable } from './misc'
import { VariantInventoryItemSchema } from './inventory.model'

export const VariantSchema = Type.Object({
  id: Type.String(),
  title: Type.String(),
  image: Nullable(ImageObjSchema),
  contextualPricing: Type.Object({
    price: Type.Object({
      amount: Type.String(),
      currencyCode: Type.String()
    })
  }),
  sku: Nullable(Type.String()),
  inventoryItem: VariantInventoryItemSchema
})
export type Variant = Static<typeof VariantSchema>
