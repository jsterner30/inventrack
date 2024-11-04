import type { TSchema } from '@sinclair/typebox'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { logger } from './logger'

/**
 * This function validates the types at runtime and also asserts the type for Typescript
 * So using this function gets us two things:
 * 1. Better type checking and IDE hints in backend or frontend code (i.e. if the function returns true, Typescript knows
 *   that 'data' is of type T)
 * 2. Better type confidence at runtime (less important for this project)
 * @template T the type for the schema, preferably imported from the shared module (e.g. `type mytype = Static<typeof MySchema>`)
 * @param schema - the TypeBox schema, preferably imported from the shared module
 * @param data  - the data that you want to validate against the schema
 * @param descriptorMsg - an optional description you can use to describe the data for more descriptive error messages
 */
export function isValid<T> (schema: TSchema, data: unknown, descriptorMsg?: string): data is T {
  const validator = TypeCompiler.Compile(schema)
  if (validator.Check(data)) {
    return true
  }
  const errors = [...validator.Errors(data)].map(err => `\n\t${err.message} but received ${String(err.value)}`)
  logger.warn(`Errors when validating that ${descriptorMsg ?? 'data'} is of type ${schema.$id != null ? 'type ' + schema.$id : 'correct type'}:`, errors)
  return false
}
