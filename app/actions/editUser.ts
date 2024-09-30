'use server'

import { createServerAction, ZSAError } from 'zsa'
import { z } from 'zod'
import { findUser, updateUser } from '@/lib/actions/user.db.action'
import { revalidateTag } from 'next/cache'
import { Roles } from '@prisma/client'

export const editUserAction = createServerAction()
  .input(
    z.object({
      name: z.string().min(5, {
        message: 'Nome deve ter no mínimo 5 caracteres',
      }),
      email: z.string().email(),
      role: z.string().refine((role) => ['admin', 'technical'].includes(role), {
        message: 'Permissão inválida',
      }),
    }),
    {
      type: 'json',
    },
  )
  .handler(async ({ input }) => {
    const existUser = await findUser({ where: { email: input.email } })

    if (!existUser) {
      throw new ZSAError('NOT_FOUND', 'Usuário não encontrado')
    }
    await updateUser(
      {
        email: input.email,
      },
      {
        name: input.name,
        role: input.role === 'admin' ? Roles.admin : Roles.technical,
      },
    )
    revalidateTag('users')
  })
