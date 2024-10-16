import axios from 'axios'

export class Client {
  public constructor (url: string) {
    axios.defaults.baseURL = url
  }

  async get<T>(path: string, params: Record<string, any>): Promise<T> {
    const response = await axios.get<T>(path, { params })
    return response.data
  }

  async post<T, U>(path: string, data: U): Promise<T> {
    const response = await axios.post<T>(path, data)
    return response.data
  }

  async put<T, U>(path: string, data: U): Promise<T> {
    const response = await axios.put<T>(path, data)
    return response.data
  }

  async delete<T>(path: string): Promise<T> {
    const response = await axios.delete<T>(path)
    return response.data
  }
}
