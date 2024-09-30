'use server'
import { createClient, findClient } from '@/lib/actions/client.db.action'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { createServerAction, ZSAError } from 'zsa'
export const createClientAction = createServerAction()
  .input(
    z.object({
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
  .onError((err) => {
    console.log(err, 'err')
  })
  .handler(
    async ({
      input: {
        name,
        vpnIp,
        vpnPassword,
        vpnPreSharedKey,
        vpnUser,
        ipSourceAddress,
      },
    }) => {
      const existClient = await findClient({ vpnIp })

      if (existClient) {
        throw new ZSAError('CONFLICT', 'Cliente  já cadastrado')
      }

      await createClient({
        name,
        vpnIp,
        vpnPassword,
        vpnPreSharedKey,
        ipSourceAddress,
        vpnUser,
      })
      revalidateTag('clients')
    },
  )
