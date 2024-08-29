import { CssBaseline } from '@mui/material'
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
    <>
      <CssBaseline />
      <AppBar open={open} handleDrawerOpen={handleDrawerOpen} />
      <Drawer open={open} />
      <MainContent open={open}>
        <DrawerHeader />
        {children} {/* Renderiza os filhos passados */}
      </MainContent>
    </>
  )
}
