-- =============================================================================
-- Migration 003: Seed Initial Operational Data (Technicians, Jobs, Orgs)
-- Inserts into auth.users first, then populates profiles, technicians, & jobs.
-- Run this in your Supabase SQL Editor.
-- =============================================================================

-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Seed Client Organizations
INSERT INTO public.organizations (id, name, name_ar, industry_sector, commercial_reg_no, vat_number, contact_email, contact_phone, city, country, is_verified, is_active, tier)
VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', 'Saudi Aramco', 'أرامكو السعودية', 'Oil & Gas', '2050000001', '300000000000003', 'procurement@aramco.com', '+966 13 872 0115', 'Dhahran', 'Saudi Arabia', true, true, 'enterprise'),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'SABIC HQ', 'الشركة السعودية للصناعات الأساسية', 'Petrochemical', '1010000002', '300000000000004', 'maintenance@sabic.com', '+966 11 225 8000', 'Riyadh', 'Saudi Arabia', true, true, 'enterprise'),
  ('a1b2c3d4-0003-4000-8000-000000000003', 'ADES Offshore Drilling', 'أديس القابضة', 'Offshore Marine', '2051000003', '300000000000005', 'marine@adesgroup.com', '+966 13 833 9000', 'Al-Khobar', 'Saudi Arabia', true, true, 'enterprise')
ON CONFLICT (id) DO NOTHING;

-- 2. Seed Users in auth.users
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

-- 3. Upsert profiles in public.profiles (to ensure fields match)
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

-- 4. Seed Technicians in public.technicians
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
  irata_level = EXCLUDED.irata_level,
  status = EXCLUDED.status,
  total_rope_hours = EXCLUDED.total_rope_hours;

-- 5. Seed Certifications
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

-- 6. Seed Job Requests
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
