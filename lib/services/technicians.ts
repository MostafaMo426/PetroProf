/**
 * lib/services/technicians.ts
 * Data access layer for rope access technicians, certification tracking, and roster management.
 * All data is sourced exclusively from Supabase — no mock fallbacks.
 */
import { createClient } from '@/lib/supabase/client'
import type { Technician, Profile } from '@/types/database.types'

export interface TechnicianWithProfile extends Technician {
  profile: Profile
  irata_cert_expiry?: string | null
  medical_cert_expiry?: string | null
}

export async function getTechnicians(): Promise<TechnicianWithProfile[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('technicians')
      .select(`
        *,
        profile:profiles!profile_id(*)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[getTechnicians] Supabase error:', error)
      return []
    }

    return (data || []) as unknown as TechnicianWithProfile[]
  } catch (err) {
    console.error('[getTechnicians] Exception:', err)
    return []
  }
}

export async function getTechnicianById(id: string): Promise<TechnicianWithProfile | null> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('technicians')
      .select(`
        *,
        profile:profiles!profile_id(*)
      `)
      .eq('id', id)
      .single()

    if (error || !data) {
      console.error('[getTechnicianById] Not found or error:', error)
      return null
    }

    return data as unknown as TechnicianWithProfile
  } catch (err) {
    console.error('[getTechnicianById] Exception:', err)
    return null
  }
}
