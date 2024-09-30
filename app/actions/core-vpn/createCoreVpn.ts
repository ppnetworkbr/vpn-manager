'use server'
import { createCoreVpn, findCoreVpn } from '@/lib/actions/core-vpn.db.action'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { createServerAction, ZSAError } from 'zsa'
export const createCoreVpnAction = createServerAction()
  .input(
    z.object({
      name: z.string().min(5, {
        message: 'Nome deve ter no mínimo 5 caracteres',
      }),
      ip: z.string().ip({
        message: 'IP inválido',
      }),
      ipSourceAddress: z.string().ip({ message: 'IP inválido' }).optional(),
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
  .onError((err) => {
    console.log(err, 'err')
  })
  .handler(async ({ input }) => {
    const exitCoreVpn = await findCoreVpn({ ip: input.ip, port: input.port })

    if (exitCoreVpn) {
      throw new ZSAError('CONFLICT', 'Core  já cadastrado')
    }

    await createCoreVpn({
      name: input.name,
      ip: input.ip,
      password: input.password,
      username: input.username,
      port: input.port,
    })
    revalidateTag('core-vpn')
  })
