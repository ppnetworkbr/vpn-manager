import { Box } from '@mui/material'
import React, { ReactNode, useState } from 'react'
import AppBar from '../layouts/appBar'
import DrawerHeader from '../layouts/drawer/drawerHeader'
import Drawer from '../layouts/drawer/drawer'
import MainContent from './drawer/mainContent'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [open, setOpen] = useState(true)

  const handleDrawerOpen = () => {
    setOpen(!open)
  }

  return (
    <Box
      sx={{
        width: '100vw',
      }}
    >
      <AppBar open={open} handleDrawerOpen={handleDrawerOpen} />
      <Drawer open={open} />
      <MainContent
        open={open}
        sx={{
          display: 'flex',
          flexGrow: 1,
          height: 'auto',
          minWidth: 'calc(100vw - 240px)',
          width: {
            xs: open ? 'calc(100vw - 240px)' : '100vw',
            sm: open ? 'calc(100vw - 240px)' : '100vw',
          },
          mt: '4.125rem',
          textOverflow: 'ellipsis',
          overflow: 'auto',
          flexDirection: 'column',
          borderColor: 'red',
          border: 1,
        }}
      >
        <DrawerHeader />
        {children} {/* Renderiza os filhos passados */}
      </MainContent>
    </Box>
  )
}
