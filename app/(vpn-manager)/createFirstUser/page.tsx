'use server'

import countUsers from '@/app/actions/countUsers'
import FormCreateFristUserAdmin from '@/app/components/ui/login/fromCreateUsers'
import { Box } from '@mui/material'
import { permanentRedirect } from 'next/navigation'

export default async function CreateFistUserAdmin() {
  const numberUsers = await countUsers()
  if (numberUsers !== 0) {
    permanentRedirect('/login')
  }
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <FormCreateFristUserAdmin />
    </Box>
  )
}
