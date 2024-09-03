import { createUserAction } from '@/app/actions/createUser'
import { Box, TextField, MenuItem, Button } from '@mui/material'
import { useServerAction } from 'zsa-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ToastAlertProps } from '../../shared/alert/toastAlert'
import { useState } from 'react'
import { Roles } from '@prisma/client'

const userSchema = z.object({
  name: z.string().min(5, {
    message: 'Nome deve ter no mínimo 5 caracteres',
  }),
  email: z.string().email(),
  password: z.string().min(6, {
    message: 'Senha deve ter no mínimo 6 caracteres',
  }),
  role: z.nativeEnum(Roles, {
    errorMap: () => (
      { message: 'Permissão inválida' }),
  }),
})
interface userSchemaInputs extends z.infer<typeof userSchema> {}
export default function UserAddForm({
  onClose,
  setToast,
}: {
  onClose: () => void
  setToast: (toastData: ToastAlertProps) => void
}) {
  const { execute, isPending } = useServerAction(createUserAction, {})
  const [roleValue, setRoleValue] = useState<Roles>(Roles.technical)
  const {
    handleSubmit,
    register,
    setError,

    formState: { errors },
  } = useForm<userSchemaInputs>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: roleValue,
    },
  })
  async function onSubmit(dataForm: userSchemaInputs) {
    const [, err] = await execute(dataForm)

    if (err) {
      if (err.code === 'CONFLICT') {
        setToast({
          open: true,
          message: err.message,
          variant: 'error',
        })
        setError(
          'email',
          {
            message: 'Email já cadastrado',
            type: 'custom',
          },
          { shouldFocus: true },
        )
      } else {
        if (err.name === 'ZodError') {
          if (err.fieldErrors) {
            Object.keys(err.fieldErrors).forEach((field) => {
              setError(field as keyof userSchemaInputs, {
                message: err?.fieldErrors[field as keyof userSchemaInputs]?.[0],
              })
              setToast({
                open: true,
                message:
                  err?.fieldErrors[field as keyof userSchemaInputs]?.[0] || '',
                variant: 'error',
              })
            })
          }
        }
      }
    } else {
      setToast({
        open: true,
        message: 'Usuário criado com sucesso',
        variant: 'success',
      })

      onClose()
    }
  }
  function onRoleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setRoleValue(e.target.value as Roles)
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
        label="Email"
        type="email"
        fullWidth
        error={!!errors?.email}
        helperText={errors?.email?.message}
        margin="normal"
        {...register('email')}
        required
      />
      <TextField
        label="Senha"
        type="password"
        fullWidth
        margin="normal"
        error={!!errors?.password}
        helperText={errors?.password?.message}
        {...register('password')}
        required
      />
      <TextField
        select
        fullWidth
        label="Permissão"
        value={roleValue}
        helperText={errors?.role?.message}
        error={!!errors?.role}
        slotProps={{
          input: {
            ...register('role'),
            onChange: onRoleChange,
          },
        }}
      >
        <MenuItem value="admin">Administrador</MenuItem>
        <MenuItem value="technical">Técnico</MenuItem>
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
