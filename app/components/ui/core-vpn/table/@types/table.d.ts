import { CoreVpn } from 'prisma/prisma-client'

export interface DataProps extends CoreVpn {
  action?: string
}
