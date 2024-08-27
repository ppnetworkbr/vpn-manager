'use client'
import { ProtectedLayout } from '@/app/components/layouts/protected'
import * as React from 'react'

export default function UsersPage() {
  return (
    <ProtectedLayout>
      <h1>Users</h1>
    </ProtectedLayout>
  )
}
