import { Client } from "../client/client";
import { ReactNode, createContext } from "react";

export const ClientContext = createContext<Client | undefined>(
    undefined,
);

export function ClientProvider({
                               children,
                           }: {
    children: ReactNode | ReactNode[];
}) {
    const client = new Client('http://localhost:8080');
    return (
        <ClientContext.Provider value={client}>
            {children}
            </ClientContext.Provider>
    );
}