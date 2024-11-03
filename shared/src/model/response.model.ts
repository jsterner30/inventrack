import {Static, Type} from "@fastify/type-provider-typebox";

export const PageInfoSchema = Type.Object({
    hasNextPage: Type.Boolean(),
    hasPreviousPage: Type.Boolean(),
    startCursor: Type.String(),
    endCursor: Type.String(),
});
export type PageInfo = Static<typeof PageInfoSchema>
