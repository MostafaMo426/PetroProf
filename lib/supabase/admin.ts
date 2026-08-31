/**
 * lib/supabase/admin.ts
 * Robust server-side Supabase client using SUPABASE_SERVICE_ROLE_KEY.
 * Handles admin user creation, auto-recovery of existing auth records, and cascading deletions.
 */
import { createClient } from '@supabase/supabase-js'

export function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in environment variables')
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

/**
 * Creates user in Supabase Auth via Admin SDK.
 * If the user already exists in auth.users, it automatically finds their UUID,
 * updates their password & metadata, and returns the user cleanly.
 */
export async function createAuthUser(userData: {
  email: string
  password: string
  user_metadata: Record<string, any>
}): Promise<{ user?: any; error?: string }> {
  try {
    const supabase = getAdminClient()

    // 1. Try initial creation
    const { data, error } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true,
      user_metadata: userData.user_metadata,
    })

    if (!error && data?.user?.id) {
      return { user: data.user }
    }

    const errMsg = error?.message || ''

    // 2. Self-healing: If user already exists in auth.users, find their UUID and update them
    if (
      errMsg.toLowerCase().includes('already') ||
      errMsg.toLowerCase().includes('registered') ||
      errMsg.toLowerCase().includes('exists') ||
      (error as any)?.status === 422
    ) {
      // Find the user by listing users (pagination default 50 per page)
      let page = 1
      let foundUser: any = null

      while (page <= 5) {
        const { data: listData, error: listError } = await supabase.auth.admin.listUsers({
          page,
          perPage: 50,
        })

        if (listError || !listData?.users || listData.users.length === 0) {
          break
        }

        const match = listData.users.find(
          (u) => u.email?.toLowerCase() === userData.email.toLowerCase()
        )

        if (match) {
          foundUser = match
          break
        }

        page++
      }

      if (foundUser?.id) {
        // Update user's password and metadata to ensure active state
        const { data: updatedData, error: updateError } = await supabase.auth.admin.updateUserById(
          foundUser.id,
          {
            password: userData.password,
            email_confirm: true,
            user_metadata: userData.user_metadata,
          }
        )

        if (!updateError && updatedData?.user) {
          return { user: updatedData.user }
        }

        return { user: foundUser }
      }
    }

    return { error: errMsg || 'Failed to create user in Auth system' }
  } catch (err: any) {
    console.error('[createAuthUser Exception]', err)
    return { error: err.message || 'Unknown exception during auth user creation' }
  }
}

/**
 * Deletes user from Supabase Auth via Admin SDK.
 */
export async function deleteAuthUser(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getAdminClient()
    const { error } = await supabase.auth.admin.deleteUser(userId)

    if (error && !error.message?.includes('not found') && (error as any)?.status !== 404) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

/**
 * Inserts or updates Profile using Service Role (Bypasses RLS).
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
  const supabase = getAdminClient()
  const { error } = await supabase
    .from('profiles')
    .upsert(profile, { onConflict: 'id' })

  if (error) {
    throw new Error(`Profile upsert error: ${error.message}`)
  }

  return true
}

/**
 * Inserts Technician record using Service Role (Bypasses RLS).
 */
export async function adminInsertTechnician(tech: Record<string, any>) {
  const supabase = getAdminClient()
  const { error } = await supabase
    .from('technicians')
    .upsert(tech, { onConflict: 'profile_id' })

  if (error) {
    throw new Error(`Technician upsert error: ${error.message}`)
  }

  return true
}

/**
 * Inserts Organization record for client accounts using Service Role.
 */
export async function adminInsertOrganization(org: {
  name: string
  industry_sector?: string
  city?: string
  primary_contact_id: string
  is_active?: boolean
}) {
  const supabase = getAdminClient()
  const { error } = await supabase
    .from('organizations')
    .insert(org)

  if (error) {
    console.warn(`Organization insert warning: ${error.message}`)
  }

  return true
}

/**
 * Deletes all data for a user using Service Role.
 * Order matters: delete dependent records before the profile, profile before auth.
 * Supports passing either a profile UUID or a technician UUID.
 */
export async function adminDeleteUserData(idOrProfileId: string) {
  const supabase = getAdminClient()

  let profileId: string = idOrProfileId
  let technicianId: string | null = null

  // 1. Resolve technicianId and profileId bidirectionally
  try {
    const { data: techByProfile } = await supabase
      .from('technicians')
      .select('id')
      .eq('profile_id', idOrProfileId)
      .maybeSingle()

    if (techByProfile?.id) {
      technicianId = techByProfile.id
    }
  } catch {}

  if (!technicianId) {
    try {
      const { data: techById } = await supabase
        .from('technicians')
        .select('id, profile_id')
        .eq('id', idOrProfileId)
        .maybeSingle()

      if (techById?.id) {
        technicianId = techById.id
        if (techById.profile_id) {
          profileId = techById.profile_id
        }
      }
    } catch {}
  }

  // 2. Delete certifications, logbook entries, and crew assignments referencing technician
  if (technicianId) {
    await supabase.from('certifications').delete().eq('technician_id', technicianId)
    await supabase.from('logbook_entries').delete().eq('technician_id', technicianId)
    await supabase.from('crew_assignments').delete().eq('technician_id', technicianId)
  }

  // 3. Delete job requests submitted by this user
  await supabase.from('job_requests').delete().eq('requested_by_id', profileId)

  // 4. Delete technician record
  if (technicianId) {
    await supabase.from('technicians').delete().eq('id', technicianId)
  }
  await supabase.from('technicians').delete().eq('profile_id', profileId)

  // 5. Delete organizations where this user is primary contact
  await supabase.from('organizations').delete().eq('primary_contact_id', profileId)

  // 6. Delete profile
  await supabase.from('profiles').delete().eq('id', profileId)

  // 7. Delete from Supabase Auth
  await deleteAuthUser(profileId)

  return true
}
