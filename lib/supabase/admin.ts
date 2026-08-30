/**
 * lib/supabase/admin.ts
 * High-reliability REST API helpers using SUPABASE_SERVICE_ROLE_KEY.
 * Bypasses RLS on administrative actions and eliminates Webpack bundling chunk issues.
 */

const getServiceCredentials = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('Supabase URL or Service Role Key missing in .env.local')
  }

  return {
    url,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
  }
}

/**
 * Creates user in Supabase Auth via Admin REST API.
 */
export async function createAuthUser(userData: {
  email: string
  password: string
  user_metadata: Record<string, any>
}): Promise<{ user?: any; error?: string }> {
  try {
    const { url, headers } = getServiceCredentials()

    const res = await fetch(`${url}/auth/v1/admin/users`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: userData.user_metadata,
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      return { error: data.msg || data.message || 'Failed to create user in Auth system' }
    }

    return { user: data }
  } catch (err: any) {
    return { error: err.message }
  }
}

/**
 * Deletes user from Supabase Auth via Admin REST API.
 */
export async function deleteAuthUser(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { url, headers } = getServiceCredentials()

    const res = await fetch(`${url}/auth/v1/admin/users/${userId}`, {
      method: 'DELETE',
      headers,
    })

    if (!res.ok) {
      const errText = await res.text()
      return { success: false, error: errText }
    }

    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

/**
 * Inserts or updates Profile using Service Role key (Bypasses RLS).
 */
export async function adminUpsertProfile(profile: {
  id: string
  role: string
  full_name: string
  email: string
  phone?: string | null
  is_active?: boolean
  onboarding_complete?: boolean
}) {
  const { url, headers } = getServiceCredentials()

  const res = await fetch(`${url}/rest/v1/profiles`, {
    method: 'POST',
    headers: {
      ...headers,
      Prefer: 'resolution=merge-duplicates',
    },
    body: JSON.stringify(profile),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Profile insert error: ${errText}`)
  }

  return true
}

/**
 * Inserts Technician record using Service Role key (Bypasses RLS).
 */
export async function adminInsertTechnician(tech: Record<string, any>) {
  const { url, headers } = getServiceCredentials()

  const res = await fetch(`${url}/rest/v1/technicians`, {
    method: 'POST',
    headers,
    body: JSON.stringify(tech),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Technician insert error: ${errText}`)
  }

  return true
}

/**
 * Deletes all related records for a user using Service Role key (Bypasses RLS).
 */
export async function adminDeleteUserData(userId: string) {
  const { url, headers } = getServiceCredentials()

  // 1. Delete certifications
  await fetch(`${url}/rest/v1/certifications?technician_id=eq.${userId}`, {
    method: 'DELETE',
    headers,
  })

  // 2. Delete job_requests requested by user
  await fetch(`${url}/rest/v1/job_requests?requested_by_id=eq.${userId}`, {
    method: 'DELETE',
    headers,
  })

  // 3. Delete technicians
  await fetch(`${url}/rest/v1/technicians?profile_id=eq.${userId}`, {
    method: 'DELETE',
    headers,
  })
  await fetch(`${url}/rest/v1/technicians?id=eq.${userId}`, {
    method: 'DELETE',
    headers,
  })

  // 4. Delete profile
  const profileRes = await fetch(`${url}/rest/v1/profiles?id=eq.${userId}`, {
    method: 'DELETE',
    headers,
  })

  // 5. Delete auth user
  await deleteAuthUser(userId)

  return true
}
