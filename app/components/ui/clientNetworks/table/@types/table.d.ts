import { clientNetworks, Client } from 'prisma/prisma-client'

export interface DataProps extends clientNetworks {
  Client: Client
  action?: string
}
