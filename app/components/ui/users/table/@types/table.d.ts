import { User } from 'prisma/prisma-client'

export interface UserExludePassword extends Omit<User, 'password'> {}
export interface DataProps extends UserExludePassword {
  action?: string
}
