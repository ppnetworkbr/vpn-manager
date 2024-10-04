'use client'

import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, TextField, Alert, Box, Typography } from '@mui/material'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useServerAction } from 'zsa-react'
import { countUsersServerAction } from '@/app/actions/countUsers'

const loginSchema = z.object({
  email: z.string().min(1, 'Email é obrigatório'),
  password: z.string().min(1, 'Senha é obrigatório'),
})

type LoginSchema = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { execute } = useServerAction(countUsersServerAction, {})

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  })
  const router = useRouter()
  const [loginError, setLoginError] = useState<string | null>(null)
  const paramsRedirect = useSearchParams().get('returnUrl')
  async function onSubmit(data: LoginSchema) {
    setLoginError(null) // Reset login error
    const res = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (res?.error) {
      setLoginError('Login falhou! Verifique suas credenciais.')
    } else if (res?.ok) {
      router.push(paramsRedirect || '/')
    }
  }
  async function existUsers() {
    const [numberUsers] = await execute()
    if (numberUsers === 0) {
      router.push('/createFirstUser')
    }
  }
  useEffect(() => {
    existUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{
          maxWidth: 400,
          mx: 'auto',
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
        {loginError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {loginError}
          </Alert>
        )}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </Box>
    </Box>
  )
}
