/**
 * app/page.tsx
 * Root page — middleware handles redirects, this is a fallback.
 */
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { UserRole, Profile } from '@/types/database.types'

export default async function RootPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profileData } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const profile = profileData as Pick<Profile, 'role'> | null
  const role = profile?.role as UserRole | null

  switch (role) {
    case 'super_admin':
    case 'admin':
      redirect('/admin')
    case 'client':
      redirect('/client')
    case 'technician':
      redirect('/technician')
    default:
      redirect('/login')
  }
}
