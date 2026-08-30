/**
 * lib/services/technicians.ts
 * Data access layer for rope access technicians, certification tracking, and roster management.
 */
import { createClient } from '@/lib/supabase/client'
import type { Technician, Profile, IrataLevel, TechnicianStatus } from '@/types/database.types'

export interface TechnicianWithProfile extends Technician {
  profile: Profile
  irata_cert_expiry?: string | null
  medical_cert_expiry?: string | null
}

export const MOCK_TECHNICIANS: TechnicianWithProfile[] = [
  {
    id: 'tech-1',
    profile_id: 'prof-1',
    employee_id: 'PP-T0142',
    irata_level: 'level_3',
    irata_membership_no: '3/89421',
    status: 'deployed',
    nationality: 'Saudi Arabia',
    iqama_no: '1084291842',
    iqama_expiry: '2027-04-15',
    passport_no: 'K894210',
    passport_expiry: '2028-11-20',
    date_of_birth: '1988-06-12',
    years_experience: 11,
    specializations: ['NDT UT/MT', 'Advanced Rigging', 'Rescue Supervisor', 'Offshore'],
    total_rope_hours: 4850,
    fatigue_score: 1.2,
    last_deployment_date: '2026-08-20',
    next_available_date: '2026-09-15',
    daily_rate_sar: 1850,
    emergency_contact_name: 'Saeed Al-Ghamdi',
    emergency_contact_phone: '+966 50 123 4567',
    blood_type: 'O+',
    medical_notes: 'Annual Offshore Fitness Certified (Aramco Approved)',
    performance_rating: 4.95,
    rating_count: 38,
    is_featured: true,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2026-08-25T00:00:00Z',
    irata_cert_expiry: '2026-09-28',
    medical_cert_expiry: '2027-03-10',
    profile: {
      id: 'prof-1',
      role: 'technician',
      full_name: 'Tariq Al-Ghamdi',
      email: 'tariq.ghamdi@petroprof.sa',
      phone: '+966 55 492 8192',
      avatar_url: null,
      preferred_language: 'en',
      timezone: 'Asia/Riyadh',
      is_active: true,
      onboarding_complete: true,
      last_seen_at: '2026-08-30T10:00:00Z',
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2026-08-25T00:00:00Z',
    },
  },
  {
    id: 'tech-2',
    profile_id: 'prof-2',
    employee_id: 'PP-T0189',
    irata_level: 'level_2',
    irata_membership_no: '2/104829',
    status: 'available',
    nationality: 'Saudi Arabia',
    iqama_no: '1092817462',
    iqama_expiry: '2027-08-10',
    passport_no: 'K912048',
    passport_expiry: '2029-01-05',
    date_of_birth: '1993-09-24',
    years_experience: 6,
    specializations: ['NDT Thickness Gauging', 'Heavy Rigging', 'Painting & Blasting'],
    total_rope_hours: 2180,
    fatigue_score: 0.4,
    last_deployment_date: '2026-08-10',
    next_available_date: '2026-09-01',
    daily_rate_sar: 1250,
    emergency_contact_name: 'Waleed Al-Zahrani',
    emergency_contact_phone: '+966 54 819 2831',
    blood_type: 'A+',
    medical_notes: 'Fit for Working at Heights & Confined Space',
    performance_rating: 4.88,
    rating_count: 24,
    is_featured: true,
    created_at: '2024-03-20T00:00:00Z',
    updated_at: '2026-08-20T00:00:00Z',
    irata_cert_expiry: '2027-05-14',
    medical_cert_expiry: '2026-09-18',
    profile: {
      id: 'prof-2',
      role: 'technician',
      full_name: 'Hassan Al-Zahrani',
      email: 'hassan.zahrani@petroprof.sa',
      phone: '+966 54 819 2831',
      avatar_url: null,
      preferred_language: 'en',
      timezone: 'Asia/Riyadh',
      is_active: true,
      onboarding_complete: true,
      last_seen_at: '2026-08-30T14:30:00Z',
      created_at: '2024-03-20T00:00:00Z',
      updated_at: '2026-08-20T00:00:00Z',
    },
  },
  {
    id: 'tech-3',
    profile_id: 'prof-3',
    employee_id: 'PP-T0204',
    irata_level: 'level_3',
    irata_membership_no: '3/76291',
    status: 'deployed',
    nationality: 'United Kingdom',
    iqama_no: '2491028491',
    iqama_expiry: '2027-02-28',
    passport_no: 'GB9821048',
    passport_expiry: '2030-05-12',
    date_of_birth: '1985-03-18',
    years_experience: 14,
    specializations: ['Offshore Flare Tips', 'Complex Tensioned Lines', 'Technical Rescue', 'Site Audit'],
    total_rope_hours: 6200,
    fatigue_score: 1.8,
    last_deployment_date: '2026-08-15',
    next_available_date: '2026-09-20',
    daily_rate_sar: 1950,
    emergency_contact_name: 'Sarah Mitchell',
    emergency_contact_phone: '+44 7700 900077',
    blood_type: 'B+',
    medical_notes: 'Fit for all industrial environments',
    performance_rating: 4.98,
    rating_count: 52,
    is_featured: true,
    created_at: '2023-11-01T00:00:00Z',
    updated_at: '2026-08-28T00:00:00Z',
    irata_cert_expiry: '2027-11-05',
    medical_cert_expiry: '2027-08-19',
    profile: {
      id: 'prof-3',
      role: 'technician',
      full_name: 'David Mitchell',
      email: 'david.mitchell@petroprof.sa',
      phone: '+966 56 102 9384',
      avatar_url: null,
      preferred_language: 'en',
      timezone: 'Asia/Riyadh',
      is_active: true,
      onboarding_complete: true,
      last_seen_at: '2026-08-30T09:15:00Z',
      created_at: '2023-11-01T00:00:00Z',
      updated_at: '2026-08-28T00:00:00Z',
    },
  },
  {
    id: 'tech-4',
    profile_id: 'prof-4',
    employee_id: 'PP-T0231',
    irata_level: 'level_1',
    irata_membership_no: '1/149204',
    status: 'available',
    nationality: 'Saudi Arabia',
    iqama_no: '1098492019',
    iqama_expiry: '2028-03-15',
    passport_no: 'K102948',
    passport_expiry: '2029-07-22',
    date_of_birth: '1998-11-04',
    years_experience: 2,
    specializations: ['Glazing Replacement', 'Structural Bolting', 'Facade Cleaning'],
    total_rope_hours: 680,
    fatigue_score: 0.0,
    last_deployment_date: '2026-08-01',
    next_available_date: '2026-08-31',
    daily_rate_sar: 850,
    emergency_contact_name: 'Farooq Al-Qarni',
    emergency_contact_phone: '+966 50 948 1029',
    blood_type: 'O+',
    medical_notes: 'Cleared for high-altitude & commercial high-rise',
    performance_rating: 4.75,
    rating_count: 12,
    is_featured: false,
    created_at: '2025-02-10T00:00:00Z',
    updated_at: '2026-08-15T00:00:00Z',
    irata_cert_expiry: '2027-02-08',
    medical_cert_expiry: '2026-09-27',
    profile: {
      id: 'prof-4',
      role: 'technician',
      full_name: 'Omar Farooq Al-Qarni',
      email: 'omar.farooq@petroprof.sa',
      phone: '+966 50 948 1029',
      avatar_url: null,
      preferred_language: 'en',
      timezone: 'Asia/Riyadh',
      is_active: true,
      onboarding_complete: true,
      last_seen_at: '2026-08-30T16:00:00Z',
      created_at: '2025-02-10T00:00:00Z',
      updated_at: '2026-08-15T00:00:00Z',
    },
  },
  {
    id: 'tech-5',
    profile_id: 'prof-5',
    employee_id: 'PP-T0255',
    irata_level: 'level_2',
    irata_membership_no: '2/120491',
    status: 'in_training',
    nationality: 'Saudi Arabia',
    iqama_no: '1081928491',
    iqama_expiry: '2027-10-01',
    passport_no: 'K782019',
    passport_expiry: '2028-09-14',
    date_of_birth: '1995-01-30',
    years_experience: 5,
    specializations: ['Welding 6G', 'Structural Maintenance', 'First Aider'],
    total_rope_hours: 1490,
    fatigue_score: 0.1,
    last_deployment_date: '2026-07-28',
    next_available_date: '2026-09-10',
    daily_rate_sar: 1300,
    emergency_contact_name: 'Saad Al-Shehri',
    emergency_contact_phone: '+966 55 109 2834',
    blood_type: 'AB+',
    medical_notes: 'Undergoing IRATA L3 Prep Course in Dammam',
    performance_rating: 4.82,
    rating_count: 18,
    is_featured: false,
    created_at: '2024-06-01T00:00:00Z',
    updated_at: '2026-08-22T00:00:00Z',
    irata_cert_expiry: '2026-10-03',
    medical_cert_expiry: '2027-05-20',
    profile: {
      id: 'prof-5',
      role: 'technician',
      full_name: 'Fahad Al-Shehri',
      email: 'fahad.shehri@petroprof.sa',
      phone: '+966 55 109 2834',
      avatar_url: null,
      preferred_language: 'en',
      timezone: 'Asia/Riyadh',
      is_active: true,
      onboarding_complete: true,
      last_seen_at: '2026-08-29T18:20:00Z',
      created_at: '2024-06-01T00:00:00Z',
      updated_at: '2026-08-22T00:00:00Z',
    },
  },
]

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
      return MOCK_TECHNICIANS.find((t) => t.id === id) || null
    }

    return data as unknown as TechnicianWithProfile
  } catch {
    return MOCK_TECHNICIANS.find((t) => t.id === id) || null
  }
}
