-- =============================================================================
-- Migration 004: Enable ON DELETE CASCADE for foreign keys & repair technicians
-- Run this in your Supabase SQL Editor to allow deleting any profile without errors.
-- =============================================================================

-- 1. Fix job_requests foreign keys to CASCADE/SET NULL on profile deletion
ALTER TABLE public.job_requests
  DROP CONSTRAINT IF EXISTS job_requests_requested_by_id_fkey,
  ADD CONSTRAINT job_requests_requested_by_id_fkey
    FOREIGN KEY (requested_by_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.job_requests
  DROP CONSTRAINT IF EXISTS job_requests_organization_id_fkey,
  ADD CONSTRAINT job_requests_organization_id_fkey
    FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

-- 2. Fix logbook_entries foreign keys
ALTER TABLE public.logbook_entries
  DROP CONSTRAINT IF EXISTS logbook_entries_supervisor_id_fkey,
  ADD CONSTRAINT logbook_entries_supervisor_id_fkey
    FOREIGN KEY (supervisor_id) REFERENCES public.technicians(id) ON DELETE SET NULL;

ALTER TABLE public.logbook_entries
  DROP CONSTRAINT IF EXISTS logbook_entries_verified_by_id_fkey,
  ADD CONSTRAINT logbook_entries_verified_by_id_fkey
    FOREIGN KEY (verified_by_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- 3. Fix crew_assignments foreign keys
ALTER TABLE public.crew_assignments
  DROP CONSTRAINT IF EXISTS crew_assignments_technician_id_fkey,
  ADD CONSTRAINT crew_assignments_technician_id_fkey
    FOREIGN KEY (technician_id) REFERENCES public.technicians(id) ON DELETE CASCADE;

ALTER TABLE public.crew_assignments
  DROP CONSTRAINT IF EXISTS crew_assignments_assigned_by_id_fkey,
  ADD CONSTRAINT crew_assignments_assigned_by_id_fkey
    FOREIGN KEY (assigned_by_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- 4. Ensure all technicians have their matching rows in public.technicians
INSERT INTO public.technicians (
  id, profile_id, employee_id, irata_level, irata_membership_no, status,
  nationality, iqama_no, years_experience, specializations, total_rope_hours,
  fatigue_score, daily_rate_sar, emergency_contact_name, emergency_contact_phone,
  blood_type, medical_notes, performance_rating, rating_count, is_featured
)
VALUES
  (
    'c1d2e3f4-0002-4000-8000-000000000002',
    'b1c2d3e4-0002-4000-8000-000000000002',
    'PP-T0189',
    'level_2',
    '2/104829',
    'available',
    'Saudi Arabia',
    '1092817462',
    6,
    ARRAY['NDT Thickness Gauging', 'Heavy Rigging', 'Painting & Blasting'],
    2180,
    0.4,
    1250.00,
    'Waleed Al-Zahrani',
    '+966 54 819 2831',
    'A+',
    'Fit for Working at Heights & Confined Space',
    4.88,
    24,
    true
  )
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  irata_level = EXCLUDED.irata_level;
