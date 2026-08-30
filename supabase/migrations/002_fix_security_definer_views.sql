-- =============================================================================
-- PetroProf Portal — Hotfix: Security Definer View Warnings
-- Run this in Supabase SQL Editor to fix the 3 CRITICAL security advisories.
--
-- Root Cause: PostgreSQL views default to SECURITY DEFINER behavior,
-- running as the view owner (superuser), which BYPASSES Row Level Security.
--
-- Fix: WITH (security_invoker = true) forces the view to run as the
-- calling user, so all RLS policies are fully enforced.
-- Requires PostgreSQL 15+ (Supabase runs PG 15+).
-- =============================================================================

-- Fix 1: v_technician_dashboard
DROP VIEW IF EXISTS public.v_technician_dashboard;

CREATE OR REPLACE VIEW public.v_technician_dashboard
    WITH (security_invoker = true)
AS
SELECT
    t.id                        AS technician_id,
    p.full_name,
    p.email,
    p.avatar_url,
    t.irata_level,
    t.irata_membership_no,
    t.status,
    t.total_rope_hours,
    t.performance_rating,
    t.rating_count,
    t.daily_rate_sar,
    t.fatigue_score,
    t.specializations,
    t.next_available_date,
    (
        SELECT expiry_date FROM public.certifications c
        WHERE c.technician_id = t.id
          AND c.cert_type = 'irata_certificate'
          AND c.is_active = TRUE
        ORDER BY c.expiry_date DESC LIMIT 1
    ) AS irata_cert_expiry,
    (
        SELECT expiry_date FROM public.certifications c
        WHERE c.technician_id = t.id
          AND c.cert_type = 'medical_fitness'
          AND c.is_active = TRUE
        ORDER BY c.expiry_date DESC LIMIT 1
    ) AS medical_cert_expiry,
    (
        SELECT COUNT(*) FROM public.crew_assignments ca
        JOIN public.job_requests jr ON jr.id = ca.job_request_id
        WHERE ca.technician_id = t.id
          AND jr.status IN ('crew_assigned', 'in_progress')
    ) AS active_assignments,
    t.created_at
FROM public.technicians t
JOIN public.profiles p ON p.id = t.profile_id;

-- Fix 2: v_expiring_certifications
DROP VIEW IF EXISTS public.v_expiring_certifications;

CREATE OR REPLACE VIEW public.v_expiring_certifications
    WITH (security_invoker = true)
AS
SELECT
    c.id                    AS cert_id,
    c.technician_id,
    p.full_name             AS technician_name,
    p.email                 AS technician_email,
    t.irata_level,
    t.status                AS technician_status,
    c.cert_type,
    c.cert_number,
    c.issuing_body,
    c.expiry_date,
    c.is_verified,
    (c.expiry_date - CURRENT_DATE) AS days_until_expiry,
    CASE
        WHEN (c.expiry_date - CURRENT_DATE) <= 0  THEN 'expired'
        WHEN (c.expiry_date - CURRENT_DATE) <= 14 THEN 'critical'
        WHEN (c.expiry_date - CURRENT_DATE) <= 30 THEN 'urgent'
        WHEN (c.expiry_date - CURRENT_DATE) <= 90 THEN 'warning'
        ELSE 'ok'
    END AS expiry_status
FROM public.certifications c
JOIN public.technicians t   ON t.id = c.technician_id
JOIN public.profiles p      ON p.id = t.profile_id
WHERE c.is_active = TRUE
  AND c.is_lifetime = FALSE
  AND c.expiry_date IS NOT NULL
ORDER BY c.expiry_date ASC;

-- Fix 3: v_job_pipeline
DROP VIEW IF EXISTS public.v_job_pipeline;

CREATE OR REPLACE VIEW public.v_job_pipeline
    WITH (security_invoker = true)
AS
SELECT
    jr.id,
    jr.request_number,
    jr.project_name,
    jr.work_location,
    jr.status,
    jr.priority,
    jr.start_date,
    jr.end_date,
    jr.final_quote_sar,
    jr.quote_currency,
    o.name                  AS client_org_name,
    o.logo_url              AS client_logo_url,
    p.full_name             AS requested_by_name,
    (jr.required_level_1 + jr.required_level_2 + jr.required_level_3) AS total_crew_required,
    (
        SELECT COUNT(*) FROM public.crew_assignments ca
        WHERE ca.job_request_id = jr.id
    ) AS crew_assigned_count,
    (
        SELECT overall_risk_level FROM public.ai_risk_assessments ar
        WHERE ar.job_request_id = jr.id
        ORDER BY ar.assessed_at DESC LIMIT 1
    ) AS ai_risk_level,
    jr.created_at,
    jr.updated_at
FROM public.job_requests jr
JOIN public.organizations o ON o.id = jr.organization_id
JOIN public.profiles p      ON p.id = jr.requested_by_id
ORDER BY
    CASE jr.priority
        WHEN 'urgent' THEN 1
        WHEN 'high'   THEN 2
        WHEN 'normal' THEN 3
        WHEN 'low'    THEN 4
    END,
    jr.created_at DESC;

-- =============================================================================
-- Verification query: All 3 rows should show security_invoker = 't'
-- =============================================================================
SELECT
    schemaname,
    viewname,
    (SELECT option_value
     FROM pg_options_to_table(reloptions)
     WHERE option_name = 'security_invoker'
    ) AS security_invoker
FROM pg_views
JOIN pg_class ON relname = viewname
WHERE schemaname = 'public'
  AND viewname IN (
    'v_technician_dashboard',
    'v_expiring_certifications',
    'v_job_pipeline'
  );
