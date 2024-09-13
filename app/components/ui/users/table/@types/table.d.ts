import { User } from 'prisma/prisma-client'

export interface UserExcludeL2tpPassword extends Omit<User, 'l2tpPassword'> {}
export interface UserExludePassword
  extends Omit<UserExcludeL2tpPassword, 'password'> {}
export interface DataProps extends UserExludePassword {
  action?: string
}
