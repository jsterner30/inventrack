import { type TSchema, Type } from '@fastify/type-provider-typebox'

// use: const T = Nullable(Type.String())
export const Nullable = <T extends TSchema>(schema: T): TSchema => Type.Union([schema, Type.Null()])
/*
This might be better but not sure:

const Nullable = <T extends TSchema>(schema: T) => Type.Unsafe<Static<T> | null>({
  ...schema, nullable: true
})
 */
