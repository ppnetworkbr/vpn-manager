// components/layouts/protectedLayouts.tsx
'use client'
import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import DashboardLayout from './dashboardLayout'
type Props = {
  children: React.ReactElement
}

/*
  add the requireAuth property to the page component
  to protect the page from unauthenticated users
  e.g.:
  OrderDetail.requireAuth = true;
  export default OrderDetail;
 */

export const ProtectedLayout = ({ children }: Props): JSX.Element => {
  const router = useRouter()
  const { status: sessionStatus } = useSession()
  const authorized = sessionStatus === 'authenticated'
  const unAuthorized = sessionStatus === 'unauthenticated'
  const loading = sessionStatus === 'loading'
  const patchName = usePathname()
  useEffect(() => {
    // check if the session is loading or the router is not ready
    if (loading) return

    // if the user is not authorized, redirect to the login page
    // with a return url to the current page
    if (unAuthorized) {
      console.log('not authorized')
      console.log('router', router)
      console.log('usePathname', patchName)
      router.push('/login?returnUrl=' + patchName)
    }
  }, [loading, unAuthorized, sessionStatus, router, patchName])

  // if the user refreshed the page or somehow navigated to the protected page
  if (loading) {
    return <>Loading app...</>
  }

  // if the user is authorized, render the page
  // otherwise, render nothing while the router redirects him to the login page
  return authorized ? <DashboardLayout>{children}</DashboardLayout> : <></>
}
