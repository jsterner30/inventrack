import { Client } from './client'
import { GetProductsResponse, GetProductsRequest } from 'shared'

export async function getProducts (client: Client, params: GetProductsRequest): Promise<GetProductsResponse> {
  return await client.get<GetProductsResponse>('/products', params)
}
