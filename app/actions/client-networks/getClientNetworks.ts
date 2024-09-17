'use server'
import { findManyClientNetworks } from '@/lib/actions/clientNetworks.db.action'
import { unstable_cache as unstableCache } from 'next/cache'

const getClientsNetworks = unstableCache(
  async () => {
    return await findManyClientNetworks({
      include: {
        Client: true,
      },
      where: {},
    })
  },
  ['client-networks'],
  {
    revalidate: 3600,
    tags: ['client-networks'],
  },
)
export default getClientsNetworks
