import MenuIcon from '@mui/icons-material/Menu'
import { IconButton, Box } from '@mui/material'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import { styled } from '@mui/material/styles'
import logoImage from '@/app/assets/logo.svg'
import Image from 'next/image'
import MenuProfile from './appBar/menuProfile'
import AutoComplete from './appBar/autoComplete'
import { findManyClients } from '@/lib/actions/client.db.action'
import { GetServerSideProps } from 'next'

export default function AppBar({
  open,
  handleDrawerOpen,
  clients,
}: {
  open: boolean
  handleDrawerOpen: () => void
  clients: any[]
}) {
  interface AppBarProps extends MuiAppBarProps {
    open?: boolean
  }
  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
  })<AppBarProps>(({ theme }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
      {
        props: ({ open }) => open,
        style: {
          zIndex: theme.zIndex.drawer + 1100,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      },
    ],
  }))

  return (
    <AppBar
      position="fixed"
      open={open}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                mr: 2,
              },
            ]}
          >
            <MenuIcon />
          </IconButton>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}
        >
          <Image src={logoImage} alt="" />
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}
        >
          <AutoComplete
            optionSelect={clients}
            error={undefined}
            label="Clientes"
            noOptionText="Nenhum cliente encontrado"
            onChange={(e) => console.log('e', e)}
            value={null}
            placeholder="Buscar cliente"
          />
          <MenuProfile />
        </Box>
      </Toolbar>
    </AppBar>
  )
}
export const getServerSideProps: GetServerSideProps = async () => {
  const clients = await findManyClients({})
  console.log('clients', clients)
  return {
    props: {
      clients,
    },
  }
}
