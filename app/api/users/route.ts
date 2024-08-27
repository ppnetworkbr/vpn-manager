import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import {
  createUser,
  deleteUser,
  findManyUsers,
  findUser,
  updateUser,
} from '@/lib/actions/user.db.action'
import bcrypt from 'bcryptjs'
import { currentRole, currentUser } from '@/lib/auth'
import { z } from 'zod'

// listar todos os usuários
export const GET = auth(async function GET(req) {
  if (!req.auth)
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })
  if ((await currentRole()) !== 'admin')
    return NextResponse.json({ message: 'Not authorized' }, { status: 403 })

  const users = await findManyUsers({})

  return NextResponse.json({ message: users })
})

// cadastar usuário
export const POST = auth(async function POST(req) {
  if (!req.auth)
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })
  if ((await currentRole()) !== 'admin')
    return NextResponse.json({ message: 'Not authorized' }, { status: 403 })

  // validar com zod
  const schemaCreateUser = z.object({
    email: z.string().email(),
    name: z.string().min(3),
    password: z.string().min(6),
    role: z.string().optional(),
  })
  try {
    const body = await req.json()

    // Validar os dados do corpo da requisição
    const validatedData = schemaCreateUser.parse(body)

    const { name, email, password } = validatedData

    const existingUser = await findUser({
      email,
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 400 },
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await createUser({
      email,
      name,
      password: hashedPassword,
    })

    return NextResponse.json({}, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Retornar erros de validação do zod
      return NextResponse.json(
        {
          errors: error.errors.map((err) => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 },
      )
    }

    // verificar se o usuário já existe
  }
})

// atualizar usuário seje nome ou senha

export const PUT = auth(async function PUT(req) {
  if (!req.auth)
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })

  const schemaUpdateUser = z.object({
    id: z.string(),
    email: z.string().email().optional(),
    name: z.string().min(3).optional(),
    password: z.string().min(6).optional(),
  })
  const id = req.nextUrl.pathname.split('/').pop()
  if (!id) {
    return NextResponse.json({ message: 'Id não encontrado' }, { status: 400 })
  }
  if ((await currentRole()) !== 'admin' && (await currentUser())?.id !== id) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 403 })
  }
  try {
    const body = await req.json()

    // Validar os dados do corpo da requisição
    const validatedData = schemaUpdateUser.parse(body)

    const { password, ...rest } = validatedData

    const existingUser = await findUser({
      id,
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 },
      )
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10)
      await updateUser(
        {
          id,
        },
        {
          password: hashedPassword,
          ...rest,
        },
      )
    } else {
      await updateUser(
        {
          id,
        },
        {
          ...rest,
        },
      )
    }

    return NextResponse.json({}, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Retornar erros de validação do zod
      return NextResponse.json(
        {
          errors: error.errors.map((err) => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 },
      )
    }
  }
})

// deletar usuário
export const DELETE = auth(async function DELETE(req) {
  if (!req.auth)
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })

  const id = req.nextUrl.pathname.split('/').pop()
  if (!id) {
    return NextResponse.json({ message: 'Id não encontrado' }, { status: 400 })
  }
  if ((await currentRole()) !== 'admin' && (await currentUser())?.id !== id) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 403 })
  }

  const existingUser = await findUser({
    id,
  })

  if (!existingUser) {
    return NextResponse.json(
      { error: 'Usuário não encontrado' },
      { status: 404 },
    )
  }

  await deleteUser({
    id,
  })

  return NextResponse.json({}, { status: 201 })
})
