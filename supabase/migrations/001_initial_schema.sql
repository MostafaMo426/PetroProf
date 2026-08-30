-- =============================================================================
-- SECURITY NOTE: All views use WITH (security_invoker = true) to ensure
-- they execute under the calling user's privileges, fully respecting RLS.
-- This resolves Supabase Advisor "Security Definer View" critical warnings.
-- PetroProf Portal — Supabase Database Schema
-- Phase 1: Database Architecture
-- Version: 1.0.0
-- Description: Complete PostgreSQL schema for a B2B SaaS Rope Access Training
--              & Manpower Dispatch platform.
--
-- Execution Order:
--   1. Enable extensions
--   2. Create ENUM types
--   3. Create core tables (users/roles)
--   4. Create domain tables
--   5. Create junction/operational tables
--   6. Create indexes
--   7. Enable RLS & define policies
--   8. Create helper functions & triggers
-- =============================================================================

-- =============================================================================
-- SECTION 1: EXTENSIONS
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";      -- UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";        -- Cryptographic functions
CREATE EXTENSION IF NOT EXISTS "pg_trgm";         -- Fuzzy text search (technician lookup)
CREATE EXTENSION IF NOT EXISTS "unaccent";        -- Accent-insensitive search

-- =============================================================================
-- SECTION 2: CUSTOM ENUM TYPES
-- =============================================================================

-- User roles within the platform (RBAC)
CREATE TYPE public.user_role AS ENUM (
    'super_admin',      -- PetroProf platform operator
    'admin',            -- Dispatch center admin
    'client',           -- B2B client company representative
    'technician'        -- Rope access technician
);

-- IRATA certification levels (Industry standard)
CREATE TYPE public.irata_level AS ENUM (
    'level_1',          -- Rope Access Technician Level 1 (entry)
    'level_2',          -- Rope Access Technician Level 2 (intermediate)
    'level_3'           -- Rope Access Technician Level 3 (supervisor)
);

-- Technician availability & operational status
CREATE TYPE public.technician_status AS ENUM (
    'available',        -- Ready for deployment
    'deployed',         -- Currently on an active job
    'on_leave',         -- Approved leave / vacation
    'in_training',      -- Undergoing training or recertification
    'inactive',         -- Profile suspended / inactive
    'pending_review'    -- Profile submitted, awaiting admin approval
);

-- Job request lifecycle states
CREATE TYPE public.job_status AS ENUM (
    'draft',            -- Client hasn't submitted yet
    'submitted',        -- Submitted, pending admin review
    'ai_assessed',      -- AI risk assessment complete
    'quoted',           -- Quote generated, sent to client
    'approved',         -- Client approved the quote
    'crew_assigned',    -- Admin assigned technicians
    'in_progress',      -- Job is actively underway
    'completed',        -- Job finished successfully
    'cancelled',        -- Job cancelled
    'disputed'          -- Post-completion dispute raised
);

-- Certification document types tracked by the platform
CREATE TYPE public.certification_type AS ENUM (
    'irata_certificate',
    'medical_fitness',      -- Annual medical fitness certificate
    'first_aid',            -- First Aid & CPR
    'confined_space',       -- Confined Space Entry
    'h2s_awareness',        -- H2S Awareness (critical for oil & gas)
    'fire_watch',
    'rigger_license',
    'scaffolding',
    'working_at_heights',
    'ppe_inspection',
    'other'
);

-- AI assessment risk levels
CREATE TYPE public.risk_level AS ENUM (
    'low',
    'medium',
    'high',
    'critical'
);

-- Logbook entry verification states
CREATE TYPE public.logbook_verification_status AS ENUM (
    'pending',          -- Logged by technician, awaiting supervisor sign-off
    'verified',         -- Supervisor verified via QR/manual
    'rejected',         -- Supervisor rejected the entry
    'disputed'          -- Technician disputed a rejection
);

-- Notification types for the notification center
CREATE TYPE public.notification_type AS ENUM (
    'cert_expiry_warning',
    'medical_expiry_warning',
    'job_status_update',
    'crew_assignment',
    'quote_ready',
    'logbook_verified',
    'logbook_rejected',
    'system_alert',
    'new_message'
);

-- Quote/pricing currency (Saudi context)
CREATE TYPE public.currency_code AS ENUM ('SAR', 'USD', 'EUR');

