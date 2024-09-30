'use server'
import { Prisma, User } from '@prisma/client'
import { db as prisma } from '../db'

export const createUser = async (data: Prisma.UserCreateManyInput) => {
  return await prisma.user.create({
    data,
  })
}

export const updateUser = async (
  where: Prisma.UserWhereUniqueInput,
  data: Prisma.UserUpdateInput,
) => {
  return await prisma.user.update({
    where,
    data,
  })
}

export const deleteUser = async (where: Prisma.UserWhereUniqueInput) => {
  return await prisma.user.delete({
    where,
  })
}

export const findUser = async ({
  where = {},
}: {
  where: Prisma.UserWhereInput
}) => {
  return await prisma.user.findFirst({
    where,
    select: {
      id: true,
      email: true,
      password: true,
      role: true,
      l2tpPassword: true,
      clientIdForVpn: true,
      emailVerified: true,
      createdAt: true,
      deletedAt: true,
      updatedAt: true,
      name: true,
    },
  })
}

export async function findManyUsers(where: Prisma.UserWhereInput) {
  try {
    return await prisma.user.findMany({
      where,
      omit: {
        password: true,
      },
    })
  } catch (error) {
    console.error(error, 'erro ao buscar usuários')
    return [{}] as User[]
  }
}
