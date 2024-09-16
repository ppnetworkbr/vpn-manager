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
      ip: z.string().ip(),
      password: z.string().min(6, {
        message: 'Senha deve ter no mínimo 6 caracteres',
      }),
      username: z.string().min(2, {
        message: 'Nome de usuário deve ter no mínimo 2 caracteres',
      }),
      port: z.number().int().min(1).max(65535, {
        message: 'Porta inválida',
      }),
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
