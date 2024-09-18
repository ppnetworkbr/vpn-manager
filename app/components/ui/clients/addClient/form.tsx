import { createClientAction } from '@/app/actions/clients/createClient'
import { Box, TextField, Button } from '@mui/material'
import { useServerAction } from 'zsa-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ToastAlertProps } from '../../shared/alert/toastAlert'

const client = z.object({
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
})
type clientInputs = z.infer<typeof client>
export default function ClientAddForm({
  onClose,
  setToast,
}: {
  onClose: () => void
  setToast: (toastData: ToastAlertProps) => void
}) {
  const { execute, isPending } = useServerAction(createClientAction, {})
  const {
    handleSubmit,
    register,
    setError,

    formState: { errors },
  } = useForm<clientInputs>({
    resolver: zodResolver(client),
    defaultValues: {
      name: '',
      vpnUser: '',
      vpnIp: '',
      ipSourceAddress: '',
      vpnPassword: '',
      vpnPreSharedKey: '',
    },
  })
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
        message: 'Cliente criado com sucesso',
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
        label="Ip Address Source"
        fullWidth
        margin="normal"
        error={!!errors?.ipSourceAddress}
        helperText={errors.ipSourceAddress?.message}
        {...register('ipSourceAddress')}
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
