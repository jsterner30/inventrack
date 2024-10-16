import { Client } from '../client/client'
import { ReactNode, createContext, type ReactElement } from 'react'

export const ClientContext = createContext<Client | undefined>(
  undefined
)

export function ClientProvider ({
  children
}: {
  children: ReactNode | ReactNode[]
}): ReactElement {
  const client = new Client('http://localhost:8080')
  return (
    <ClientContext.Provider value={client}>
      {children}
    </ClientContext.Provider>
  )
}
