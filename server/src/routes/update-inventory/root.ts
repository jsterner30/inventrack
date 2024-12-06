import { FastifyPluginAsyncTypebox, TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { UpdateInventoryRequestSchema, UpdateInventoryResponseSchema } from 'shared'
import { InvalidRequestError, NotFoundError } from '../../util/errors'
import { ErrorResSchema } from '../../models/errors.model'
import { ServerOptions } from '../../server'
import {
  getProductInventoryLocation,
  getVariantInventoryLocation,
  updateAvailableInventory
} from '../../shopify/inventory'

// maybe use a generic argument for FastifyPluginAsync if we use options with fastify instance
const updateInventory: FastifyPluginAsyncTypebox<ServerOptions> = async (fastifyApp, { shopifyClient }): Promise<void> => {
  const fastify = fastifyApp.withTypeProvider<TypeBoxTypeProvider>()

  const fastifyInstance = fastify.post('/', {
    schema: {
      body: UpdateInventoryRequestSchema,
      response: {
        200: UpdateInventoryResponseSchema,
        400: ErrorResSchema,
        404: ErrorResSchema
      }
    }
  }, async (request, reply) => {
    let inventoryPairs: Array<{ inventoryItemId: string, locationId: string }> | null

    if (request.body.variantId) {
      inventoryPairs = await getVariantInventoryLocation(shopifyClient, request.body.variantId)
      if (inventoryPairs == null) {
        throw new NotFoundError('Product variant not found')
      }
    } else if (request.body.productId) {
      inventoryPairs = await getProductInventoryLocation(shopifyClient, request.body.productId)
      if (inventoryPairs == null) {
        throw new NotFoundError('Product not found')
      }
    } else {
      throw new InvalidRequestError('Must specify either productId or variantId')
    }

    if (request.body.locationId) {
      inventoryPairs = inventoryPairs.filter(p => p.locationId === request.body.locationId)
    }
    if (inventoryPairs.length == 0) {
      throw new NotFoundError('Inventory Item not found')
    }
    if (inventoryPairs.length > 1) {
      // Error type
      throw new NotFoundError(`Multiple inventories found: ${inventoryPairs.toString()}`)
    }

    const response = await updateAvailableInventory(shopifyClient, inventoryPairs[0].inventoryItemId, inventoryPairs[0].locationId, request.body.quantity)

    reply.status(200).send(response)
  })
}

export default updateInventory
