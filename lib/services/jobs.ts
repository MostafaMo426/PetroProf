/**
 * lib/services/jobs.ts
 * Job requests, quotes, and crew assignment service.
 * All data is sourced exclusively from Supabase — no mock fallbacks.
 */
import { createClient } from '@/lib/supabase/client'
import type { JobRequest, RiskLevel } from '@/types/database.types'

export interface JobWithOrganization extends JobRequest {
  organization_name: string
  client_contact_name: string
  assigned_crew_count?: number
  risk_level?: RiskLevel
}

export async function getJobs(): Promise<JobWithOrganization[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('job_requests')
      .select(`
        *,
        organization:organizations!organization_id(name),
        profile:profiles!requested_by_id(full_name)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[getJobs] Supabase error:', error)
      return []
    }

    return (data || []).map((j: any) => ({
      ...j,
      organization_name: j.organization?.name || '',
      client_contact_name: j.profile?.full_name || '',
    }))
  } catch (err) {
    console.error('[getJobs] Exception:', err)
    return []
  }
}

export async function createJobRequest(
  jobData: Partial<JobRequest>
): Promise<{ success: boolean; data?: JobRequest; error?: string }> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('job_requests')
      .insert(jobData as any)
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (err: any) {
    console.error('[createJobRequest] Exception:', err)
    return { success: false, error: err?.message || 'Failed to create job request.' }
  }
}
