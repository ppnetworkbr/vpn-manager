import { Client } from 'prisma/prisma-client'

export interface DataProps extends Client {
  action?: string
}
