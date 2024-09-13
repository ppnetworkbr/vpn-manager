'use server'

import { createServerAction, ZSAError } from 'zsa'
import { z } from 'zod'
import {
  findCoreVpnWithUnique,
  updateCoreVpn,
} from '@/lib/actions/core-vpn.db.action'
import { revalidateTag } from 'next/cache'

export const editCoreVpnAction = createServerAction()
  .input(
    z.object({
      name: z.string().min(5, {
        message: 'Nome deve ter no mínimo 5 caracteres',
      }),
      id: z.string(),
      password: z.string(),
      ip: z.string(),
      username: z.string(),
    }),
    {
      type: 'json',
    },
  )
  .handler(async ({ input: { id, ...restInput } }) => {
    const existUser = await findCoreVpnWithUnique({ id })

    if (!existUser) {
      throw new ZSAError('NOT_FOUND', 'Core não encontrado')
    }
    await updateCoreVpn(
      {
        id,
      },
      {
        ...restInput,
      },
    )
    revalidateTag('core-vpn')
  })
