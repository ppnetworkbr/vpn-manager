'use server'
import { findManyClients } from '@/lib/actions/client.db.action'
import { unstable_cache as unstableCache } from 'next/cache'

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
export default getClientsVpn
