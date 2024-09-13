import type { Metadata } from 'next'
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'

import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'

import { SessionProvider } from 'next-auth/react'
import CssBaseline from '@mui/material/CssBaseline'

import { auth } from '@/auth'
import { ThemeProvider } from '@mui/material/styles'
import getTheme from '@/app/styles/theme'

export const metadata: Metadata = {
  title: 'VPN Manager',
  description: 'Gerecie suas ',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body>
        <SessionProvider session={session}>
          <AppRouterCacheProvider>
            <CssBaseline enableColorScheme />
            <ThemeProvider theme={getTheme}>
              <InitColorSchemeScript attribute="class" />
              {children}
            </ThemeProvider>
          </AppRouterCacheProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
