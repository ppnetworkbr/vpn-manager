'use server'
import { createServerAction, ZSAError } from 'zsa'
import { findManyUsers, updateUser } from '@/lib/actions/user.db.action'
import { findManyCoreVpn } from '@/lib/actions/core-vpn.db.action'
import { MikrotikManager } from '@/lib/ssh/mikrotik'

export const checkAllConfigs = createServerAction().handler(async () => {
  const allCoresVpns = await findManyCoreVpn({})

  const users = await findManyUsers({})
  // verifica se todos os usuario possuem l2tpPassword caso não tenha ele ira criar um novo e salvar no banco, atualizar lista de usurios

  const usersWithoutL2tpPassword = users.filter((user) => !user.l2tpPassword)
  if (usersWithoutL2tpPassword.length === 0) {
    for (const { ip, username, password, port } of allCoresVpns) {
      const mikrotik = new MikrotikManager(ip, username, password, port)
      try {
        await mikrotik.connect()
        const data = await mikrotik.getL2TPUsers()
        if (data.length > 0) {
          for (const user of users) {
            await mikrotik.deleteL2TPUser(user.email)
          }
        }

        // criar usuario l2tp no mikrotik

        for (const user of users) {
          if (!user.l2tpPassword) {
            continue
          }
          try {
            await mikrotik.createL2TPUser({
              username: user.email,
              password: user.l2tpPassword,
            })
          } catch (error) {
            throw new ZSAError('NOT_FOUND', (error as Error).message)
          }
        }
        /// etapa para criar as vpns e ip list dos clientes

        mikrotik.disconnect()
      } catch (error) {
        await mikrotik.disconnect()
        if ((error as { level?: string }).level === 'client-authentication') {
          throw new ZSAError('NOT_AUTHORIZED', 'Erro de Usuário ou Senha')
        } else if ((error as { level?: string }).level === 'client-timeout') {
          throw new ZSAError('TIMEOUT', 'Tempo de conexão excedido')
        } else {
          if (
            (error as Error).message === 'Profile não encontrado no mikrotik'
          ) {
            throw new ZSAError('NOT_FOUND', (error as Error).message)
          }
        }
      }
    }
  } else {
    for (const user of usersWithoutL2tpPassword) {
      await updateUser(
        {
          id: user.id,
        },
        { l2tpPassword: Math.random().toString(36).slice(-8) },
      )
    }
  }
})
