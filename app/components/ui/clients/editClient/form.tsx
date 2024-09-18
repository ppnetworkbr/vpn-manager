import { editClientAction } from '@/app/actions/clients/editClient'
import { Box, TextField, Button } from '@mui/material'
import { useServerAction } from 'zsa-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ToastAlertProps } from '../../shared/alert/toastAlert'
import { Client } from '@prisma/client'

const clientSchema = z.object({
  name: z.string().min(5, {
    message: 'Nome deve ter no mínimo 5 caracteres',
  }),
  vpnIp: z.string().ip({
    message: 'IP inválido',
  }),
  ipSourceAddress: z.string().ip({
    message: 'IP inválido',
  }),
  vpnPreSharedKey: z.string().min(6, {
    message: 'Senha deve ter no mínimo 6 caracteres',
  }),
  vpnPassword: z.string().min(6, {
    message: 'Senha deve ter no mínimo 6 caracteres',
  }),
  vpnUser: z.string().min(2, {
    message: 'Nome de usuário deve ter no mínimo 2 caracteres',
  }),
  id: z.string(),
})
type clientSchemaInputs = z.infer<typeof clientSchema>
export default function ClientEditForm({
  onClose,
  setToast,
  client,
}: {
  onClose: () => void
  client: Client
  setToast: (toastData: ToastAlertProps) => void
}) {
  const { execute, isPending } = useServerAction(editClientAction)
  const {
    handleSubmit,
    register,
    setError,

    formState: { errors },
  } = useForm<clientSchemaInputs>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      id: client.id,
      name: client.name,
      ipSourceAddress: client.ipSourceAddress,
      vpnUser: client.vpnUser,
      vpnIp: client.vpnIp,
      vpnPassword: client.vpnPassword,

      vpnPreSharedKey: client.vpnPreSharedKey,
    },
  })
  async function onSubmit(dataForm: clientSchemaInputs) {
    const [, err] = await execute({
      ...dataForm,
    })
    if (err) {
      if (err.name === 'ZodError') {
        if (err.fieldErrors) {
          Object.keys(err.fieldErrors).forEach((field) => {
            setError(field as keyof clientSchemaInputs, {
              message:
                (err.fieldErrors as Record<keyof clientSchemaInputs, string[]>)[
                  field as keyof clientSchemaInputs
                ]?.[0] || '',
            })
            setToast({
              open: true,
              message:
                (err.fieldErrors as Record<keyof clientSchemaInputs, string[]>)[
                  field as keyof clientSchemaInputs
                ]?.[0] || '',
              variant: 'error',
            })
          })
        }
      }
    } else {
      setToast({
        open: true,
        message: 'Cliente alterado com sucesso',
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
        label="IP"
        fullWidth
        margin="normal"
        error={!!errors?.vpnIp}
        helperText={errors.vpnIp?.message}
        {...register('vpnIp')}
        required
      />
      <TextField
        label="Usuário"
        fullWidth
        margin="normal"
        error={!!errors?.vpnUser}
        helperText={errors.vpnUser?.message}
        {...register('vpnUser')}
        required
      />
      <TextField
        label="Senha"
        fullWidth
        margin="normal"
        error={!!errors?.vpnPassword}
        helperText={errors.vpnPassword?.message}
        {...register('vpnPassword')}
        required
      />
      <TextField
        label="Pre Shared Key"
        fullWidth
        margin="normal"
        error={!!errors?.vpnPreSharedKey}
        helperText={errors.vpnPreSharedKey?.message}
        {...register('vpnPreSharedKey')}
        required
      />
      <TextField
        label="Ip Source Address"
        fullWidth
        margin="normal"
        error={!!errors?.ipSourceAddress}
        helperText={errors.ipSourceAddress?.message}
        {...register('ipSourceAddress')}
        required
      />

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
