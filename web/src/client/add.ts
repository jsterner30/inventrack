import {Client} from "./client";

export async function add(client: Client, a: number, b: number): Promise<number> {
    return await client.get<number>('/add', {
        a,
        b
    })
}