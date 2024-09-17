import { createClientNetworkAction } from '@/app/actions/client-networks/createClientNetwork'
import { Box, TextField, Button, MenuItem } from '@mui/material'
import { useServerAction } from 'zsa-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ToastAlertProps } from '../../shared/alert/toastAlert'
import { useEffect, useState } from 'react'
import { Client } from '@prisma/client'
import { getClientUseServerAction } from '@/app/actions/clients/getClients'

const client = z.object({
  name: z.string().min(2, {
    message: 'Nome deve ter no mínimo 5 caracteres',
  }),
  network: z.string().refine(
    (cidr) => {
      const regex =
        /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/([0-9]|[1-2][0-9]|3[0-2]))$/
      return regex.test(cidr)
    },
    { message: 'Network inválido' },
  ),
  clientId: z.string(),
})
interface clientInputs extends z.infer<typeof client> {}
export default function ClientNetworkAddForm({
  onClose,
  setToast,
}: {
  onClose: () => void
  setToast: (toastData: ToastAlertProps) => void
}) {
  const [clientId, setClientId] = useState('')
  const [clients, setClients] = useState<Client[]>([])

  const getClients = useServerAction(getClientUseServerAction, {})

  async function fetchClientsAndSet() {
    const [clients, err] = await getClients.execute()
    if (err) {
      setToast({
        open: true,
        message: err.message,
        variant: 'error',
      })
    } else {
      setClients(clients)
    }
  }

  useEffect(() => {
    fetchClientsAndSet()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { execute, isPending } = useServerAction(createClientNetworkAction, {})
  const {
    handleSubmit,
    register,
    setError,

    formState: { errors },
  } = useForm<clientInputs>({
    resolver: zodResolver(client),
    defaultValues: {
      name: '',
      clientId: '',
      network: '',
    },
  })
  async function handleChangeClientId(e: React.ChangeEvent<HTMLInputElement>) {
    setClientId(e.target.value)
  }
  async function onSubmit(dataForm: clientInputs) {
    const [, err] = await execute(dataForm)

    if (err) {
      if (err.code === 'CONFLICT') {
        setToast({
          open: true,
          message: err.message,
          variant: 'error',
        })
        // setError(
        //   'ip',
        //   {
        //     message: 'IP/Porta já cadastrado',
        //     type: 'custom',
        //   },
        //   { shouldFocus: true },
        // )
        // setError(
        //   'port',
        //   {
        //     message: 'IP/Porta já cadastrado',
        //     type: 'custom',
        //   },
        //   { shouldFocus: true },
        // )
      } else {
        if (err.name === 'ZodError') {
          if (err.fieldErrors) {
            Object.keys(err.fieldErrors).forEach((field) => {
              setError(field as keyof clientInputs, {
                message: err?.fieldErrors[field as keyof clientInputs]?.[0],
              })
              setToast({
                open: true,
                message:
                  err?.fieldErrors[field as keyof clientInputs]?.[0] || '',
                variant: 'error',
              })
            })
          }
        }
      }
    } else {
      setToast({
        open: true,
        message: 'Rede criada com sucesso',
        variant: 'success',
      })

      onClose()
    }
  }

  return (
    <Box
      component={'form'}
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        maxWidth: '400px',
        mx: 'auto',
        mt: '8',
      }}
    >
      <TextField
        label="Nome"
        fullWidth
        margin="normal"
        {...register('name')}
        required
        error={!!errors?.name}
        helperText={errors.name?.message}
      />
      <TextField
        label="Network"
        fullWidth
        margin="normal"
        {...register('network')}
        required
        error={!!errors?.network}
        helperText={errors.network?.message}
      />

      <TextField
        select
        fullWidth
        margin="normal"
        label="Cliente"
        value={clientId}
        helperText={errors?.clientId?.message}
        error={!!errors?.clientId}
        slotProps={{
          input: {
            ...register('clientId'),
            onChange: handleChangeClientId,
          },
        }}
      >
        {clients.map((client) => (
          <MenuItem key={client.id} value={client.id}>
            {client.name}
          </MenuItem>
        ))}
      </TextField>

      <Button
        variant="contained"
        disabled={isPending}
        type="submit"
        sx={{
          mt: '1rem',
          width: '100%',
        }}
      >
        {isPending ? 'Salvando...' : 'Salvar'}
      </Button>
    </Box>
  )
}
