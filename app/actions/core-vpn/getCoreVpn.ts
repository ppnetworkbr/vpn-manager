'use server'
import { findManyCoreVpn } from '@/lib/actions/core-vpn.db.action'
import { unstable_cache as unstableCache } from 'next/cache'

const getCoreVpn = unstableCache(
  async () => {
    return await findManyCoreVpn({})
  },
  ['core-vpn'],
  {
    revalidate: 3600,
    tags: ['core-vpn'],
  },
)
export default getCoreVpn
