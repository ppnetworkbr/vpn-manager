import { User } from 'prisma/prisma-client'

export interface DataProps extends Omit<User, 'password'> {
  action?: string
}
