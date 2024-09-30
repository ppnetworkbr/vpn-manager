'use client'

import { Box, Alert, TextField, MenuItem, Button } from '@mui/material'
import { Client, User } from '@prisma/client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useServerAction } from 'zsa-react'
import { userSelectClilentNetworkAction } from '@/app/actions/userSelectClientNetwork'
import { useState } from 'react'
import { ToastAlert, ToastAlertProps } from '../shared/alert/toastAlert'
interface SelectClientNetworkProps {
  clients: Client[]
  user: User
}
const clientSelectSchema = z.object({
  clientIdForVpn: z.string({
    required_error: 'Cliente é obrigatório',
  }),
})
type clientSelectSchemaInputs = z.infer<typeof clientSelectSchema>
export default function SelectClientNetwork({
  clients,
  user,
}: SelectClientNetworkProps) {
  const { handleSubmit, register } = useForm<clientSelectSchemaInputs>({
    resolver: zodResolver(clientSelectSchema),
    defaultValues: {
      clientIdForVpn: user.clientIdForVpn || '',
    },
  })

  const [select, setSelect] = useState<string>(user.clientIdForVpn || '')
  const [toast, setToast] = useState<ToastAlertProps>({
    open: false,
    variant: 'info',
    message: 'Rota alterada com sucesso',
  })
  const { execute, isPending } = useServerAction(userSelectClilentNetworkAction)
  const handleChangeSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSelect(value)
  }
  async function onSubmit(dataForm: clientSelectSchemaInputs) {
    const [, err] = await execute(dataForm)

    if (err) {
      setToast({
        open: true,
        variant: 'error',
        message: err.message,
      })
    } else {
      setToast({
        open: true,
        variant: 'success',
        message: 'Rota alterada com sucesso',
      })
    }
  }
  return (
    <Box
      sx={{
        width: '100%',
      }}
    >
      <Alert severity="info">Selecione o cliente para mudar o tráfego</Alert>
      <Box
        component={'form'}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          width: '100%',
          gap: 1,
          mt: 2,
        }}
      >
        <TextField
          select
          fullWidth
          margin="normal"
          label="Cliente"
          value={select}
          slotProps={{
            input: {
              ...register('clientIdForVpn'),
              onChange: handleChangeSelect,
            },
          }}
        >
          {clients.length > 0 ? (
            clients.map((client) => (
              <MenuItem key={client.id} value={client.id}>
                {client.name}
              </MenuItem>
            ))
          ) : (
            <MenuItem value={0}>Nenhum cliente</MenuItem>
          )}
        </TextField>
        <Button
          disabled={isPending}
          fullWidth
          type="submit"
          sx={{
            maxHeight: '4rem',
            height: '3.8rem',
            maxWidth: '10rem',
            whiteSpace: 'nowrap',
          }}
          variant="outlined"
        >
          Mudar
        </Button>
      </Box>
      <ToastAlert
        message={toast.message}
        onClose={() => setToast({ ...toast, open: false })}
        open={toast.open}
        variant={toast.variant}
      />
    </Box>
  )
}
