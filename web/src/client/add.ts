import {Client} from "./client";
import { AddRequest } from 'shared'
import { AddResponse } from 'shared'

export async function add(client: Client, params: AddRequest): Promise<AddResponse> {
    return await client.get<AddResponse>('/add', params)
}
