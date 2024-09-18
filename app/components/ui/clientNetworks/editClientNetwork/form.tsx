import { editClientNetworkAction } from '@/app/actions/client-networks/editClientNetworks'
import { Box, TextField, Button } from '@mui/material'
import { useServerAction } from 'zsa-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ToastAlertProps } from '../../shared/alert/toastAlert'
import { clientNetworks } from '@prisma/client'

const clientNetworkSchema = z.object({
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
  id: z.string(),
})
type clientNetworkSchemaInputs = z.infer<typeof clientNetworkSchema>
export default function ClientNetworkEditForm({
  onClose,
  setToast,
  clientNetwork,
}: {
  onClose: () => void
  clientNetwork: clientNetworks
  setToast: (toastData: ToastAlertProps) => void
}) {
  const { execute, isPending } = useServerAction(editClientNetworkAction)
  const {
    handleSubmit,
    register,
    setError,

    formState: { errors },
  } = useForm<clientNetworkSchemaInputs>({
    resolver: zodResolver(clientNetworkSchema),
    defaultValues: {
      id: clientNetwork.id,
      name: clientNetwork.name,
      network: clientNetwork.network,
      clientId: clientNetwork.clientId,
    },
  })
  async function onSubmit(dataForm: clientNetworkSchemaInputs) {
    const [, err] = await execute({
      ...dataForm,
    })
    if (err) {
      if (err.name === 'ZodError') {
        if (err.fieldErrors) {
          Object.keys(err.fieldErrors).forEach((field) => {
            setError(field as keyof clientNetworkSchemaInputs, {
              message:
                (
                  err.fieldErrors as Record<
                    keyof clientNetworkSchemaInputs,
                    string[]
                  >
                )[field as keyof clientNetworkSchemaInputs]?.[0] || '',
            })
            setToast({
              open: true,
              message:
                (
                  err.fieldErrors as Record<
                    keyof clientNetworkSchemaInputs,
                    string[]
                  >
                )[field as keyof clientNetworkSchemaInputs]?.[0] || '',
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
        label="Network"
        fullWidth
        margin="normal"
        {...register('network')}
        required
        error={!!errors?.network}
        helperText={errors.network?.message}
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
