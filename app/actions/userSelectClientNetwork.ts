'use server'
import { findManyCoreVpn } from '@/lib/actions/core-vpn.db.action'
import { updateUser } from '@/lib/actions/user.db.action'
import { getCurrentUser } from '@/lib/section'
import { MikrotikManager } from '@/lib/ssh/mikrotik'
import { z } from 'zod'
import { createServerAction, ZSAError } from 'zsa'
import { findClient } from '@/lib/actions/client.db.action'

export const userSelectClilentNetworkAction = createServerAction()
  .input(
    z.object({
      clientIdForVpn: z.string({
        required_error: 'Cliente é obrigatório',
      }),
    }),
    {
      type: 'json',
    },
  )
  .handler(async ({ input }) => {
    const currentUser = await getCurrentUser()
    const coreVpn = await findManyCoreVpn({})
    const currentClient = await findClient({
      id: input.clientIdForVpn,
    })
    if (!coreVpn || !coreVpn.length) {
      throw new Error('Vpn não encontrada')
    }

    if (!currentUser) {
      throw new Error('Usuário não encontrado')
    }
    if (!currentClient) {
      throw new Error('Cliente não encontrado')
    }
    for (const core of coreVpn) {
      const { ip, username, password, port } = core
      const mikrotik = new MikrotikManager(ip, username, password, port)
      try {
        await mikrotik.connect()
        const userIsOnline = await mikrotik.userL2tpIsOnline(
          currentUser.email ?? '',
        )
        if (!userIsOnline) {
          throw new ZSAError('NOT_AUTHORIZED', 'Você não está conectado')
        }
        const lengthIpMangle = await mikrotik.getIpMangleCount(
          currentUser.email ?? '',
        )
        if (lengthIpMangle > 0) {
          for (let index = 0; index < lengthIpMangle; index++) {
            await mikrotik.removeIpMangle(index)
          }
        }
        await mikrotik.createOrChangeIpMangle({
          clientName: currentClient.name,
          userName: currentUser.email ?? '',
        })
      } catch (error) {
        // validar se o error é ZSAError

        if (error instanceof ZSAError) {
          throw new ZSAError(error.code, error.message)
        }
        if (error instanceof Error) {
          throw new ZSAError('ERROR', error.message)
        } else {
          throw new ZSAError('ERROR', 'Unknown error')
        }
      }
      if (!currentUser) {
        throw new Error('Usuário não encontrado')
      }
      mikrotik.disconnect()
    }

    updateUser(
      {
        id: currentUser.id,
      },
      {
        Client: {
          connect: {
            id: input.clientIdForVpn,
          },
        },
      },
    )
  })
