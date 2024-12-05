import {Static, Type} from "@fastify/type-provider-typebox";

export const VariantInventorySchema = Type.Object({
    totalInventory: Type.Integer(),
    totalCommittedInventory: Type.Integer(),
    totalAvailableInventory: Type.Integer(),
    inventoryItem: Type.Object({
        inventoryLevels: Type.Null() // TODO
    })
})
export type VariantInventory = Static<typeof VariantInventorySchema>
