import getClients from '@/app/actions/clients/getClients'
import { ProtectedLayout } from '@/app/components/layouts/protected'
import AddCoreVpn from '@/app/components/ui/clients/addClient/addClient'
import TableWithSearchBox from '@/app/components/ui/clients/table/tableWithSearchInputs'

export default async function PageCoreVPN() {
  const clients = await getClients()
  return (
    <ProtectedLayout>
      <AddCoreVpn />
      <TableWithSearchBox clients={clients} />
    </ProtectedLayout>
  )
}
