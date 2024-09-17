'use server'
import { Prisma } from '@prisma/client'
import { db as prisma } from '../db'

export const createClientNetwork = async (
  data: Prisma.clientNetworksCreateManyInput,
) => {
  return await prisma.clientNetworks.create({
    data: {
      Client: {
        connect: {
          id: data.clientId,
        },
      },
      name: data.name,
      network: data.network,
    },
  })
}

export const updateClientNetwork = async (
  where: Prisma.clientNetworksWhereUniqueInput,
  data: Prisma.clientNetworksUpdateInput,
) => {
  return await prisma.clientNetworks.update({
    where,
    data,
  })
}

export const deleteClientNetwork = async (
  where: Prisma.clientNetworksWhereUniqueInput,
) => {
  return await prisma.clientNetworks.delete({
    where,
  })
}

export const findClientNetwork = async (
  where: Prisma.clientNetworksWhereInput,
) => {
  return await prisma.clientNetworks.findFirst({
    where,
  })
}

export const findClientNetworksWithUnique = async (
  where: Prisma.clientNetworksWhereUniqueInput,
) => {
  return await prisma.clientNetworks.findUnique({
    where,
  })
}

export async function findManyClientNetworks({
  where = {},
  include = {},
}: {
  include: Prisma.clientNetworksInclude
  where: Prisma.clientNetworksWhereInput
}) {
  return await prisma.clientNetworks.findMany({
    where,
    include,
  })
}
