import * as React from 'react'

import {
  IconButton,
  Typography,
  Menu,
  Avatar,
  Box,
  Stack,
  Button,
  Chip,
} from '@mui/material'

import Tooltip from '@mui/material/Tooltip'
import { Logout as LogoutIcon, Person, Shield } from '@mui/icons-material'
import { useSession, signOut } from 'next-auth/react'
export default function MenuProfile() {
  const session = useSession()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="Perfil">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              {session.data?.user?.name?.[0]?.toLocaleUpperCase() ?? 'U'}
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Stack sx={{ width: 290 }}>
          <Stack
            direction="row"
            sx={{
              px: 3,
              py: 2,
              borderBottom: 1,
              borderColor: 'divider',
              ':hover': { cursor: 'pointer' },
            }}
            spacing={2}
          >
            <Avatar sx={{ width: 48, height: 48 }} />
            <Stack>
              <Typography fontWeight="bolder">
                {session.data?.user?.name}
              </Typography>
              <Typography variant="caption">
                {session.data?.user?.email}
              </Typography>
              <Chip
                label={session.data?.user?.role}
                variant="outlined"
                color={
                  session.data?.user?.role === 'admin' ? 'primary' : 'info'
                }
                icon={
                  session.data?.user?.role === 'admin' ? <Shield /> : <Person />
                }
                size="small"
              />
            </Stack>
          </Stack>

          <Stack direction="row" sx={{ p: 1, justifyContent: 'right' }}>
            <Button
              disabled={false}
              variant="contained"
              size="small"
              disableElevation
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={() => signOut()}
              sx={{
                textTransform: 'capitalize',
                filter: 'opacity(0.9)',
                transition: 'filter 0.2s ease-in',
                '&:hover': {
                  filter: 'opacity(1)',
                },
              }}
            >
              {'Sair'}
            </Button>
          </Stack>
        </Stack>
      </Menu>
    </React.Fragment>
  )
}
