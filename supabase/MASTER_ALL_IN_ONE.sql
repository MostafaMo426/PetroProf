-- =============================================================================
-- PetroProf Portal — MASTER CONSOLIDATED DATABASE SETUP
-- Includes: Schema, Security Views, Foreign Key Cascades, & Demo Seed Data
-- Copy and paste this ENTIRE script into your Supabase SQL Editor and click RUN.
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- ── 1. Create Custom ENUM Types ──────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE public.user_role AS ENUM ('super_admin', 'admin', 'client', 'technician');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.irata_level AS ENUM ('level_1', 'level_2', 'level_3');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.technician_status AS ENUM ('available', 'deployed', 'on_leave', 'in_training', 'inactive', 'pending_review');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.job_status AS ENUM ('draft', 'submitted', 'ai_assessed', 'quoted', 'approved', 'crew_assigned', 'in_progress', 'completed', 'cancelled', 'disputed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.certification_type AS ENUM ('irata_certificate', 'medical_fitness', 'first_aid', 'confined_space', 'h2s_awareness', 'fire_watch', 'rigger_license', 'scaffolding', 'working_at_heights', 'ppe_inspection', 'other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.risk_level AS ENUM ('low', 'medium', 'high', 'critical');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.logbook_verification_status AS ENUM ('pending', 'verified', 'rejected', 'disputed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── 2. Create Core Tables with ON DELETE CASCADE ──────────────────────────────
CREATE TABLE IF NOT EXISTS public.organizations (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                TEXT NOT NULL,
  name_ar             TEXT,
  industry_sector     TEXT NOT NULL,
  commercial_reg_no   TEXT UNIQUE,
  vat_number          TEXT UNIQUE,
  contact_email       TEXT NOT NULL,
  contact_phone       TEXT,
  city                TEXT NOT NULL,
  country             TEXT NOT NULL DEFAULT 'Saudi Arabia',
  is_verified         BOOLEAN NOT NULL DEFAULT FALSE,
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,
  tier                TEXT NOT NULL DEFAULT 'standard',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.profiles (
  id                  UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role                public.user_role NOT NULL DEFAULT 'technician',
  full_name           TEXT NOT NULL,
  email               TEXT NOT NULL UNIQUE,
  phone               TEXT,
  avatar_url          TEXT,
  preferred_language  TEXT NOT NULL DEFAULT 'en',
  timezone            TEXT NOT NULL DEFAULT 'Asia/Riyadh',
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,
  onboarding_complete BOOLEAN NOT NULL DEFAULT FALSE,
  last_seen_at        TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.technicians (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id          UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  employee_id         TEXT UNIQUE,
  irata_level         public.irata_level NOT NULL,
  irata_membership_no TEXT UNIQUE,
  status              public.technician_status NOT NULL DEFAULT 'pending_review',
  nationality         TEXT,
  iqama_no            TEXT UNIQUE,
  iqama_expiry        DATE,
  passport_no         TEXT,
  passport_expiry     DATE,
  date_of_birth       DATE,
  years_experience    INTEGER NOT NULL DEFAULT 0,
  specializations     TEXT[],
  total_rope_hours    NUMERIC(8,2) NOT NULL DEFAULT 0,
  fatigue_score       NUMERIC(4,2) NOT NULL DEFAULT 0,
  last_deployment_date DATE,
  next_available_date DATE,
  daily_rate_sar      NUMERIC(10,2),
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  blood_type          TEXT,
  medical_notes       TEXT,
  performance_rating  NUMERIC(3,2),
  rating_count        INTEGER NOT NULL DEFAULT 0,
  is_featured         BOOLEAN NOT NULL DEFAULT FALSE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.certifications (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  technician_id       UUID NOT NULL REFERENCES public.technicians(id) ON DELETE CASCADE,
  cert_type           public.certification_type NOT NULL,
  cert_number         TEXT,
  issuing_body        TEXT,
  issue_date          DATE NOT NULL,
  expiry_date         DATE,
  is_lifetime         BOOLEAN NOT NULL DEFAULT FALSE,
  document_url        TEXT,
  thumbnail_url       TEXT,
  is_verified         BOOLEAN NOT NULL DEFAULT FALSE,
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.job_requests (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_number      TEXT UNIQUE,
  organization_id     UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  requested_by_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  project_name        TEXT NOT NULL,
  project_description TEXT NOT NULL,
  work_location       TEXT NOT NULL,
  work_city           TEXT NOT NULL,
  work_region         TEXT NOT NULL,
  start_date          DATE NOT NULL,
  end_date            DATE,
  estimated_duration_days INTEGER NOT NULL DEFAULT 1,
  required_level_1    INTEGER NOT NULL DEFAULT 0,
  required_level_2    INTEGER NOT NULL DEFAULT 0,
  required_level_3    INTEGER NOT NULL DEFAULT 1,
  required_specializations TEXT[],
  status              public.job_status NOT NULL DEFAULT 'submitted',
  priority            TEXT NOT NULL DEFAULT 'normal',
  base_quote_sar      NUMERIC(12,2),
  final_quote_sar     NUMERIC(12,2),
  quote_currency      TEXT NOT NULL DEFAULT 'SAR',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.logbook_entries (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  technician_id       UUID NOT NULL REFERENCES public.technicians(id) ON DELETE CASCADE,
  job_request_id      UUID REFERENCES public.job_requests(id) ON DELETE SET NULL,
  site_name           TEXT NOT NULL,
  site_location       TEXT,
  client_org_name     TEXT,
  work_description    TEXT NOT NULL,
  irata_level_used    public.irata_level NOT NULL,
  rope_hours          NUMERIC(5,2) NOT NULL,
  work_date           DATE NOT NULL,
  supervisor_name     TEXT,
  supervisor_id       UUID REFERENCES public.technicians(id) ON DELETE SET NULL,
  verification_status public.logbook_verification_status NOT NULL DEFAULT 'pending',
  qr_token            TEXT UNIQUE,
  verified_at         TIMESTAMPTZ,
  verified_by_id      UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.crew_assignments (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_request_id      UUID NOT NULL REFERENCES public.job_requests(id) ON DELETE CASCADE,
  technician_id       UUID NOT NULL REFERENCES public.technicians(id) ON DELETE CASCADE,
  assigned_by_id      UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  role_on_job         TEXT NOT NULL DEFAULT 'technician',
  mobilization_date   DATE NOT NULL,
  demobilization_date DATE,
  daily_rate_applied  NUMERIC(10,2) NOT NULL,
  status              TEXT NOT NULL DEFAULT 'active',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 3. Foreign Key Cascading Fixes ────────────────────────────────────────────
ALTER TABLE public.job_requests
  DROP CONSTRAINT IF EXISTS job_requests_requested_by_id_fkey,
  ADD CONSTRAINT job_requests_requested_by_id_fkey
    FOREIGN KEY (requested_by_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.job_requests
  DROP CONSTRAINT IF EXISTS job_requests_organization_id_fkey,
  ADD CONSTRAINT job_requests_organization_id_fkey
    FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

-- ── 4. Seed Client Organizations ─────────────────────────────────────────────
INSERT INTO public.organizations (id, name, name_ar, industry_sector, commercial_reg_no, vat_number, contact_email, contact_phone, city, country, is_verified, is_active, tier)
VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', 'Saudi Aramco', 'أرامكو السعودية', 'Oil & Gas', '2050000001', '300000000000003', 'procurement@aramco.com', '+966 13 872 0115', 'Dhahran', 'Saudi Arabia', true, true, 'enterprise'),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'SABIC HQ', 'الشركة السعودية للصناعات الأساسية', 'Petrochemical', '1010000002', '300000000000004', 'maintenance@sabic.com', '+966 11 225 8000', 'Riyadh', 'Saudi Arabia', true, true, 'enterprise'),
  ('a1b2c3d4-0003-4000-8000-000000000003', 'ADES Offshore Drilling', 'أديس القابضة', 'Offshore Marine', '2051000003', '300000000000005', 'marine@adesgroup.com', '+966 13 833 9000', 'Al-Khobar', 'Saudi Arabia', true, true, 'enterprise')
ON CONFLICT (id) DO NOTHING;

-- ── 5. Seed Users in auth.users ──────────────────────────────────────────────
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES
  (
    'b1c2d3e4-0001-4000-8000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'tariq.ghamdi@petroprof.sa',
    crypt('Password123!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Tariq Al-Ghamdi","role":"technician"}'::jsonb,
    now(), now()
  ),
  (
    'b1c2d3e4-0002-4000-8000-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'hassan.zahrani@petroprof.sa',
    crypt('Password123!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Hassan Al-Zahrani","role":"technician"}'::jsonb,
    now(), now()
  ),
  (
    'b1c2d3e4-0003-4000-8000-000000000003',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'david.mitchell@petroprof.sa',
    crypt('Password123!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"David Mitchell","role":"technician"}'::jsonb,
    now(), now()
  ),
  (
    'b1c2d3e4-0004-4000-8000-000000000004',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'omar.farooq@petroprof.sa',
    crypt('Password123!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Omar Farooq Al-Qarni","role":"technician"}'::jsonb,
    now(), now()
  ),
  (
    'b1c2d3e4-0005-4000-8000-000000000005',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'fahad.shehri@petroprof.sa',
    crypt('Password123!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Fahad Al-Shehri","role":"technician"}'::jsonb,
    now(), now()
  )
ON CONFLICT (id) DO NOTHING;

-- ── 6. Seed Profiles ─────────────────────────────────────────────────────────
INSERT INTO public.profiles (id, role, full_name, email, phone, is_active, onboarding_complete)
VALUES
  ('b1c2d3e4-0001-4000-8000-000000000001', 'technician', 'Tariq Al-Ghamdi', 'tariq.ghamdi@petroprof.sa', '+966 55 492 8192', true, true),
  ('b1c2d3e4-0002-4000-8000-000000000002', 'technician', 'Hassan Al-Zahrani', 'hassan.zahrani@petroprof.sa', '+966 54 819 2831', true, true),
  ('b1c2d3e4-0003-4000-8000-000000000003', 'technician', 'David Mitchell', 'david.mitchell@petroprof.sa', '+966 56 102 9384', true, true),
  ('b1c2d3e4-0004-4000-8000-000000000004', 'technician', 'Omar Farooq Al-Qarni', 'omar.farooq@petroprof.sa', '+966 50 948 1029', true, true),
  ('b1c2d3e4-0005-4000-8000-000000000005', 'technician', 'Fahad Al-Shehri', 'fahad.shehri@petroprof.sa', '+966 55 109 2834', true, true)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  phone = EXCLUDED.phone;

-- ── 7. Seed Technicians ──────────────────────────────────────────────────────
INSERT INTO public.technicians (
  id, profile_id, employee_id, irata_level, irata_membership_no, status,
  nationality, iqama_no, years_experience, specializations, total_rope_hours,
  fatigue_score, daily_rate_sar, emergency_contact_name, emergency_contact_phone,
  blood_type, medical_notes, performance_rating, rating_count, is_featured
)
VALUES
  (
    'c1d2e3f4-0001-4000-8000-000000000001',
    'b1c2d3e4-0001-4000-8000-000000000001',
    'PP-T0142',
    'level_3',
    '3/89421',
    'deployed',
    'Saudi Arabia',
    '1084291842',
    11,
    ARRAY['NDT UT/MT', 'Advanced Rigging', 'Rescue Supervisor', 'Offshore'],
    4850,
    1.2,
    1850.00,
    'Saeed Al-Ghamdi',
    '+966 50 123 4567',
    'O+',
    'Annual Offshore Fitness Certified (Aramco Approved)',
    4.95,
    38,
    true
  ),
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
  ),
  (
    'c1d2e3f4-0003-4000-8000-000000000003',
    'b1c2d3e4-0003-4000-8000-000000000003',
    'PP-T0204',
    'level_3',
    '3/76291',
    'deployed',
    'United Kingdom',
    '2491028491',
    14,
    ARRAY['Offshore Flare Tips', 'Complex Tensioned Lines', 'Technical Rescue', 'Site Audit'],
    6200,
    1.8,
    1950.00,
    'Sarah Mitchell',
    '+44 7700 900077',
    'B+',
    'Fit for all industrial environments',
    4.98,
    52,
    true
  ),
  (
    'c1d2e3f4-0004-4000-8000-000000000004',
    'b1c2d3e4-0004-4000-8000-000000000004',
    'PP-T0231',
    'level_1',
    '1/149204',
    'available',
    'Saudi Arabia',
    '1098492019',
    2,
    ARRAY['Glazing Replacement', 'Structural Bolting', 'Facade Cleaning'],
    680,
    0.0,
    850.00,
    'Farooq Al-Qarni',
    '+966 50 948 1029',
    'O+',
    'Cleared for high-altitude & commercial high-rise',
    4.75,
    12,
    false
  ),
  (
    'c1d2e3f4-0005-4000-8000-000000000005',
    'b1c2d3e4-0005-4000-8000-000000000005',
    'PP-T0255',
    'level_2',
    '2/120491',
    'in_training',
    'Saudi Arabia',
    '1081928491',
    5,
    ARRAY['Welding 6G', 'Structural Maintenance', 'First Aider'],
    1490,
    0.1,
    1300.00,
    'Saad Al-Shehri',
    '+966 55 109 2834',
    'AB+',
    'Undergoing IRATA L3 Prep Course in Dammam',
    4.82,
    18,
    false
  )
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  irata_level = EXCLUDED.irata_level,
  total_rope_hours = EXCLUDED.total_rope_hours;

-- ── 8. Seed Certifications ───────────────────────────────────────────────────
INSERT INTO public.certifications (
  technician_id, cert_type, cert_number, issuing_body, issue_date, expiry_date, is_verified, is_active
)
VALUES
  ('c1d2e3f4-0001-4000-8000-000000000001', 'irata_certificate', '3/89421', 'IRATA International', '2023-09-28', '2026-09-28', true, true),
  ('c1d2e3f4-0002-4000-8000-000000000002', 'irata_certificate', '2/104829', 'IRATA International', '2024-05-14', '2027-05-14', true, true),
  ('c1d2e3f4-0002-4000-8000-000000000002', 'medical_fitness', 'MED-2025-9182', 'Saudi Aramco Medical Services', '2025-09-18', '2026-09-18', true, true),
  ('c1d2e3f4-0003-4000-8000-000000000003', 'irata_certificate', '3/76291', 'IRATA International', '2024-11-05', '2027-11-05', true, true),
  ('c1d2e3f4-0004-4000-8000-000000000004', 'h2s_awareness', 'H2S-891024', 'Saudi Red Crescent Authority', '2024-09-27', '2026-09-27', true, true),
  ('c1d2e3f4-0005-4000-8000-000000000005', 'confined_space', 'CS-2024-119', 'Saudi Civil Defense', '2024-10-03', '2026-10-03', true, true)
ON CONFLICT DO NOTHING;

-- ── 9. Seed Job Requests ─────────────────────────────────────────────────────
INSERT INTO public.job_requests (
  id, request_number, organization_id, requested_by_id, project_name, project_description,
  work_location, work_city, work_region, start_date, end_date, estimated_duration_days,
  required_level_1, required_level_2, required_level_3, required_specializations,
  status, priority, base_quote_sar, final_quote_sar, quote_currency
)
VALUES
  (
    'd1e2f3a4-0001-4000-8000-000000000001',
    'PR-2026-0041',
    'a1b2c3d4-0001-4000-8000-000000000001',
    'b1c2d3e4-0001-4000-8000-000000000001',
    'Flare Stack Inspection #3 & Anchor Line Rigging',
    'Ultrasonic thickness testing (UT) on flare tip structure and high-temperature riser lines at 110m elevation.',
    'Ras Tanura Refinery, Eastern Province',
    'Ras Tanura',
    'Eastern Province',
    '2026-08-25',
    '2026-09-08',
    14,
    3, 2, 1,
    ARRAY['NDT UT/MT', 'H2S Gas Safety', 'Hot Work Permit'],
    'in_progress',
    'urgent',
    82500.00,
    94875.00,
    'SAR'
  ),
  (
    'd1e2f3a4-0002-4000-8000-000000000002',
    'PR-2026-0040',
    'a1b2c3d4-0002-4000-8000-000000000002',
    'b1c2d3e4-0002-4000-8000-000000000002',
    'HQ Tower Exterior Cladding & Glass Sealant Renewal',
    'Facade glass panel structural silicone replacement and weather-stripping at 160m tower height in Riyadh Digital City.',
    'Digital City, Riyadh',
    'Riyadh',
    'Central Province',
    '2026-08-20',
    '2026-09-05',
    16,
    3, 0, 1,
    ARRAY['Facade Glazing', 'Structural Silicone'],
    'in_progress',
    'normal',
    54000.00,
    62100.00,
    'SAR'
  ),
  (
    'd1e2f3a4-0003-4000-8000-000000000003',
    'PR-2026-0038',
    'a1b2c3d4-0003-4000-8000-000000000003',
    'b1c2d3e4-0003-4000-8000-000000000003',
    'Offshore Jack-up Rig Flare Boom Guy-Wire Tensioning',
    'Offshore rope access tensioning of structural guy wires and replacement of safety lighting on cantilevered flare boom over open water.',
    'Safaniya Oil Field (Offshore Arabian Gulf)',
    'Safaniya',
    'Eastern Province Offshore',
    '2026-09-10',
    '2026-09-24',
    14,
    4, 4, 2,
    ARRAY['BOSIET Offshore Certified', 'Heavy Rigging', 'Offshore Survival'],
    'quoted',
    'urgent',
    142000.00,
    163300.00,
    'SAR'
  )
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  final_quote_sar = EXCLUDED.final_quote_sar;

-- ── 10. Enable Row Level Security (RLS) & Define Access Policies ──────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logbook_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crew_assignments ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read profiles & technicians
DROP POLICY IF EXISTS "Allow read profiles for authenticated" ON public.profiles;
CREATE POLICY "Allow read profiles for authenticated" ON public.profiles FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow read technicians for authenticated" ON public.technicians;
CREATE POLICY "Allow read technicians for authenticated" ON public.technicians FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow read organizations for authenticated" ON public.organizations;
CREATE POLICY "Allow read organizations for authenticated" ON public.organizations FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow read job_requests for authenticated" ON public.job_requests;
CREATE POLICY "Allow read job_requests for authenticated" ON public.job_requests FOR SELECT TO authenticated USING (true);
