'use server'
import {
  createClientNetwork,
  findClientNetwork,
} from '@/lib/actions/clientNetworks.db.action'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { createServerAction, ZSAError } from 'zsa'
export const createClientNetworkAction = createServerAction()
  .input(
    z.object({
      name: z.string().min(5, {
        message: 'Nome deve ter no mínimo 5 caracteres',
      }),
      network: z.string().refine(
        (cidr) => {
          const regex =
            /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/([0-9]|[1-2][0-9]|3[0-2]))$/
          return regex.test(cidr)
        },
        { message: 'Network inválido' },
      ),
      clientId: z.string(),
    }),
    {
      type: 'json',
    },
  )
  .onError((err) => {
    console.log(err, 'err')
  })
  .handler(async ({ input: { name, network, clientId } }) => {
    const existClient = await findClientNetwork({ network })
    console.log(existClient, 'exitCoreVpn')
    if (existClient) {
      throw new ZSAError('CONFLICT', 'Rede  já cadastrada')
    }

    await createClientNetwork({
      name,
      network,
      clientId,
    })
    revalidateTag('client-networks')
  })