-- =============================================================================
-- SECTION 3: CORE TABLES
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 3.1 profiles — extends auth.users (Supabase Auth user metadata)
-- -----------------------------------------------------------------------------
CREATE TABLE public.profiles (
    id                  UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role                public.user_role NOT NULL DEFAULT 'client',
    full_name           TEXT NOT NULL,
    email               TEXT NOT NULL UNIQUE,
    phone               TEXT,
    avatar_url          TEXT,                          -- Supabase Storage URL
    preferred_language  TEXT NOT NULL DEFAULT 'en',   -- 'en' | 'ar'
    timezone            TEXT NOT NULL DEFAULT 'Asia/Riyadh',
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    onboarding_complete BOOLEAN NOT NULL DEFAULT FALSE,
    last_seen_at        TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.profiles IS
    'Extends auth.users. Central profile table for all platform users. Role determines portal access.';

-- -----------------------------------------------------------------------------
-- 3.2 organizations — B2B client companies (multi-tenant anchor)
-- -----------------------------------------------------------------------------
CREATE TABLE public.organizations (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name                TEXT NOT NULL,
    name_ar             TEXT,                              -- Arabic name
    industry_sector     TEXT NOT NULL DEFAULT 'Oil & Gas', -- e.g., Oil & Gas, Construction, Petrochemical
    commercial_reg_no   TEXT UNIQUE,                       -- Saudi CR number
    vat_number          TEXT,                              -- VAT registration
    contact_email       TEXT NOT NULL,
    contact_phone       TEXT,
    website_url         TEXT,
    logo_url            TEXT,
    address_line1       TEXT,
    address_line2       TEXT,
    city                TEXT NOT NULL DEFAULT 'Riyadh',
    region              TEXT,                              -- e.g., Eastern Province
    country             TEXT NOT NULL DEFAULT 'Saudi Arabia',
    postal_code         TEXT,
    is_verified         BOOLEAN NOT NULL DEFAULT FALSE,    -- Admin-verified org
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    tier                TEXT NOT NULL DEFAULT 'standard',  -- 'standard' | 'premium' | 'enterprise'
    notes               TEXT,                              -- Admin internal notes
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.organizations IS
    'Multi-tenant anchor. Each B2B client company is an organization. Technicians may belong to one org (the dispatch center) or none.';

-- -----------------------------------------------------------------------------
-- 3.3 organization_members — links profiles to organizations with sub-roles
-- -----------------------------------------------------------------------------
CREATE TABLE public.organization_members (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    profile_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    sub_role        TEXT NOT NULL DEFAULT 'member',   -- 'owner' | 'admin' | 'member' | 'viewer'
    department      TEXT,
    job_title       TEXT,
    joined_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(organization_id, profile_id)
);

COMMENT ON TABLE public.organization_members IS
    'Junction table linking profiles to organizations with granular sub-roles.';

-- =============================================================================
-- SECTION 4: TECHNICIAN DOMAIN
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 4.1 technicians — extended profile for rope access technicians
-- -----------------------------------------------------------------------------
CREATE TABLE public.technicians (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id              UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    employee_id             TEXT UNIQUE,                       -- Internal employee number
    irata_level             public.irata_level NOT NULL,
    irata_membership_no     TEXT UNIQUE,                       -- Global IRATA member number
    status                  public.technician_status NOT NULL DEFAULT 'pending_review',
    nationality             TEXT,
    iqama_no                TEXT UNIQUE,                       -- Saudi residence permit
    iqama_expiry            DATE,
    passport_no             TEXT,
    passport_expiry         DATE,
    date_of_birth           DATE,
    years_experience        INTEGER NOT NULL DEFAULT 0,
    specializations         TEXT[],                            -- e.g., ['NDT', 'painting', 'inspection']
    total_rope_hours        NUMERIC(8,2) NOT NULL DEFAULT 0,   -- Accumulated from logbook
    fatigue_score           NUMERIC(4,2) NOT NULL DEFAULT 0,   -- 0-10, reset after rest period
    last_deployment_date    DATE,
    next_available_date     DATE,
    daily_rate_sar          NUMERIC(10,2),                     -- Base rate in SAR
    emergency_contact_name  TEXT,
    emergency_contact_phone TEXT,
    blood_type              TEXT,
    medical_notes           TEXT,
    performance_rating      NUMERIC(3,2),                      -- Average 0-5 from completed jobs
    rating_count            INTEGER NOT NULL DEFAULT 0,
    is_featured             BOOLEAN NOT NULL DEFAULT FALSE,    -- Admin can feature elite techs
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.technicians IS
    'Extended profile for rope access technicians. Links to profiles via profile_id. Tracks IRATA credentials, status, and operational metrics.';

-- -----------------------------------------------------------------------------
-- 4.2 certifications — all certification documents for technicians
-- -----------------------------------------------------------------------------
CREATE TABLE public.certifications (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    technician_id       UUID NOT NULL REFERENCES public.technicians(id) ON DELETE CASCADE,
    cert_type           public.certification_type NOT NULL,
    cert_number         TEXT,
    issuing_body        TEXT,                              -- e.g., 'IRATA International', 'Saudi Red Crescent'
    issue_date          DATE NOT NULL,
    expiry_date         DATE,
    is_lifetime         BOOLEAN NOT NULL DEFAULT FALSE,    -- Some certs don't expire
    document_url        TEXT,                              -- Supabase Storage URL
    thumbnail_url       TEXT,                              -- Auto-generated thumbnail
    is_verified         BOOLEAN NOT NULL DEFAULT FALSE,    -- Admin manually verified
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    -- AI Extraction Metadata
    ai_extracted        BOOLEAN NOT NULL DEFAULT FALSE,    -- Was data filled by Gemini?
    ai_confidence_score NUMERIC(4,3),                      -- 0.000-1.000 Gemini confidence
    ai_raw_response     JSONB,                             -- Full Gemini API response for audit
    ai_extracted_at     TIMESTAMPTZ,
    notes               TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Constraint: non-lifetime certs must have expiry
    CONSTRAINT cert_expiry_required CHECK (is_lifetime = TRUE OR expiry_date IS NOT NULL)
);

COMMENT ON TABLE public.certifications IS
    'Tracks all certification documents. Integrates with Gemini Vision for AI-powered OCR extraction.';

-- -----------------------------------------------------------------------------
-- 4.3 logbook_entries — digital IRATA rope access hour log
-- -----------------------------------------------------------------------------
CREATE TABLE public.logbook_entries (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    technician_id       UUID NOT NULL REFERENCES public.technicians(id) ON DELETE CASCADE,
    job_request_id      UUID,                              -- FK added after job_requests table
    site_name           TEXT NOT NULL,
    site_location       TEXT,
    client_org_name     TEXT,                              -- Denormalized for offline use
    work_description    TEXT NOT NULL,
    irata_level_used    public.irata_level NOT NULL,
    rope_hours          NUMERIC(5,2) NOT NULL CHECK (rope_hours > 0 AND rope_hours <= 24),
    work_date           DATE NOT NULL,
    start_time          TIME,
    end_time            TIME,
    supervisor_name     TEXT,
    supervisor_id       UUID REFERENCES public.technicians(id),  -- Level 3 supervisor on-site
    -- QR Verification
    verification_status public.logbook_verification_status NOT NULL DEFAULT 'pending',
    qr_token            TEXT UNIQUE,                       -- One-time QR verification token
    qr_token_expires_at TIMESTAMPTZ,
    verified_at         TIMESTAMPTZ,
    verified_by_id      UUID REFERENCES public.profiles(id),
    verification_method TEXT,                              -- 'qr_scan' | 'manual' | 'bulk_import'
    rejection_reason    TEXT,
    -- Geolocation
    latitude            NUMERIC(10,8),
    longitude           NUMERIC(11,8),
    location_accuracy   NUMERIC(6,2),                      -- Accuracy in meters
    notes               TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.logbook_entries IS
    'Digital IRATA logbook. Technicians log rope hours per work day. QR token enables supervisor on-site verification.';

-- =============================================================================
-- SECTION 5: JOB REQUESTS & QUOTING DOMAIN
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 5.1 job_requests — client manpower requests (core operational entity)
-- -----------------------------------------------------------------------------
CREATE TABLE public.job_requests (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_number          TEXT UNIQUE,                       -- Human-readable: PR-2025-0001
    organization_id         UUID NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
    requested_by_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    -- Job Details
    project_name            TEXT NOT NULL,
    project_description     TEXT NOT NULL,                     -- Raw input for AI analysis
    work_location           TEXT NOT NULL,
    work_city               TEXT,
    work_region             TEXT,
    latitude                NUMERIC(10,8),
    longitude               NUMERIC(11,8),
    start_date              DATE,
    end_date                DATE,
    estimated_duration_days INTEGER,
    -- Crew Requirements (can be AI-populated)
    required_level_1        INTEGER NOT NULL DEFAULT 0,
    required_level_2        INTEGER NOT NULL DEFAULT 0,
    required_level_3        INTEGER NOT NULL DEFAULT 0,
    required_specializations TEXT[],
    required_equipment      TEXT[],                            -- AI-recommended equipment list
    -- Status & Workflow
    status                  public.job_status NOT NULL DEFAULT 'draft',
    priority                TEXT NOT NULL DEFAULT 'normal',    -- 'low' | 'normal' | 'high' | 'urgent'
    -- Quoting
    base_quote_sar          NUMERIC(12,2),
    final_quote_sar         NUMERIC(12,2),
    quote_breakdown         JSONB,                             -- Itemized pricing detail
    quote_currency          public.currency_code NOT NULL DEFAULT 'SAR',
    quote_valid_until       DATE,
    quote_sent_at           TIMESTAMPTZ,
    quote_approved_at       TIMESTAMPTZ,
    -- Completion
    completed_at            TIMESTAMPTZ,
    client_rating           INTEGER CHECK (client_rating BETWEEN 1 AND 5),
    client_feedback         TEXT,
    admin_notes             TEXT,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Validate crew: at least one technician required
    CONSTRAINT min_crew_required CHECK (
        (required_level_1 + required_level_2 + required_level_3) > 0
        OR status = 'draft'
    )
);

COMMENT ON TABLE public.job_requests IS
    'Core operational entity. Client manpower requests flow through a status lifecycle from draft to completed. Linked to AI risk assessments and crew assignments.';

-- Now add the FK for logbook_entries.job_request_id
ALTER TABLE public.logbook_entries
    ADD CONSTRAINT logbook_entries_job_request_id_fkey
    FOREIGN KEY (job_request_id) REFERENCES public.job_requests(id) ON DELETE SET NULL;

-- -----------------------------------------------------------------------------
-- 5.2 ai_risk_assessments — Gemini risk analysis results per job request
-- -----------------------------------------------------------------------------
CREATE TABLE public.ai_risk_assessments (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_request_id          UUID NOT NULL REFERENCES public.job_requests(id) ON DELETE CASCADE,
    -- Risk Analysis
    overall_risk_level      public.risk_level NOT NULL,
    risk_summary            TEXT NOT NULL,                     -- AI-generated executive summary
    identified_hazards      JSONB NOT NULL DEFAULT '[]',       -- Array of hazard objects
    -- Recommended Crew
    recommended_level_1     INTEGER NOT NULL DEFAULT 0,
    recommended_level_2     INTEGER NOT NULL DEFAULT 0,
    recommended_level_3     INTEGER NOT NULL DEFAULT 0,
    min_supervisor_required BOOLEAN NOT NULL DEFAULT FALSE,    -- True = mandatory Level 3
    -- Recommended Equipment
    mandatory_equipment     TEXT[] NOT NULL DEFAULT '{}',
    optional_equipment      TEXT[] NOT NULL DEFAULT '{}',
    -- Safety Requirements
    required_permits        TEXT[],                            -- e.g., 'Working at Height Permit'
    weather_restrictions    TEXT[],                            -- e.g., 'No work if wind > 35 km/h'
    special_precautions     TEXT[],
    -- AI Metadata
    gemini_model            TEXT NOT NULL DEFAULT 'gemini-1.5-flash',
    gemini_prompt_tokens    INTEGER,
    gemini_response_tokens  INTEGER,
    raw_gemini_response     JSONB,                             -- Full Gemini response for audit
    confidence_score        NUMERIC(4,3),
    assessed_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    assessed_by_profile_id  UUID REFERENCES public.profiles(id),
    is_acknowledged         BOOLEAN NOT NULL DEFAULT FALSE,    -- Client acknowledged the risks
    acknowledged_at         TIMESTAMPTZ,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.ai_risk_assessments IS
    'Stores Gemini AI risk analysis results for each job request. One request can have multiple assessments (revisions).';

-- -----------------------------------------------------------------------------
-- 5.3 crew_assignments — links technicians to job requests
-- -----------------------------------------------------------------------------
CREATE TABLE public.crew_assignments (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_request_id      UUID NOT NULL REFERENCES public.job_requests(id) ON DELETE CASCADE,
    technician_id       UUID NOT NULL REFERENCES public.technicians(id) ON DELETE RESTRICT,
    assigned_role       public.irata_level NOT NULL,           -- Role on this specific job
    is_lead             BOOLEAN NOT NULL DEFAULT FALSE,        -- Lead technician for the crew
    assigned_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    assigned_by_id      UUID REFERENCES public.profiles(id),
    confirmed_at        TIMESTAMPTZ,                           -- Technician confirmed availability
    started_at          TIMESTAMPTZ,
    completed_at        TIMESTAMPTZ,
    daily_rate_sar      NUMERIC(10,2),                         -- Rate locked at assignment time
    performance_note    TEXT,                                  -- Post-job admin note
    rating              INTEGER CHECK (rating BETWEEN 1 AND 5),
    UNIQUE(job_request_id, technician_id)
);

COMMENT ON TABLE public.crew_assignments IS
    'Junction table between job_requests and technicians. Tracks assignment lifecycle and locks compensation rate.';

-- =============================================================================
-- SECTION 6: COMMUNICATION & NOTIFICATION DOMAIN
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 6.1 notifications — platform notification center
-- -----------------------------------------------------------------------------
CREATE TABLE public.notifications (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type            public.notification_type NOT NULL,
    title           TEXT NOT NULL,
    body            TEXT NOT NULL,
    action_url      TEXT,                               -- Deep link within the app
    metadata        JSONB NOT NULL DEFAULT '{}',        -- Flexible payload
    is_read         BOOLEAN NOT NULL DEFAULT FALSE,
    read_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.notifications IS
    'Platform notification center. Rows are inserted by DB triggers and Supabase Edge Functions.';

-- -----------------------------------------------------------------------------
-- 6.2 ai_chat_sessions — IRATA Safety AI Chatbot sessions
-- -----------------------------------------------------------------------------
CREATE TABLE public.ai_chat_sessions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    session_title   TEXT,                               -- Auto-generated from first message
    context_type    TEXT NOT NULL DEFAULT 'general',    -- 'general' | 'job_specific' | 'cert_query'
    job_request_id  UUID REFERENCES public.job_requests(id) ON DELETE SET NULL,
    message_count   INTEGER NOT NULL DEFAULT 0,
    total_tokens    INTEGER NOT NULL DEFAULT 0,
    is_archived     BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 6.3 ai_chat_messages — individual messages in chatbot sessions
-- -----------------------------------------------------------------------------
CREATE TABLE public.ai_chat_messages (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id      UUID NOT NULL REFERENCES public.ai_chat_sessions(id) ON DELETE CASCADE,
    role            TEXT NOT NULL CHECK (role IN ('user', 'model')),
    content         TEXT NOT NULL,
    tokens_used     INTEGER,
    metadata        JSONB NOT NULL DEFAULT '{}',        -- e.g., { "cited_standard": "IRATA TG20:21" }
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.ai_chat_messages IS
    'Stores Gemini chatbot conversation history. Role is either user or model (Gemini).';

-- =============================================================================
-- SECTION 7: AUDIT & SYSTEM TABLES
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 7.1 audit_log — immutable audit trail for critical operations
-- -----------------------------------------------------------------------------
CREATE TABLE public.audit_log (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id        UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    actor_role      public.user_role,
    action          TEXT NOT NULL,                      -- e.g., 'UPDATE_JOB_STATUS'
    entity_type     TEXT NOT NULL,                      -- e.g., 'job_requests'
    entity_id       UUID,
    old_data        JSONB,                              -- Before state
    new_data        JSONB,                              -- After state
    ip_address      INET,
    user_agent      TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.audit_log IS
    'Immutable audit trail. Never UPDATE or DELETE rows. Insert-only by convention.';

-- =============================================================================
-- SECTION 8: INDEXES
-- =============================================================================

-- profiles indexes
CREATE INDEX idx_profiles_role           ON public.profiles(role);
CREATE INDEX idx_profiles_email          ON public.profiles(email);
CREATE INDEX idx_profiles_is_active      ON public.profiles(is_active);

-- organizations indexes
CREATE INDEX idx_organizations_is_active ON public.organizations(is_active);
CREATE INDEX idx_organizations_tier      ON public.organizations(tier);
CREATE INDEX idx_organizations_name_trgm ON public.organizations USING gin(name gin_trgm_ops);

-- organization_members indexes
CREATE INDEX idx_org_members_org_id      ON public.organization_members(organization_id);
CREATE INDEX idx_org_members_profile_id  ON public.organization_members(profile_id);

-- technicians indexes
CREATE INDEX idx_technicians_profile_id  ON public.technicians(profile_id);
CREATE INDEX idx_technicians_irata_level ON public.technicians(irata_level);
CREATE INDEX idx_technicians_status      ON public.technicians(status);
CREATE INDEX idx_technicians_rating      ON public.technicians(performance_rating DESC);
CREATE INDEX idx_technicians_specs       ON public.technicians USING gin(specializations);

-- certifications indexes
CREATE INDEX idx_certs_technician_id     ON public.certifications(technician_id);
CREATE INDEX idx_certs_cert_type         ON public.certifications(cert_type);
CREATE INDEX idx_certs_expiry_date       ON public.certifications(expiry_date);
CREATE INDEX idx_certs_is_active         ON public.certifications(is_active);
-- Partial index: find near-expiry active certs efficiently
CREATE INDEX idx_certs_expiring_soon     ON public.certifications(expiry_date)
    WHERE is_active = TRUE AND is_lifetime = FALSE AND expiry_date IS NOT NULL;

-- job_requests indexes
CREATE INDEX idx_jobs_org_id             ON public.job_requests(organization_id);
CREATE INDEX idx_jobs_requested_by       ON public.job_requests(requested_by_id);
CREATE INDEX idx_jobs_status             ON public.job_requests(status);
CREATE INDEX idx_jobs_start_date         ON public.job_requests(start_date);
CREATE INDEX idx_jobs_priority           ON public.job_requests(priority);
CREATE INDEX idx_jobs_created_at         ON public.job_requests(created_at DESC);

-- logbook_entries indexes
CREATE INDEX idx_logbook_technician_id   ON public.logbook_entries(technician_id);
CREATE INDEX idx_logbook_job_request_id  ON public.logbook_entries(job_request_id);
CREATE INDEX idx_logbook_work_date       ON public.logbook_entries(work_date DESC);
CREATE INDEX idx_logbook_verify_status   ON public.logbook_entries(verification_status);
CREATE INDEX idx_logbook_qr_token        ON public.logbook_entries(qr_token) WHERE qr_token IS NOT NULL;

-- ai_risk_assessments indexes
CREATE INDEX idx_ai_risk_job_id          ON public.ai_risk_assessments(job_request_id);
CREATE INDEX idx_ai_risk_level           ON public.ai_risk_assessments(overall_risk_level);

-- crew_assignments indexes
CREATE INDEX idx_crew_job_id             ON public.crew_assignments(job_request_id);
CREATE INDEX idx_crew_technician_id      ON public.crew_assignments(technician_id);

-- notifications indexes
CREATE INDEX idx_notif_recipient_id      ON public.notifications(recipient_id);
CREATE INDEX idx_notif_is_read           ON public.notifications(is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notif_created_at        ON public.notifications(created_at DESC);

-- ai_chat indexes
CREATE INDEX idx_chat_sessions_profile   ON public.ai_chat_sessions(profile_id);
CREATE INDEX idx_chat_msgs_session_id    ON public.ai_chat_messages(session_id);
CREATE INDEX idx_chat_msgs_created_at    ON public.ai_chat_messages(created_at ASC);

-- audit log indexes
CREATE INDEX idx_audit_actor_id          ON public.audit_log(actor_id);
CREATE INDEX idx_audit_entity            ON public.audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_created_at        ON public.audit_log(created_at DESC);

-- =============================================================================
-- SECTION 9: HELPER FUNCTIONS & TRIGGERS
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 9.1 updated_at auto-update trigger function
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Apply updated_at triggers to all relevant tables
CREATE TRIGGER set_updated_at_profiles
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_organizations
    BEFORE UPDATE ON public.organizations
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_technicians
    BEFORE UPDATE ON public.technicians
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_certifications
    BEFORE UPDATE ON public.certifications
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_logbook
    BEFORE UPDATE ON public.logbook_entries
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_job_requests
    BEFORE UPDATE ON public.job_requests
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_ai_chat_sessions
    BEFORE UPDATE ON public.ai_chat_sessions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- -----------------------------------------------------------------------------
-- 9.2 Auto-create profile on Supabase Auth sign-up
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', split_part(NEW.email, '@', 1)),
        COALESCE((NEW.raw_user_meta_data ->> 'role')::public.user_role, 'client')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- -----------------------------------------------------------------------------
-- 9.3 Generate human-readable job request numbers
-- -----------------------------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS public.job_request_seq START 1;

CREATE OR REPLACE FUNCTION public.generate_job_request_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.request_number := 'PR-' || TO_CHAR(NOW(), 'YYYY') || '-' ||
                          LPAD(nextval('public.job_request_seq')::TEXT, 4, '0');
    RETURN NEW;
END;
$$;

CREATE TRIGGER set_job_request_number
    BEFORE INSERT ON public.job_requests
    FOR EACH ROW
    WHEN (NEW.request_number IS NULL)
    EXECUTE FUNCTION public.generate_job_request_number();

-- -----------------------------------------------------------------------------
-- 9.4 Auto-update technician total rope hours when logbook entry is verified
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.sync_technician_rope_hours()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Recalculate total from verified entries
    UPDATE public.technicians
    SET total_rope_hours = (
        SELECT COALESCE(SUM(rope_hours), 0)
        FROM public.logbook_entries
        WHERE technician_id = NEW.technician_id
          AND verification_status = 'verified'
    ),
    updated_at = NOW()
    WHERE id = NEW.technician_id;

    RETURN NEW;
END;
$$;

CREATE TRIGGER sync_rope_hours_on_logbook_change
    AFTER INSERT OR UPDATE OF verification_status ON public.logbook_entries
    FOR EACH ROW
    WHEN (NEW.verification_status = 'verified')
    EXECUTE FUNCTION public.sync_technician_rope_hours();

-- -----------------------------------------------------------------------------
-- 9.5 Generate QR verification token for logbook entries
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.generate_logbook_qr_token()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.qr_token IS NULL THEN
        NEW.qr_token := encode(gen_random_bytes(32), 'hex');
        NEW.qr_token_expires_at := NOW() + INTERVAL '72 hours';
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER set_logbook_qr_token
    BEFORE INSERT ON public.logbook_entries
    FOR EACH ROW EXECUTE FUNCTION public.generate_logbook_qr_token();

-- -----------------------------------------------------------------------------
-- 9.6 Audit log trigger for job_requests status changes
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.audit_job_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO public.audit_log (actor_id, action, entity_type, entity_id, old_data, new_data)
        VALUES (
            auth.uid(),
            'JOB_STATUS_CHANGE',
            'job_requests',
            NEW.id,
            jsonb_build_object('status', OLD.status),
            jsonb_build_object('status', NEW.status)
        );
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER audit_job_requests_status
    AFTER UPDATE ON public.job_requests
    FOR EACH ROW EXECUTE FUNCTION public.audit_job_status_change();

-- -----------------------------------------------------------------------------
-- 9.7 Send notification when job status changes
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.notify_on_job_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_title TEXT;
    v_body  TEXT;
BEGIN
    IF OLD.status IS NOT DISTINCT FROM NEW.status THEN
        RETURN NEW;
    END IF;

    CASE NEW.status
        WHEN 'quoted' THEN
            v_title := 'Quote Ready';
            v_body  := 'Your job request "' || NEW.project_name || '" has been quoted. Review now.';
        WHEN 'crew_assigned' THEN
            v_title := 'Crew Assigned';
            v_body  := 'A qualified crew has been assigned to "' || NEW.project_name || '".';
        WHEN 'in_progress' THEN
            v_title := 'Work Started';
            v_body  := 'Your project "' || NEW.project_name || '" is now underway.';
        WHEN 'completed' THEN
            v_title := 'Job Completed';
            v_body  := 'Project "' || NEW.project_name || '" has been completed. Please leave a rating.';
        WHEN 'cancelled' THEN
            v_title := 'Job Cancelled';
            v_body  := 'Job request "' || NEW.project_name || '" has been cancelled.';
        ELSE
            v_title := 'Job Updated';
            v_body  := 'Your job request "' || NEW.project_name || '" status changed to: ' || NEW.status;
    END CASE;

    INSERT INTO public.notifications (recipient_id, type, title, body, action_url, metadata)
    VALUES (
        NEW.requested_by_id,
        'job_status_update',
        v_title,
        v_body,
        '/portal/client/jobs/' || NEW.id,
        jsonb_build_object('job_id', NEW.id, 'old_status', OLD.status, 'new_status', NEW.status)
    );

    RETURN NEW;
END;
$$;

CREATE TRIGGER notify_job_status_change
    AFTER UPDATE ON public.job_requests
    FOR EACH ROW EXECUTE FUNCTION public.notify_on_job_status_change();

-- =============================================================================
-- SECTION 10: ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on all public tables
ALTER TABLE public.profiles              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technicians           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logbook_entries       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_requests          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_risk_assessments   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crew_assignments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_sessions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_messages      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log             ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- Helper functions for RLS
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS public.user_role
LANGUAGE sql STABLE SECURITY DEFINER AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
          AND role IN ('admin', 'super_admin')
    );
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
          AND role = 'super_admin'
    );
$$;

CREATE OR REPLACE FUNCTION public.current_technician_id()
RETURNS UUID
LANGUAGE sql STABLE SECURITY DEFINER AS $$
    SELECT id FROM public.technicians WHERE profile_id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.current_user_org_ids()
RETURNS UUID[]
LANGUAGE sql STABLE SECURITY DEFINER AS $$
    SELECT ARRAY_AGG(organization_id)
    FROM public.organization_members
    WHERE profile_id = auth.uid();
$$;

-- =============================================================================
-- RLS POLICIES
-- =============================================================================

-- ==================== profiles ====================
CREATE POLICY "profiles_select_own"
    ON public.profiles FOR SELECT
    USING (id = auth.uid() OR public.is_admin());

CREATE POLICY "profiles_insert_auth_trigger"
    ON public.profiles FOR INSERT
    WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_update_own"
    ON public.profiles FOR UPDATE
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_update_admin"
    ON public.profiles FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "profiles_delete_super_admin"
    ON public.profiles FOR DELETE
    USING (public.is_super_admin());

-- ==================== organizations ====================
CREATE POLICY "organizations_select"
    ON public.organizations FOR SELECT
    USING (
        public.is_admin()
        OR id = ANY(public.current_user_org_ids())
    );

CREATE POLICY "organizations_insert_admin"
    ON public.organizations FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "organizations_update_admin"
    ON public.organizations FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "organizations_delete_super_admin"
    ON public.organizations FOR DELETE
    USING (public.is_super_admin());

-- ==================== organization_members ====================
CREATE POLICY "org_members_select"
    ON public.organization_members FOR SELECT
    USING (
        public.is_admin()
        OR profile_id = auth.uid()
        OR organization_id = ANY(public.current_user_org_ids())
    );

CREATE POLICY "org_members_insert_admin"
    ON public.organization_members FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "org_members_update_admin"
    ON public.organization_members FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "org_members_delete_admin"
    ON public.organization_members FOR DELETE
    USING (public.is_admin());

-- ==================== technicians ====================
CREATE POLICY "technicians_select"
    ON public.technicians FOR SELECT
    USING (
        public.is_admin()
        OR profile_id = auth.uid()
        OR (
            public.current_user_role() = 'client'
            AND status = 'available'
        )
    );

CREATE POLICY "technicians_insert"
    ON public.technicians FOR INSERT
    WITH CHECK (public.is_admin() OR profile_id = auth.uid());

CREATE POLICY "technicians_update"
    ON public.technicians FOR UPDATE
    USING (profile_id = auth.uid() OR public.is_admin());

CREATE POLICY "technicians_delete_super_admin"
    ON public.technicians FOR DELETE
    USING (public.is_super_admin());

-- ==================== certifications ====================
CREATE POLICY "certifications_select"
    ON public.certifications FOR SELECT
    USING (
        public.is_admin()
        OR technician_id = public.current_technician_id()
    );

CREATE POLICY "certifications_insert"
    ON public.certifications FOR INSERT
    WITH CHECK (
        public.is_admin()
        OR technician_id = public.current_technician_id()
    );

CREATE POLICY "certifications_update"
    ON public.certifications FOR UPDATE
    USING (
        public.is_admin()
        OR technician_id = public.current_technician_id()
    );

CREATE POLICY "certifications_delete_admin"
    ON public.certifications FOR DELETE
    USING (public.is_admin());

-- ==================== logbook_entries ====================
CREATE POLICY "logbook_select"
    ON public.logbook_entries FOR SELECT
    USING (
        public.is_admin()
        OR technician_id = public.current_technician_id()
        OR supervisor_id = public.current_technician_id()
    );

CREATE POLICY "logbook_insert"
    ON public.logbook_entries FOR INSERT
    WITH CHECK (
        technician_id = public.current_technician_id()
        OR public.is_admin()
    );

CREATE POLICY "logbook_update"
    ON public.logbook_entries FOR UPDATE
    USING (
        public.is_admin()
        OR technician_id = public.current_technician_id()
        OR supervisor_id = public.current_technician_id()
    );

CREATE POLICY "logbook_delete"
    ON public.logbook_entries FOR DELETE
    USING (
        (technician_id = public.current_technician_id() AND verification_status = 'pending')
        OR public.is_admin()
    );

-- ==================== job_requests ====================
CREATE POLICY "jobs_select"
    ON public.job_requests FOR SELECT
    USING (
        public.is_admin()
        OR requested_by_id = auth.uid()
        OR organization_id = ANY(public.current_user_org_ids())
        OR EXISTS (
            SELECT 1 FROM public.crew_assignments ca
            WHERE ca.job_request_id = id
              AND ca.technician_id = public.current_technician_id()
        )
    );

CREATE POLICY "jobs_insert_client"
    ON public.job_requests FOR INSERT
    WITH CHECK (
        requested_by_id = auth.uid()
        AND organization_id = ANY(public.current_user_org_ids())
    );

CREATE POLICY "jobs_update"
    ON public.job_requests FOR UPDATE
    USING (
        public.is_admin()
        OR (requested_by_id = auth.uid() AND status IN ('draft', 'submitted'))
    );

CREATE POLICY "jobs_delete_super_admin"
    ON public.job_requests FOR DELETE
    USING (public.is_super_admin());

-- ==================== ai_risk_assessments ====================
CREATE POLICY "ai_risk_select"
    ON public.ai_risk_assessments FOR SELECT
    USING (
        public.is_admin()
        OR EXISTS (
            SELECT 1 FROM public.job_requests jr
            WHERE jr.id = job_request_id
              AND (jr.requested_by_id = auth.uid()
                   OR jr.organization_id = ANY(public.current_user_org_ids()))
        )
    );

CREATE POLICY "ai_risk_insert"
    ON public.ai_risk_assessments FOR INSERT
    WITH CHECK (public.is_admin() OR assessed_by_profile_id = auth.uid());

CREATE POLICY "ai_risk_update_admin"
    ON public.ai_risk_assessments FOR UPDATE
    USING (public.is_admin());

-- ==================== crew_assignments ====================
CREATE POLICY "crew_select"
    ON public.crew_assignments FOR SELECT
    USING (
        public.is_admin()
        OR technician_id = public.current_technician_id()
        OR EXISTS (
            SELECT 1 FROM public.job_requests jr
            WHERE jr.id = job_request_id
              AND jr.organization_id = ANY(public.current_user_org_ids())
        )
    );

CREATE POLICY "crew_insert_admin"
    ON public.crew_assignments FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "crew_update"
    ON public.crew_assignments FOR UPDATE
    USING (
        public.is_admin()
        OR technician_id = public.current_technician_id()
    );

CREATE POLICY "crew_delete_admin"
    ON public.crew_assignments FOR DELETE
    USING (public.is_admin());

-- ==================== notifications ====================
CREATE POLICY "notifications_select_own"
    ON public.notifications FOR SELECT
    USING (recipient_id = auth.uid());

CREATE POLICY "notifications_insert_system"
    ON public.notifications FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "notifications_update_own"
    ON public.notifications FOR UPDATE
    USING (recipient_id = auth.uid())
    WITH CHECK (recipient_id = auth.uid());

CREATE POLICY "notifications_delete_own"
    ON public.notifications FOR DELETE
    USING (recipient_id = auth.uid());

-- ==================== ai_chat_sessions ====================
CREATE POLICY "chat_sessions_select"
    ON public.ai_chat_sessions FOR SELECT
    USING (profile_id = auth.uid() OR public.is_admin());

CREATE POLICY "chat_sessions_insert"
    ON public.ai_chat_sessions FOR INSERT
    WITH CHECK (profile_id = auth.uid());

CREATE POLICY "chat_sessions_update"
    ON public.ai_chat_sessions FOR UPDATE
    USING (profile_id = auth.uid());

CREATE POLICY "chat_sessions_delete"
    ON public.ai_chat_sessions FOR DELETE
    USING (profile_id = auth.uid() OR public.is_admin());

-- ==================== ai_chat_messages ====================
CREATE POLICY "chat_messages_select"
    ON public.ai_chat_messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.ai_chat_sessions s
            WHERE s.id = session_id
              AND (s.profile_id = auth.uid() OR public.is_admin())
        )
    );

CREATE POLICY "chat_messages_insert"
    ON public.ai_chat_messages FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.ai_chat_sessions s
            WHERE s.id = session_id
              AND s.profile_id = auth.uid()
        )
    );

-- ==================== audit_log ====================
CREATE POLICY "audit_log_select_super_admin"
    ON public.audit_log FOR SELECT
    USING (public.is_super_admin());

CREATE POLICY "audit_log_insert_system"
    ON public.audit_log FOR INSERT
    WITH CHECK (TRUE);

-- =============================================================================
-- SECTION 11: ANALYTICAL VIEWS
-- =============================================================================

-- Technician dashboard view with cert expiry dates
-- security_invoker = true: view runs as the calling user, RLS is enforced
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

-- Compliance tracker: certs expiring within 90 days
-- security_invoker = true: view runs as the calling user, RLS is enforced
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

-- Job pipeline view for admin dispatch board
-- security_invoker = true: view runs as the calling user, RLS is enforced
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
-- SECTION 12: STORAGE BUCKET SETUP
-- Run in Supabase SQL Editor or via the Supabase Dashboard > Storage
-- =============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
    ('certificates', 'certificates', FALSE, 10485760,
     ARRAY['application/pdf','image/jpeg','image/jpg','image/png','image/webp','image/heic']),
    ('avatars', 'avatars', TRUE, 2097152,
     ARRAY['image/jpeg','image/jpg','image/png','image/webp']),
    ('org-assets', 'org-assets', TRUE, 5242880,
     ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/svg+xml'])
ON CONFLICT (id) DO NOTHING;

-- certificates bucket: private, folder-scoped per technician
CREATE POLICY "cert_storage_select"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'certificates'
        AND (
            public.is_admin()
            OR (auth.uid() IS NOT NULL
                AND (storage.foldername(name))[1] = (
                    SELECT id::TEXT FROM public.technicians
                    WHERE profile_id = auth.uid() LIMIT 1
                ))
        )
    );

CREATE POLICY "cert_storage_insert"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'certificates'
        AND auth.uid() IS NOT NULL
        AND (
            public.is_admin()
            OR (storage.foldername(name))[1] = (
                SELECT id::TEXT FROM public.technicians
                WHERE profile_id = auth.uid() LIMIT 1
            )
        )
    );

CREATE POLICY "cert_storage_update"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'certificates'
        AND (
            public.is_admin()
            OR (storage.foldername(name))[1] = (
                SELECT id::TEXT FROM public.technicians
                WHERE profile_id = auth.uid() LIMIT 1
            )
        )
    );

CREATE POLICY "cert_storage_delete"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'certificates'
        AND (
            public.is_admin()
            OR (storage.foldername(name))[1] = (
                SELECT id::TEXT FROM public.technicians
                WHERE profile_id = auth.uid() LIMIT 1
            )
        )
    );

