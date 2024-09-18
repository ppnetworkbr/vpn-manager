import { Box, Typography } from '@mui/material'
import { auth } from '@/auth'

interface UserDataProps {
  coreVpns: {
    ip: string
  }[]
}
export default async function UserData({ coreVpns }: UserDataProps) {
  const session = await auth()
  return (
    <Box
      sx={{
        backgroundColor: 'rgba(110, 112, 110, 0.119)',
        borderRadius: 4,
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <Typography variant="h6">Dados de conexão</Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: 1,
          mt: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Typography variant="body2" fontWeight="bold">
            IP VPN:&nbsp;
          </Typography>
          <Typography variant="body2">
            {coreVpns.map((coreVpn) => (
              <span key={coreVpn.ip}>{coreVpn.ip}</span>
            ))}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Typography variant="body2" fontWeight="bold">
            Usuário:&nbsp;
          </Typography>
          <Typography variant="body2">{session?.user?.email}</Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Typography variant="body2" fontWeight="bold">
            Senha:&nbsp;
          </Typography>
          <Typography variant="body2">{session?.user?.l2tpPassword}</Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Typography variant="body2" fontWeight="bold">
            Chave Pré-compartilhada:&nbsp;
          </Typography>
          <Typography variant="body2">
            {process.env['L2TP-PRESHARED-KEY'] || 'N/A'}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
