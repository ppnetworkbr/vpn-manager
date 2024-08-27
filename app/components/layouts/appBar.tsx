import MenuIcon from '@mui/icons-material/Menu';
import { IconButton, Typography } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { styled, useTheme } from '@mui/material/styles';



export default function AppBar({open, handleDrawerOpen}: {open: boolean, handleDrawerOpen: ()=>void}) {
  interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
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
  }));
  return(
    <AppBar position="fixed" open={open} sx={{
      zIndex: (theme) => theme.zIndex.drawer + 1,
    }}>
    <Toolbar>
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
      <Typography variant="h6" noWrap component="div">
        Persistent drawer
      </Typography>
    </Toolbar>
  </AppBar>
  )
}