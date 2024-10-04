'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Typography, TextField, Alert, Button } from '@mui/material'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { createUserAction } from '@/app/actions/createUser'
import { useServerAction } from 'zsa-react'

const loginSchema = z
  .object({
    name: z.string().min(1, 'Nome é obrigatório'),
    email: z.string().min(1, 'Email é obrigatório'),
    password: z.string().min(1, 'Senha é obrigatório'),
    passwordConfirm: z.string().min(1, 'Confirmar senha é obrigatório'),
  })
  .superRefine(({ password, passwordConfirm }, ctx) => {
    if (password !== passwordConfirm) {
      ctx.addIssue({
        message: 'Senhas não conferem',
        code: 'custom',
        path: ['passwordConfirm'],
      })
    }
  })

type LoginSchema = z.infer<typeof loginSchema>
export default function FormCreateFirstUserAdmin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  })
  const { execute, isPending } = useServerAction(createUserAction, {})
  const router = useRouter()
  const [loginError, setLoginError] = useState<string | null>(null)
  const paramsRedirect = useSearchParams().get('returnUrl')
  const onSubmit = async (data: LoginSchema) => {
    setLoginError(null) // Reset login error
    const [, err] = await execute({
      email: data.email,
      name: data.name,
      password: data.password,
      role: 'admin',
    })
    if (err) {
      setLoginError('Login falhou! Verifique suas credenciais.')
    } else {
      router.push(paramsRedirect || '/login')
    }
  }
  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{
        maxWidth: 400,
        mx: 'auto',
        mt: 8,
        borderColor: 'primary.main',
        borderWidth: 1,

        boxShadow: 4,
        borderRadius: 1,
        p: 2,
      }}
    >
      <Typography variant="subtitle2" align="center" gutterBottom>
        Criei o primeiro usuário administrador
      </Typography>
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
        {...register('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        label="Senha"
        required
        type="password"
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Confirmar senha"
        required
        type="password"
        {...register('passwordConfirm')}
        error={!!errors.passwordConfirm}
        helperText={errors.passwordConfirm?.message}
        fullWidth
        margin="normal"
      />
      {loginError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {loginError}
        </Alert>
      )}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={isPending}
      >
        {isPending ? 'Criando...' : 'Criar Usuário'}
      </Button>
    </Box>
  )
}
