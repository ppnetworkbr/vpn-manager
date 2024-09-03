import MenuIcon from '@mui/icons-material/Menu'
import {
  IconButton,
  Box,
  useMediaQuery,
  Theme,
  Typography,
} from '@mui/material'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import { styled } from '@mui/material/styles'
import logoImage from '@/app/assets/logo.svg'
import Image from 'next/image'
import MenuProfile from './appBar/menuProfile'
import { findManyClients } from '@/lib/actions/client.db.action'
import { GetServerSideProps } from 'next'

export default function AppBar({
  open,
  handleDrawerOpen,
}: {
  open: boolean
  handleDrawerOpen: () => void
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
    // variants: [
    //   {
    //     props: ({ open }) => open,
    //     style: {
    //       transition: theme.transitions.create(['margin', 'width'], {
    //         easing: theme.transitions.easing.easeOut,
    //         duration: theme.transitions.duration.enteringScreen,
    //       }),
    //     },
    //   },
    // ],
  }))

  const isSmallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm'),
  )

  return (
    <AppBar
      position="fixed"
      open={open}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        width: '100%',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            width: 'auto',
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

          {!isSmallScreen && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Image src={logoImage} quality={100} alt="" />
              <Typography variant="h6" noWrap>
                PP VPN Mananger
              </Typography>
            </Box>
          )}
        </Box>
        {isSmallScreen && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              mt: 1,
            }}
          >
            <Image src={logoImage} sizes="1" quality={100} alt="" />
          </Box>
        )}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}
        >
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
