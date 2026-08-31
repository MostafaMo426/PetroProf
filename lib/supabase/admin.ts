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
 * Searches for an existing auth user by email via Admin API.
 */
export async function getAuthUserByEmail(email: string): Promise<{ user?: any; error?: string }> {
  try {
    const { url, headers } = getServiceCredentials()
    const res = await fetch(`${url}/auth/v1/admin/users?per_page=1000`, {
      method: 'GET',
      headers,
    })

    if (!res.ok) {
      return { error: 'Could not query auth users list' }
    }

    const data = await res.json()
    const users: any[] = data.users || data || []
    const match = users.find((u) => u.email?.toLowerCase() === email.toLowerCase())

    if (match?.id) {
      return { user: match }
    }

    return { error: 'User not found in Auth system' }
  } catch (err: any) {
    return { error: err.message }
  }
}

/**
 * Creates user in Supabase Auth via Admin REST API.
 * If user already exists (e.g. from a prior incomplete attempt),
 * automatically recovers their ID and updates password & metadata.
 */
export async function createAuthUser(userData: {
  email: string
  password: string
  user_metadata: Record<string, any>
}): Promise<{ user?: any; error?: string }> {
  try {
    const { url, headers } = getServiceCredentials()

    // 1. Try initial creation
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

    // 2. If successfully created
    if (res.ok && data?.id && typeof data.id === 'string') {
      return { user: data }
    }

    const errMsg: string = data.msg || data.message || data.error_description || ''

    // 3. Self-healing: If user already exists in auth.users, find their UUID and update them
    if (
      res.status === 422 ||
      errMsg.toLowerCase().includes('already') ||
      errMsg.toLowerCase().includes('registered') ||
      errMsg.toLowerCase().includes('exists')
    ) {
      const existing = await getAuthUserByEmail(userData.email)
      if (existing.user?.id) {
        // Update user credentials & metadata to match the new request
        const updateRes = await fetch(`${url}/auth/v1/admin/users/${existing.user.id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            password: userData.password,
            email_confirm: true,
            user_metadata: userData.user_metadata,
          }),
        })

        if (updateRes.ok) {
          const updatedUser = await updateRes.json()
          return { user: updatedUser }
        }

        return { user: existing.user }
      }
    }

    return { error: errMsg || 'Failed to create auth user' }
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

    if (res.status === 404) {
      // User already gone — treat as success
      return { success: true }
    }

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

  const res = await fetch(`${url}/rest/v1/profiles?on_conflict=id`, {
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

  const res = await fetch(`${url}/rest/v1/technicians?on_conflict=profile_id`, {
    method: 'POST',
    headers: {
      ...headers,
      Prefer: 'resolution=merge-duplicates',
    },
    body: JSON.stringify(tech),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Technician insert error: ${errText}`)
  }

  return true
}

/**
 * Inserts Organization record for client accounts using Service Role key.
 */
export async function adminInsertOrganization(org: {
  name: string
  industry_sector?: string
  city?: string
  primary_contact_id: string
  is_active?: boolean
}) {
  const { url, headers } = getServiceCredentials()

  const res = await fetch(`${url}/rest/v1/organizations`, {
    method: 'POST',
    headers,
    body: JSON.stringify(org),
  })

  if (!res.ok) {
    const errText = await res.text()
    // Non-fatal: log but don't throw
    console.warn(`Organization insert warning: ${errText}`)
  }

  return true
}

/**
 * Deletes all data for a user using Service Role key.
 * Order matters: delete dependent records before the profile, profile before auth.
 * Supports passing either a profile UUID or a technician UUID.
 */
export async function adminDeleteUserData(idOrProfileId: string) {
  const { url, headers } = getServiceCredentials()

  let profileId: string = idOrProfileId
  let technicianId: string | null = null

  // 1. Resolve technicianId and profileId bidirectionally
  try {
    const res = await fetch(`${url}/rest/v1/technicians?profile_id=eq.${idOrProfileId}&select=id`, { headers })
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        technicianId = data[0].id
      }
    }
  } catch {}

  if (!technicianId) {
    try {
      const res = await fetch(`${url}/rest/v1/technicians?id=eq.${idOrProfileId}&select=id,profile_id`, { headers })
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          technicianId = data[0].id
          if (data[0].profile_id) {
            profileId = data[0].profile_id
          }
        }
      }
    } catch {}
  }

  // 2. Delete certifications, logbook entries, and crew assignments referencing technician
  if (technicianId) {
    await fetch(`${url}/rest/v1/certifications?technician_id=eq.${technicianId}`, { method: 'DELETE', headers })
    await fetch(`${url}/rest/v1/logbook_entries?technician_id=eq.${technicianId}`, { method: 'DELETE', headers })
    await fetch(`${url}/rest/v1/crew_assignments?technician_id=eq.${technicianId}`, { method: 'DELETE', headers })
  }

  // 3. Delete job requests submitted by this user
  await fetch(`${url}/rest/v1/job_requests?requested_by_id=eq.${profileId}`, { method: 'DELETE', headers })

  // 4. Delete technician record
  if (technicianId) {
    await fetch(`${url}/rest/v1/technicians?id=eq.${technicianId}`, { method: 'DELETE', headers })
  }
  await fetch(`${url}/rest/v1/technicians?profile_id=eq.${profileId}`, { method: 'DELETE', headers })

  // 5. Delete organizations where this user is primary contact
  await fetch(`${url}/rest/v1/organizations?primary_contact_id=eq.${profileId}`, { method: 'DELETE', headers })

  // 6. Delete profile
  await fetch(`${url}/rest/v1/profiles?id=eq.${profileId}`, { method: 'DELETE', headers })

  // 7. Delete from Supabase Auth
  const authResult = await deleteAuthUser(profileId)
  if (!authResult.success) {
    console.warn('[adminDeleteUserData] Auth delete note:', authResult.error)
  }

  return true
}
