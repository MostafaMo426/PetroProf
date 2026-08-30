/**
 * middleware.ts — PetroProf RBAC Edge Middleware
 *
 * Responsibilities:
 *  1. Refresh the Supabase auth session on every request
 *  2. Protect portal routes based on user role
 *  3. Redirect authenticated users away from auth pages
 *  4. Redirect unauthenticated users to /login
 */
import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import type { UserRole, Profile } from '@/types/database.types'

// ── Route configuration ──────────────────────────────────────────────────────

/** Routes that require authentication + specific role */
const PROTECTED_ROUTES: Record<string, UserRole[]> = {
  '/admin':       ['admin', 'super_admin'],
  '/client':      ['client'],
  '/technician':  ['technician'],
}

/** Routes that should redirect authenticated users to their portal */
const AUTH_ROUTES = ['/login', '/signup', '/verify-email']

// ── Helper: get the portal path for a given role ─────────────────────────────
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

// ── Helper: check if pathname starts with a given prefix ─────────────────────
function matchesRoute(pathname: string, route: string): boolean {
  return pathname === route || pathname.startsWith(`${route}/`)
}

// ── Middleware function ───────────────────────────────────────────────────────
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Refresh session & get current user
  const { supabaseResponse, user, supabase } = await updateSession(request)

  // ── Case 1: User is NOT authenticated ───────────────────────────────────────
  if (!user) {
    // Allow access to auth routes
    if (AUTH_ROUTES.some((r) => matchesRoute(pathname, r))) {
      return supabaseResponse
    }
    // Block access to all portal routes → redirect to login
    if (Object.keys(PROTECTED_ROUTES).some((r) => matchesRoute(pathname, r))) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    // Root path → send to login
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return supabaseResponse
  }

  // ── Case 2: User IS authenticated ───────────────────────────────────────────

  // Fetch the user's role from the profiles table
  const { data: profileData } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const profile = profileData as Pick<Profile, 'role'> | null
  const userRole = profile?.role as UserRole | null

  // If authenticated and on an auth page, redirect to their portal
  if (AUTH_ROUTES.some((r) => matchesRoute(pathname, r))) {
    return NextResponse.redirect(new URL(getPortalPath(userRole), request.url))
  }

  // Root path → redirect to correct portal
  if (pathname === '/') {
    return NextResponse.redirect(new URL(getPortalPath(userRole), request.url))
  }

  // Check portal route access
  for (const [route, allowedRoles] of Object.entries(PROTECTED_ROUTES)) {
    if (matchesRoute(pathname, route)) {
      if (!userRole || !allowedRoles.includes(userRole)) {
        // Wrong role → redirect to their correct portal with error param
        const portalUrl = new URL(getPortalPath(userRole), request.url)
        portalUrl.searchParams.set('error', 'unauthorized')
        return NextResponse.redirect(portalUrl)
      }
      break // Role matched — allow through
    }
  }

  return supabaseResponse
}

// ── Matcher config — run on all routes except static assets & Next internals ──
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
