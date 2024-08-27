'use client';
import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  defaultColorScheme: 'light',
  palette: {
    mode: 'light',
    primary: {
      main: '#fe8a04',
      contrastText: 'rgba(255,255,255,0.87)',
    },
    secondary: {
      main: '#faf9fb',
    },
    warning: {
      main: '#ffea00',
      contrastText: 'rgba(26,26,26,0.87)',
    },
    info: {
      main: '#ffe082',
      contrastText: 'rgba(232,232,232,0.87)',
    },
    //divider: 'rgba(255,255,255,0.12)',

  },


  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  
});

export default theme;