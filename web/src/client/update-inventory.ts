import { Client } from './client'
import { UpdateInventoryResponse, UpdateInventoryRequest } from 'shared'

export async function updateInventory (client: Client, data: UpdateInventoryRequest): Promise<UpdateInventoryResponse> {
  return await client.post<UpdateInventoryResponse, UpdateInventoryRequest>('/update-inventory', data)
}
