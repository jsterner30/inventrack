import { Client } from './client'
import { GetProductResponse, GetProductRequest } from 'shared'

export async function getProduct (client: Client, params: GetProductRequest): Promise<GetProductResponse> {
  return await client.get<GetProductResponse>('/get-product', params)
}
