'use client'
import * as React from 'react'
import Drawer from '@mui/material/Drawer'
import DrawerHeader from '../drawer/drawerHeader'
import { useTheme } from '@mui/material/styles'
import { useMediaQuery } from '@mui/material'
import {
  PersonAdd,
  Group,
  Lan,
  VpnKey,
  ManageAccounts,
  Home,
} from '@mui/icons-material'
import DrawerItem, { DrawerItemProps } from './drawerItem'

const menuitens: DrawerItemProps[] = [
  {
    Icon: Home,
    title: 'Home',
    url: '/',
  },
  {
    Icon: Group,
    title: 'Clientes',
    itens: [
     
      {
        Icon: PersonAdd,
        title: 'Geren. Clientes',
        url: '/clients',
      },
      {
        title: 'Redes',
        Icon: Lan,
        url: '/clients/networks',
      },
    ],
  },
  {
    Icon: VpnKey,
    title: 'Core VPN',
    url: '/core-vpn',
  },
  {
    Icon: ManageAccounts,
    title: 'Usuários',
    url: '/users',
  },
]
export default function DrawerComponent({ open }: { open: boolean }) {
  const theme = useTheme()
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'))

  return (
    <Drawer
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
        },
      }}
      variant={isSmUp ? 'persistent' : 'temporary'}
      anchor="left"
      open={open}
    >
      <DrawerHeader />
      {menuitens.map((item) => (
        <DrawerItem key={item.title} {...item} />
      ))}
    </Drawer>
  )
}
