/**
 * app/auth/callback/route.ts
 * Handles Supabase Auth PKCE code exchange.
 * After email confirmation or OAuth, Supabase redirects here.
 * We exchange the code for a session, read the user's role, and redirect.
 */
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { UserRole, Profile } from '@/types/database.types'

function getPortalPath(role: UserRole | null): string {
  switch (role) {
    case 'super_admin':
    case 'admin':
      return '/admin'
    case 'client':
      return '/client'
    case 'technician':
      return '/technician'
    default:
      return '/login'
  }
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code        = requestUrl.searchParams.get('code')
  const errorParam  = requestUrl.searchParams.get('error')
  const errorDesc   = requestUrl.searchParams.get('error_description')
  const origin      = requestUrl.origin
  const redirectTo  = requestUrl.searchParams.get('redirect') ?? '/'

  // Handle OAuth/PKCE errors
  if (errorParam) {
    console.error('[auth/callback] Error:', errorParam, errorDesc)
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(errorDesc ?? errorParam)}`
    )
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('[auth/callback] Code exchange error:', error.message)
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent(error.message)}`
      )
    }

    // Get the authenticated user and their role
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      const profile = profileData as Pick<Profile, 'role'> | null
      const role = profile?.role as UserRole | null

      // If a specific redirect was requested (e.g., from login with ?redirect=)
      // only honor it if it matches the user's allowed portal
      const portalPath = getPortalPath(role)
      const safeRedirect =
        redirectTo.startsWith(portalPath) ? redirectTo : portalPath

      return NextResponse.redirect(`${origin}${safeRedirect}`)
    }
  }

  // Fallback — shouldn't normally reach here
  return NextResponse.redirect(`${origin}/login`)
}