-- avatars bucket: public read, user-scoped writes
CREATE POLICY "avatars_storage_select"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'avatars');

CREATE POLICY "avatars_storage_insert"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'avatars'
        AND auth.uid() IS NOT NULL
        AND (storage.foldername(name))[1] = auth.uid()::TEXT
    );

CREATE POLICY "avatars_storage_update"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'avatars'
        AND (storage.foldername(name))[1] = auth.uid()::TEXT
    );

CREATE POLICY "avatars_storage_delete"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'avatars'
        AND (storage.foldername(name))[1] = auth.uid()::TEXT
    );

-- org-assets bucket: public read, org-admin-scoped writes
CREATE POLICY "org_assets_select"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'org-assets');

CREATE POLICY "org_assets_insert"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'org-assets'
        AND (
            public.is_admin()
            OR (auth.uid() IS NOT NULL
                AND (storage.foldername(name))[1] = ANY(
                    SELECT organization_id::TEXT
                    FROM public.organization_members
                    WHERE profile_id = auth.uid()
                      AND sub_role IN ('owner', 'admin')
                ))
        )
    );

CREATE POLICY "org_assets_update_admin"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'org-assets' AND public.is_admin());

CREATE POLICY "org_assets_delete_admin"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'org-assets' AND public.is_admin());

-- =============================================================================
-- SECTION 13: SEED DATA (Development / Demo Only)
-- Comment out before production deployment
-- =============================================================================

INSERT INTO public.organizations (
    id, name, name_ar, industry_sector,
    commercial_reg_no, contact_email, city, country,
    is_verified, is_active, tier
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'PetroProf Rope Access Center',
    'مركز بيتروبروف للوصول الحبلي',
    'Rope Access Services',
    'SA-1234567890',
    'admin@petroprof.sa',
    'Riyadh',
    'Saudi Arabia',
    TRUE, TRUE, 'enterprise'
) ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- END OF SCHEMA — PetroProf Portal v1.0.0
-- =============================================================================
