'use server'
import { Prisma } from '@prisma/client'
import { db as prisma } from '../db'

export const createUser = async (data: Prisma.UserCreateInput) => {
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

export const findUser = async (where: Prisma.UserWhereUniqueInput) => {
  return await prisma.user.findUnique({
    where,
  })
}

export async function findManyUsers(where: Prisma.UserWhereInput) {
  return await prisma.user.findMany({
    where,
    omit: {
      password: true,
    },
  })
}
