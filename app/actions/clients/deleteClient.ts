'use server'
import { createServerAction, ZSAError } from 'zsa'
import { z } from 'zod'
import { findClient, deleteClient } from '@/lib/actions/client.db.action'
import { revalidateTag } from 'next/cache'

export const deleteClientAction = createServerAction()
  .input(
    z.object({
      id: z.string(),
    }),
    {
      type: 'json',
    },
  )
  .handler(async ({ input }) => {
    const existClient = await findClient({ id: input.id })
    if (!existClient) {
      throw new ZSAError('NOT_FOUND', 'Cliente não encontrado')
    }
    await deleteClient({
      id: input.id,
    })
    revalidateTag('clients')
  })
