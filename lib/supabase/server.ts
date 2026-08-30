/**
 * lib/supabase/server.ts
 * Server-side Supabase client — reads/writes cookies via Next.js headers().
 * Use this in Server Components, Route Handlers, and Server Actions.
 */
import { createServerClient, type CookieMethodsServer } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database.types'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll(): ReturnType<CookieMethodsServer['getAll']> {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: Parameters<NonNullable<CookieMethodsServer['setAll']>>[0]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll called from a Server Component — safe to ignore.
          }
        },
      } satisfies CookieMethodsServer,
    }
  )
}
