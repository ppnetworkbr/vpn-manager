import { styled } from '@mui/material/styles'

const drawerWidth = 240 // Largura do Drawer
const MainContent = styled('main', {
  shouldForwardProp: (prop) => prop !== 'open',
})<{
  open?: boolean
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: open ? `${drawerWidth}px` : `0px`, // Ajuste da margem à esquerda
  width: `calc(100% - ${open ? drawerWidth : 0}px)`, // Cálculo da largura baseado no estado do Drawer
}))
export default MainContent
