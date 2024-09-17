'use server'
import { createServerAction, ZSAError } from 'zsa'
import { z } from 'zod'
import {
  findClientNetworksWithUnique,
  deleteClientNetwork,
} from '@/lib/actions/clientNetworks.db.action'
import { revalidateTag } from 'next/cache'

export const deleteClientNetworkAction = createServerAction()
  .input(
    z.object({
      id: z.string(),
    }),
    {
      type: 'json',
    },
  )
  .handler(async ({ input }) => {
    const existClient = await findClientNetworksWithUnique({ id: input.id })
    if (!existClient) {
      throw new ZSAError('NOT_FOUND', 'Cliente não encontrado')
    }
    await deleteClientNetwork({
      id: input.id,
    })
    revalidateTag('client-networks')
  })
