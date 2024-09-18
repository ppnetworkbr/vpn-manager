import { User } from 'prisma/prisma-client'

export type UserExcludeL2tpPassword = Omit<User, 'l2tpPassword'>
export type UserExludePassword = Omit<UserExcludeL2tpPassword, 'password'>
export interface DataProps extends UserExludePassword {
  action?: string
}
