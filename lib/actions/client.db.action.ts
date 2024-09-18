'use server'
import { Prisma } from '@prisma/client'
import { db as prisma } from '../db'

export const createClient = async (data: Prisma.ClientCreateManyInput) => {
  return await prisma.client.create({
    data,
  })
}

export const updateClient = async (
  where: Prisma.ClientWhereUniqueInput,
  data: Prisma.ClientUpdateInput,
) => {
  return await prisma.client.update({
    where,
    data,
  })
}

export const deleteClient = async (where: Prisma.ClientWhereUniqueInput) => {
  return await prisma.client.delete({
    where,
  })
}

export const findClient = async (where: Prisma.ClientWhereUniqueInput) => {
  return await prisma.client.findUnique({
    where,
  })
}

export async function findManyClients(where: Prisma.ClientWhereInput) {
  return await prisma.client.findMany({
    where,
    orderBy: {
      name: 'asc',
    },
  })
}
