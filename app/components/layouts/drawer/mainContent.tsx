import { styled } from '@mui/material/styles'

const drawerWidth = 240 // Largura do Drawer
const MainContent = styled('main', {
  shouldForwardProp: (prop) => prop !== 'open',
})<{
  open?: boolean
}>(({ theme, open }) => ({
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: '0.3s',
  }),
  marginLeft: open ? `${drawerWidth}px` : `0px`, // Ajuste da margem à esquerda
  width: `calc(100vw - ${open ? drawerWidth : 0}px)`, // Cálculo da largura baseado no estado do Drawer
}))
export default MainContent
