import getClientsNetworks from '@/app/actions/client-networks/getClientNetworks'
import { ProtectedLayout } from '@/app/components/layouts/protected'
import AddClientNetwork from '@/app/components/ui/clientNetworks/addClientNetwork/addClientNetwork'
import TableWithSearchBox from '@/app/components/ui/clientNetworks/table/tableWithSearchInputs'

export default async function PageClientNetworks() {
  const clientNetworks = await getClientsNetworks()
  return (
    <ProtectedLayout>
      <AddClientNetwork />
      <TableWithSearchBox clientNetworks={clientNetworks} />
    </ProtectedLayout>
  )
}
