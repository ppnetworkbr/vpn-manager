'use server'

import { createServerAction, ZSAError } from 'zsa'
import { z } from 'zod'
import {
  findClientNetwork,
  updateClientNetwork,
} from '@/lib/actions/clientNetworks.db.action'
import { findClient } from '@/lib/actions/client.db.action'
import { revalidateTag } from 'next/cache'

export const editClientNetworkAction = createServerAction()
  .input(
    z.object({
      id: z.string(),
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
  .handler(async ({ input: { id, network, clientId, ...restInput } }) => {
    const existClient = await findClient({ id: clientId })
    if (!existClient) {
      throw new ZSAError('NOT_FOUND', 'Cliente não encontrado')
    }
    const existClientNetowrk = await findClientNetwork({ network })

    if (existClientNetowrk) {
      throw new ZSAError('NOT_FOUND', 'Rede já cadastrada')
    }
    await updateClientNetwork(
      {
        id,
      },
      {
        ...restInput,
      },
    )
    revalidateTag('client-networks')
  })
