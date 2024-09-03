'use client'

import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, TextField, Alert, Box } from '@mui/material'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

const loginSchema = z.object({
  email: z.string().min(1, 'email é obrigatório'),
  password: z.string().min(1, 'Password é obrigatório'),
})

type LoginSchema = z.infer<typeof loginSchema>

export default function LoginPage() {
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
  const onSubmit = async (data: LoginSchema) => {
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

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}
    >
      <TextField
        label="Username"
        {...register('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Password"
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
  )
}
