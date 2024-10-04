import { findManyUsers } from '@/lib/actions/user.db.action'
import { createServerAction } from 'zsa'

export default async function countUsers(): Promise<number> {
  const users = await findManyUsers({})

  return users.length
}

export const countUsersServerAction = createServerAction().handler(async () => {
  const users = await findManyUsers({})

  return users.length
})
