import { findManyUsers } from '@/lib/actions/user.db.action'

export default async function countUsers(): Promise<number> {
  const users = await findManyUsers({})

  return users.length
}
