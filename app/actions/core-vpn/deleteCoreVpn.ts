'use server'
import { createServerAction, ZSAError } from 'zsa'
import { z } from 'zod'
import {
  findCoreVpnWithUnique,
  deleteCoreVpn,
} from '@/lib/actions/core-vpn.db.action'
import { revalidateTag } from 'next/cache'

export const deleteCoreVpnAction = createServerAction()
  .input(
    z.object({
      id: z.string(),
    }),
    {
      type: 'json',
    },
  )
  .handler(async ({ input }) => {
    const existUser = await findCoreVpnWithUnique({ id: input.id })
    if (!existUser) {
      throw new ZSAError('NOT_FOUND', 'Core não encontrado')
    }
    await deleteCoreVpn({
      id: input.id,
    })
    revalidateTag('core-vpn')
  })
