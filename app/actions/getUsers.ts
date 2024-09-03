'use server'
import { findManyUsers } from '@/lib/actions/user.db.action'
import { unstable_cache as unstableCache } from 'next/cache'

const getUsers = unstableCache(
  async () => {
    return await findManyUsers({})
  },
  ['users'],
  {
    revalidate: 3600,
    tags: ['users'],
  },
)
export default getUsers
