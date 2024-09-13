'use server'
import { Prisma, CoreVpn } from '@prisma/client'
import { db as prisma } from '../db'

export const createCoreVpn = async (data: Prisma.CoreVpnCreateManyInput) => {
  return await prisma.coreVpn.create({
    data,
  })
}

export const updateCoreVpn = async (
  where: Prisma.CoreVpnWhereUniqueInput,
  data: Prisma.CoreVpnUpdateInput,
) => {
  return await prisma.coreVpn.update({
    where,
    data,
  })
}

export const deleteCoreVpn = async (where: Prisma.CoreVpnWhereUniqueInput) => {
  return await prisma.coreVpn.delete({
    where,
  })
}

export const findCoreVpnWithUnique = async (
  where: Prisma.CoreVpnWhereUniqueInput,
) => {
  return await prisma.coreVpn.findUnique({
    where,
  })
}

export const findCoreVpn = async (where: Prisma.CoreVpnWhereInput) => {
  return await prisma.coreVpn.findFirst({
    where,
  })
}

export async function findManyCoreVpn(where: Prisma.CoreVpnWhereInput) {
  try {
    return await prisma.coreVpn.findMany({
      where,
    })
  } catch (error) {
    return [] as CoreVpn[]
  }
}
