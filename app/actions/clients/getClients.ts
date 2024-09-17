'use server'
import { findManyClients } from '@/lib/actions/client.db.action'
import { unstable_cache as unstableCache } from 'next/cache'
import { createServerAction } from 'zsa'

const getClientsVpn = unstableCache(
  async () => {
    return await findManyClients({})
  },
  ['clients'],
  {
    revalidate: 3600,
    tags: ['clients'],
  },
)

export const getClientUseServerAction = createServerAction().handler(
  async () => {
    return await findManyClients({})
  },
)
export default getClientsVpn
