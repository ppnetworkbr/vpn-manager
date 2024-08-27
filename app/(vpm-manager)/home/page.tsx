import { ProtectedLayout } from '@/app/components/layouts/protected'

export default function Home() {
  return (
    <ProtectedLayout>
      <h1>home</h1>
    </ProtectedLayout>
  )
}
