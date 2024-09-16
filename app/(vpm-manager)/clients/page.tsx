import getClients from '@/app/actions/clients/getClients'
import { ProtectedLayout } from '@/app/components/layouts/protected'
import AddClient from '@/app/components/ui/clients/addClient/addClient'
import TableWithSearchBox from '@/app/components/ui/clients/table/tableWithSearchInputs'

export default async function PageClients() {
  const clients = await getClients()
  return (
    <ProtectedLayout>
      <AddClient />
      <TableWithSearchBox clients={clients} />
    </ProtectedLayout>
  )
}
