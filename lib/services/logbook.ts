/**
 * lib/services/logbook.ts
 * Digital IRATA Logbook service with QR verification tokens and hour tracking.
 */
import { createClient } from '@/lib/supabase/client'
import type { LogbookVerificationStatus, IrataLevel } from '@/types/database.types'

export interface LogbookEntryView {
  id: string
  technician_id: string
  site_name: string
  site_location: string
  client_org_name: string
  work_description: string
  irata_level_used: IrataLevel
  rope_hours: number
  work_date: string
  supervisor_name: string
  verification_status: LogbookVerificationStatus
  qr_token: string
  verified_at: string | null
  created_at: string
}

export const MOCK_LOGBOOK_ENTRIES: LogbookEntryView[] = [
  {
    id: 'log-1',
    technician_id: 'tech-2',
    site_name: 'Ras Tanura Refinery Flare Stack #3',
    site_location: 'Ras Tanura, Eastern Province',
    client_org_name: 'Saudi Aramco',
    work_description: 'NDT Ultrasonic thickness inspection on flare riser sections at 90m height. Anchor system rigging & continuous gas monitoring.',
    irata_level_used: 'level_2',
    rope_hours: 8.5,
    work_date: '2026-08-29',
    supervisor_name: 'Tariq Al-Ghamdi (L3)',
    verification_status: 'pending',
    qr_token: 'qr_token_rt3_0829',
    verified_at: null,
    created_at: '2026-08-29T18:00:00Z',
  },
  {
    id: 'log-2',
    technician_id: 'tech-2',
    site_name: 'Ras Tanura Refinery Flare Stack #3',
    site_location: 'Ras Tanura, Eastern Province',
    client_org_name: 'Saudi Aramco',
    work_description: 'Installation of high-temperature rope protectors and rigging dual 11mm static lines for ultrasonic testing crew.',
    irata_level_used: 'level_2',
    rope_hours: 7.0,
    work_date: '2026-08-28',
    supervisor_name: 'Tariq Al-Ghamdi (L3)',
    verification_status: 'verified',
    qr_token: 'qr_token_rt3_0828',
    verified_at: '2026-08-28T17:30:00Z',
    created_at: '2026-08-28T18:00:00Z',
  },
  {
    id: 'log-3',
    technician_id: 'tech-2',
    site_name: 'SABIC Digital City HQ',
    site_location: 'Riyadh',
    client_org_name: 'SABIC',
    work_description: 'Glazing silicone renewal on southern facade panels at 140m elevation using tensioned diagonal line rigging.',
    irata_level_used: 'level_2',
    rope_hours: 9.0,
    work_date: '2026-08-24',
    supervisor_name: 'Mansour Al-Harbi (L3)',
    verification_status: 'verified',
    qr_token: 'qr_token_sabic_0824',
    verified_at: '2026-08-24T20:00:00Z',
    created_at: '2026-08-24T20:30:00Z',
  },
  {
    id: 'log-4',
    technician_id: 'tech-2',
    site_name: 'Yanbu Petrochemical Ethylene Cracker',
    site_location: 'Yanbu Industrial City',
    client_org_name: 'YANSAB',
    work_description: 'Confined space vertical column internal weld visual inspection and emergency rescue line standby.',
    irata_level_used: 'level_2',
    rope_hours: 8.0,
    work_date: '2026-08-14',
    supervisor_name: 'Mansour Al-Harbi (L3)',
    verification_status: 'verified',
    qr_token: 'qr_token_yansab_0814',
    verified_at: '2026-08-14T18:45:00Z',
    created_at: '2026-08-14T19:00:00Z',
  },
]

export async function getLogbookEntries(): Promise<LogbookEntryView[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('logbook_entries')
      .select('*')
      .order('work_date', { ascending: false })

    if (error || !data || data.length === 0) {
      return MOCK_LOGBOOK_ENTRIES
    }

    return data as LogbookEntryView[]
  } catch {
    return MOCK_LOGBOOK_ENTRIES
  }
}
