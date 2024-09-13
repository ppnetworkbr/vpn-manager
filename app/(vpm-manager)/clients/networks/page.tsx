import getCoreVpns from '@/app/actions/core-vpn/getCoreVpn'
import { ProtectedLayout } from '@/app/components/layouts/protected'
import AddCoreVpn from '@/app/components/ui/core-vpn/addCore/addCore'
import TableWithSearchBox from '@/app/components/ui/core-vpn/table/tableWithSearchInputs'

export default async function PageNetworkClients() {

  return (
    <ProtectedLayout>
      <h1>
        Network
      </h1>
    </ProtectedLayout>
  )
}
