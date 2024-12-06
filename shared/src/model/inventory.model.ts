import {Static, Type} from "@fastify/type-provider-typebox";

export const InventorySchema = Type.Object({
    totalInventory: Type.Integer(),
    totalCommittedInventory: Type.Integer(),
    totalAvailableInventory: Type.Integer()
})
export type Inventory = Static<typeof InventorySchema>
