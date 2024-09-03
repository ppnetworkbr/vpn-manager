'use client'
import { Button } from '@mui/material'

export default function ButtonAddUser({
  handleClickOpen,
}: {
  handleClickOpen: () => void
}) {
  return (
    <Button
      onClick={handleClickOpen}
      variant="outlined"
      sx={{
        minWidth: {
          xs: 'auto',
          sm: 'auto',
          md: 'auto',
          lg: '24.25rem',
        },
      }}
    >
      Criar Usuário{' '}
    </Button>
  )
}
