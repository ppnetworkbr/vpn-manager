'use server'
import { createServerAction, ZSAError } from 'zsa'
import { z } from 'zod'
import { findUser, deleteUser } from '@/lib/actions/user.db.action'
import { revalidateTag } from 'next/cache'

export const deleteUserAction = createServerAction()
  .input(
    z.object({
      id: z.string(),
    }),
    {
      type: 'json',
    },
  )
  .handler(async ({ input }) => {
    const existUser = await findUser({ where: { id: input.id } })
    if (!existUser) {
      throw new ZSAError('NOT_FOUND', 'Usuário não encontrado')
    }
    await deleteUser({
      id: input.id,
    })
    revalidateTag('users')
  })
