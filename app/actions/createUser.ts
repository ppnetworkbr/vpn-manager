'use server'
import { createUser, findUser } from '@/lib/actions/user.db.action'
import { Roles } from '@prisma/client'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { createServerAction, ZSAError } from 'zsa'
import { hash } from 'bcryptjs'
export const createUserAction = createServerAction()
  .input(
    z.object({
      name: z.string().min(5, {
        message: 'Nome deve ter no mínimo 5 caracteres',
      }),
      email: z.string().email(),
      password: z.string().min(6, {
        message: 'Senha deve ter no mínimo 6 caracteres',
      }),
      role: z.nativeEnum(Roles, {
        errorMap: () => ({ message: 'Permissão inválida' }),
      }),
    }),
    {
      type: 'json',
    },
  )
  .handler(async ({ input }) => {
    const existUser = await findUser({ where: { email: input.email } })
    if (existUser) {
      throw new ZSAError('CONFLICT', 'Email já cadastrado')
    }
    const passwordHash = await hash(input.password, 10)

    await createUser({
      name: input.name,
      email: input.email,
      password: passwordHash,
      l2tpPassword: Math.random().toString(36).slice(-8),
      role: input.role === 'admin' ? Roles.admin : Roles.technical,
    })
    revalidateTag('users')
  })
