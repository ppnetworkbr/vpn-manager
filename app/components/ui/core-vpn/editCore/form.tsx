import { editCoreVpnAction } from '@/app/actions/core-vpn/editCoreVpn'
import { Box, TextField, Button } from '@mui/material'
import { useServerAction } from 'zsa-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ToastAlertProps } from '../../shared/alert/toastAlert'
import { CoreVpn } from '@prisma/client'

const coreVpnSchema = z.object({
  name: z.string().min(5, {
    message: 'Nome deve ter no mínimo 5 caracteres',
  }),
  ip: z.string().ip(),
  password: z.string().min(6, {
    message: 'Senha deve ter no mínimo 6 caracteres',
  }),
  username: z.string().min(2, {
    message: 'Nome de usuário deve ter no mínimo 2 caracteres',
  }),
  port: z.number().int().min(1).max(65535, {
    message: 'Porta inválida',
  }),
  id: z.string(),
})
type coreVpnSchemaInputs = z.infer<typeof coreVpnSchema>
export default function CoreVpnEditForm({
  onClose,
  setToast,
  coreVpn,
}: {
  onClose: () => void
  coreVpn: CoreVpn
  setToast: (toastData: ToastAlertProps) => void
}) {
  const { execute, isPending } = useServerAction(editCoreVpnAction)
  const {
    handleSubmit,
    register,
    setError,

    formState: { errors },
  } = useForm<coreVpnSchemaInputs>({
    resolver: zodResolver(coreVpnSchema),
    defaultValues: {
      name: coreVpn.name,
      ip: coreVpn.ip,
      username: coreVpn.username,
      password: coreVpn.password,
      port: coreVpn.port,
      id: coreVpn.id,
    },
  })
  async function onSubmit(dataForm: coreVpnSchemaInputs) {
    const [, err] = await execute({
      ...dataForm,
    })
    if (err) {
      if (err.name === 'ZodError') {
        if (err.fieldErrors) {
          Object.keys(err.fieldErrors).forEach((field) => {
            setError(field as keyof coreVpnSchemaInputs, {
              message:
                (
                  err.fieldErrors as Record<keyof coreVpnSchemaInputs, string[]>
                )[field as keyof coreVpnSchemaInputs]?.[0] || '',
            })
            setToast({
              open: true,
              message:
                (
                  err.fieldErrors as Record<keyof coreVpnSchemaInputs, string[]>
                )[field as keyof coreVpnSchemaInputs]?.[0] || '',
              variant: 'error',
            })
          })
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
