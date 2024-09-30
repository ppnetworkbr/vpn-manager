import getUsers from '@/app/actions/getUsers'
import { ProtectedLayout } from '@/app/components/layouts/protected'
import AddUser from '@/app/components/ui/users/addUser/addUser'
import TableWithSearchBox from '@/app/components/ui/users/table/tableWithSearchInputs'

export default async function UserPage() {
  const users = await getUsers()
  console.log(users, 'usuários ')
  return (
    <ProtectedLayout>
      <AddUser />
      <TableWithSearchBox users={users} />
    </ProtectedLayout>
  )
}
