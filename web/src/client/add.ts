import {Client} from "./client";
import { AddRequest } from 'shared'

export async function add(client: Client, params: AddRequest): Promise<number> {
    return await client.get<number>('/add', params)
}
