import { createCoreVpnAction } from '@/app/actions/core-vpn/createCoreVpn'
import { Box, TextField, Button } from '@mui/material'
import { useServerAction } from 'zsa-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ToastAlertProps } from '../../shared/alert/toastAlert'

const coreVpn = z.object({
  name: z.string().min(5, {
    message: 'Nome deve ter no mínimo 5 caracteres',
  }),
  username: z.string(),
  ip: z.string().ip({
    message: 'IP inválido',
  }),
  port: z.number().int().min(1).max(65535, {
    message: 'Porta inválida',
  }),
  password: z.string().min(6, {
    message: 'Senha deve ter no mínimo 6 caracteres',
  }),
})
type coreVpnInputs = z.infer<typeof coreVpn>
export default function CoreAddForm({
  onClose,
  setToast,
}: {
  onClose: () => void
  setToast: (toastData: ToastAlertProps) => void
}) {
  const { execute, isPending } = useServerAction(createCoreVpnAction, {})
  const {
    handleSubmit,
    register,
    setError,

    formState: { errors },
  } = useForm<coreVpnInputs>({
    resolver: zodResolver(coreVpn),
    defaultValues: {
      name: '',
      username: '',
      password: '',
      ip: '',
      port: 0,
    },
  })
  async function onSubmit(dataForm: coreVpnInputs) {
    const [, err] = await execute(dataForm)

    if (err) {
      if (err.code === 'CONFLICT') {
        setToast({
          open: true,
          message: err.message,
          variant: 'error',
        })
        setError(
          'ip',
          {
            message: 'IP/Porta já cadastrado',
            type: 'custom',
          },
          { shouldFocus: true },
        )
        setError(
          'port',
          {
            message: 'IP/Porta já cadastrado',
            type: 'custom',
          },
          { shouldFocus: true },
        )
      } else {
        if (err.name === 'ZodError') {
          if (err.fieldErrors) {
            Object.keys(err.fieldErrors).forEach((field) => {
              setError(field as keyof coreVpnInputs, {
                message: err?.fieldErrors[field as keyof coreVpnInputs]?.[0],
              })
              setToast({
                open: true,
                message:
                  err?.fieldErrors[field as keyof coreVpnInputs]?.[0] || '',
                variant: 'error',
              })
            })
          }
        }
      }
    } else {
      setToast({
        open: true,
        message: 'Core criado com sucesso',
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
        error={!!errors?.ip}
        helperText={errors.ip?.message}
        {...register('ip')}
        required
      />
      <TextField
        label="Porta"
        fullWidth
        type="number"
        margin="normal"
        error={!!errors?.port}
        helperText={errors.port?.message}
        {...register('port', {
          valueAsNumber: true,
        })}
        required
      />
      <TextField
        label="Usuário"
        fullWidth
        margin="normal"
        error={!!errors?.username}
        helperText={errors.username?.message}
        {...register('username')}
        required
      />
      <TextField
        label="Senha"
        fullWidth
        margin="normal"
        error={!!errors?.password}
        helperText={errors.password?.message}
        {...register('password')}
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
