'use server'

import { createServerAction, ZSAError } from 'zsa'
import { MikrotikManager } from '@/lib/ssh/mikrotik'
import { z } from 'zod'
export const checkConnectionCoreVpn = createServerAction()
  .input(
    z.object({
      id: z.string(),
      ip: z.string(),
      username: z.string(),
      password: z.string(),
      port: z.number().int().min(1).max(65535),
    }),
    {
      type: 'json',
    },
  )
  .handler(async ({ input: { ip, username, password, port } }) => {
    const mikrotik = new MikrotikManager(ip, username, password, port)
    try {
      await mikrotik.connect()
      await mikrotik.disconnect()
    } catch (error) {
      await mikrotik.disconnect()
      if ((error as { level?: string }).level === 'client-authentication') {
        throw new ZSAError('NOT_AUTHORIZED', 'Erro de Usuário ou Senha')
      } else if ((error as { level?: string }).level === 'client-timeout') {
        throw new ZSAError('TIMEOUT', 'Tempo de conexão excedido')
      } else {
        throw new ZSAError('ERROR', 'Erro ao conectar')
      }
    }

    return true
  })
