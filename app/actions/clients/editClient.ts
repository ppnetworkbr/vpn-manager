'use server'

import { createServerAction, ZSAError } from 'zsa'
import { z } from 'zod'
import { findClient, updateClient } from '@/lib/actions/client.db.action'
import { revalidateTag } from 'next/cache'

export const editClientAction = createServerAction()
  .input(
    z.object({
      id: z.string(),
      name: z.string().min(5, {
        message: 'Nome deve ter no mínimo 5 caracteres',
      }),
      vpnIp: z.string().ip({
        message: 'IP inválido',
      }),
      vpnPreSharedKey: z.string().min(6, {
        message: 'Senha deve ter no mínimo 6 caracteres',
      }),
      vpnPassword: z.string().min(6, {
        message: 'Senha deve ter no mínimo 6 caracteres',
      }),
      vpnUser: z.string().min(2, {
        message: 'Nome de usuário deve ter no mínimo 2 caracteres',
      }),
      ipSourceAddress: z.string().ip({
        message: 'IP inválido',
      }),
    }),
    {
      type: 'json',
    },
  )
  .handler(async ({ input: { id, ...restInput } }) => {
    console.log(id, 'id', restInput, 'restInput')
    const existClient = await findClient({ id })

    if (!existClient) {
      throw new ZSAError('NOT_FOUND', 'Client não encontrado')
    }
    try {
      const result = await updateClient(
        {
          id,
        },
        {
          ...restInput,
        },
      )
      console.log(result, 'result')
    } catch (error) {
      console.log(error, 'error')
    }
    revalidateTag('clients')
  })
