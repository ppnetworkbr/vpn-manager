'use server'
import { ProtectedLayout } from '@/app/components/layouts/protected'
import SelectClientNetwork from '@/app/components/ui/home/selectClientNetwork'
import UserData from '@/app/components/ui/home/userData'
import { findManyIpCoreVpn } from '@/lib/actions/core-vpn.db.action'
import { Paper } from '@mui/material'
import { auth } from '@/auth'
import { findManyClients } from '@/lib/actions/client.db.action'
import { findUser } from '@/lib/actions/user.db.action'

export default async function Home() {
  const ipsCoreVpn = await findManyIpCoreVpn({})
  const clients = await findManyClients({})
  const session = await auth()

  const user = await findUser({ where: { id: session?.user?.id } })
  if (!user) return null
  return (
    <ProtectedLayout>
      <Paper
        sx={{
          minWidth: '300px',
          padding: '20px',
          display: 'flex',
          width: '100%',
          gap: 2,
          flexDirection: 'column',
          alignItems: 'center', // Centraliza os itens no Paper
        }}
      >
        <SelectClientNetwork clients={clients} user={user} />
        <UserData coreVpns={ipsCoreVpn} />
      </Paper>
    </ProtectedLayout>
  )
}
