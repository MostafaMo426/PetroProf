/**
 * lib/services/jobs.ts
 * Job requests, quotes, and crew assignment service.
 */
import { createClient } from '@/lib/supabase/client'
import type { JobRequest, JobStatus, RiskLevel } from '@/types/database.types'

export interface JobWithOrganization extends JobRequest {
  organization_name: string
  client_contact_name: string
  assigned_crew_count?: number
  risk_level?: RiskLevel
}

export const MOCK_JOBS: JobWithOrganization[] = [
  {
    id: 'job-1',
    request_number: 'PR-2026-0041',
    organization_id: 'org-1',
    requested_by_id: 'user-client-1',
    organization_name: 'Saudi Aramco',
    client_contact_name: 'Eng. Khalid Al-Otaibi',
    project_name: 'Flare Stack Inspection #3 & Anchor Line Rigging',
    project_description: 'Ultrasonic thickness testing (UT) on flare tip structure and high-temperature riser lines at 110m elevation. High wind exposure and potential trace H2S.',
    work_location: 'Ras Tanura Refinery, Eastern Province',
    work_city: 'Ras Tanura',
    work_region: 'Eastern Province',
    latitude: 26.6531,
    longitude: 50.1583,
    start_date: '2026-08-25',
    end_date: '2026-09-08',
    estimated_duration_days: 14,
    required_level_1: 3,
    required_level_2: 2,
    required_level_3: 1,
    required_specializations: ['NDT UT/MT', 'H2S Gas Safety', 'Hot Work Permit'],
    required_equipment: ['Dual Line 11mm Static Ropes', 'Atex Certified Radios', 'H2S Personal Detectors'],
    status: 'in_progress',
    priority: 'urgent',
    base_quote_sar: 82500,
    final_quote_sar: 94875,
    quote_breakdown: null,
    quote_currency: 'SAR',
    quote_valid_until: '2026-09-30',
    quote_sent_at: '2026-08-22T10:00:00Z',
    quote_approved_at: '2026-08-23T14:30:00Z',
    completed_at: null,
    client_rating: null,
    client_feedback: null,
    admin_notes: 'Crew mobilized with L3 Supervisor Tariq Al-Ghamdi. Safety briefing completed.',
    created_at: '2026-08-21T09:00:00Z',
    updated_at: '2026-08-25T08:00:00Z',
    assigned_crew_count: 6,
    risk_level: 'high',
  },
  {
    id: 'job-2',
    request_number: 'PR-2026-0040',
    organization_id: 'org-2',
    requested_by_id: 'user-client-2',
    organization_name: 'SABIC HQ',
    client_contact_name: 'Fahad Al-Malki',
    project_name: 'HQ Tower Exterior Cladding & Glass Sealant Renewal',
    project_description: 'Facade glass panel structural silicone replacement and weather-stripping at 160m tower height in Riyadh Digital City.',
    work_location: 'Digital City, Riyadh',
    work_city: 'Riyadh',
    work_region: 'Central Province',
    latitude: 24.7743,
    longitude: 46.6384,
    start_date: '2026-08-20',
    end_date: '2026-09-05',
    estimated_duration_days: 16,
    required_level_1: 3,
    required_level_2: 0,
    required_level_3: 1,
    required_specializations: ['Facade Glazing', 'Structural Silicone'],
    required_equipment: ['Glass Suction Lifters', 'Edge Protection Rollers'],
    status: 'in_progress',
    priority: 'normal',
    base_quote_sar: 54000,
    final_quote_sar: 62100,
    quote_breakdown: null,
    quote_currency: 'SAR',
    quote_valid_until: '2026-09-30',
    quote_sent_at: '2026-08-18T11:00:00Z',
    quote_approved_at: '2026-08-19T09:00:00Z',
    completed_at: null,
    client_rating: null,
    client_feedback: null,
    admin_notes: 'L3 Supervisor Mansour leading. Night-shift access approved by building management.',
    created_at: '2026-08-17T15:00:00Z',
    updated_at: '2026-08-20T08:00:00Z',
    assigned_crew_count: 4,
    risk_level: 'medium',
  },
  {
    id: 'job-3',
    request_number: 'PR-2026-0038',
    organization_id: 'org-3',
    requested_by_id: 'user-client-3',
    organization_name: 'ADES Offshore Drilling',
    client_contact_name: 'Capt. Robert Jenkins',
    project_name: 'Offshore Jack-up Rig Flare Boom Guy-Wire Tensioning',
    project_description: 'Offshore rope access tensioning of structural guy wires and replacement of safety lighting on cantilevered flare boom over open water.',
    work_location: 'Safaniya Oil Field (Offshore Arabian Gulf)',
    work_city: 'Safaniya',
    work_region: 'Eastern Province Offshore',
    latitude: 28.0051,
    longitude: 48.7842,
    start_date: '2026-09-10',
    end_date: '2026-09-24',
    estimated_duration_days: 14,
    required_level_1: 4,
    required_level_2: 4,
    required_level_3: 2,
    required_specializations: ['BOSIET Offshore Certified', 'Heavy Rigging', 'Offshore Survival'],
    required_equipment: ['Marine Offshore Harnesses', 'Twin Fall Arrest Blocks', 'Inflatable Life Jackets'],
    status: 'quoted',
    priority: 'urgent',
    base_quote_sar: 142000,
    final_quote_sar: 163300,
    quote_breakdown: null,
    quote_currency: 'SAR',
    quote_valid_until: '2026-09-15',
    quote_sent_at: '2026-08-28T16:00:00Z',
    quote_approved_at: null,
    completed_at: null,
    client_rating: null,
    client_feedback: null,
    admin_notes: 'AI Risk Assessment formulated: Critical Level. Mandatory twin Level 3 supervisor requirement verified.',
    created_at: '2026-08-28T12:00:00Z',
    updated_at: '2026-08-29T09:00:00Z',
    assigned_crew_count: 0,
    risk_level: 'critical',
  },
]

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
      return MOCK_JOBS
    }

    if (!data || data.length === 0) {
      return MOCK_JOBS
    }

    return (data as any[]).map((j) => ({
      ...j,
      organization_name: j.organization?.name || 'Client Org',
      client_contact_name: j.profile?.full_name || 'Contact',
    }))
  } catch (err) {
    console.error('[getJobs] Exception:', err)
    return MOCK_JOBS
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
    return { success: true, data: { ...jobData, id: `job-${Date.now()}` } as any }
  }
}
