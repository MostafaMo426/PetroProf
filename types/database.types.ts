/**
 * PetroProf Portal — Supabase Database TypeScript Types
 * Generated from Phase 1 schema. Keep in sync with your Supabase schema.
 *
 * To regenerate automatically:
 *   npx supabase gen types typescript --project-id YOUR_PROJECT_REF > types/database.types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ── ENUM Types ────────────────────────────────────────────────────────────────

export type UserRole = 'super_admin' | 'admin' | 'client' | 'technician'
export type IrataLevel = 'level_1' | 'level_2' | 'level_3'
export type TechnicianStatus =
  | 'available'
  | 'deployed'
  | 'on_leave'
  | 'in_training'
  | 'inactive'
  | 'pending_review'
export type JobStatus =
  | 'draft'
  | 'submitted'
  | 'ai_assessed'
  | 'quoted'
  | 'approved'
  | 'crew_assigned'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'disputed'
export type CertificationType =
  | 'irata_certificate'
  | 'medical_fitness'
  | 'first_aid'
  | 'confined_space'
  | 'h2s_awareness'
  | 'fire_watch'
  | 'rigger_license'
  | 'scaffolding'
  | 'working_at_heights'
  | 'ppe_inspection'
  | 'other'
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'
export type LogbookVerificationStatus = 'pending' | 'verified' | 'rejected' | 'disputed'
export type NotificationType =
  | 'cert_expiry_warning'
  | 'medical_expiry_warning'
  | 'job_status_update'
  | 'crew_assignment'
  | 'quote_ready'
  | 'logbook_verified'
  | 'logbook_rejected'
  | 'system_alert'
  | 'new_message'
export type CurrencyCode = 'SAR' | 'USD' | 'EUR'

// ── Row Types ────────────────────────────────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: UserRole
          full_name: string
          email: string
          phone: string | null
          avatar_url: string | null
          preferred_language: string
          timezone: string
          is_active: boolean
          onboarding_complete: boolean
          last_seen_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role?: UserRole
          full_name: string
          email: string
          phone?: string | null
          avatar_url?: string | null
          preferred_language?: string
          timezone?: string
          is_active?: boolean
          onboarding_complete?: boolean
          last_seen_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      organizations: {
        Row: {
          id: string
          name: string
          name_ar: string | null
          industry_sector: string
          commercial_reg_no: string | null
          vat_number: string | null
          contact_email: string
          contact_phone: string | null
          website_url: string | null
          logo_url: string | null
          address_line1: string | null
          address_line2: string | null
          city: string
          region: string | null
          country: string
          postal_code: string | null
          is_verified: boolean
          is_active: boolean
          tier: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['organizations']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['organizations']['Insert']>
      }
      technicians: {
        Row: {
          id: string
          profile_id: string
          employee_id: string | null
          irata_level: IrataLevel
          irata_membership_no: string | null
          status: TechnicianStatus
          nationality: string | null
          iqama_no: string | null
          iqama_expiry: string | null
          passport_no: string | null
          passport_expiry: string | null
          date_of_birth: string | null
          years_experience: number
          specializations: string[] | null
          total_rope_hours: number
          fatigue_score: number
          last_deployment_date: string | null
          next_available_date: string | null
          daily_rate_sar: number | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          blood_type: string | null
          medical_notes: string | null
          performance_rating: number | null
          rating_count: number
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['technicians']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['technicians']['Insert']>
      }
      certifications: {
        Row: {
          id: string
          technician_id: string
          cert_type: CertificationType
          cert_number: string | null
          issuing_body: string | null
          issue_date: string
          expiry_date: string | null
          is_lifetime: boolean
          document_url: string | null
          thumbnail_url: string | null
          is_verified: boolean
          is_active: boolean
          ai_extracted: boolean
          ai_confidence_score: number | null
          ai_raw_response: Json | null
          ai_extracted_at: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['certifications']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['certifications']['Insert']>
      }
      job_requests: {
        Row: {
          id: string
          request_number: string | null
          organization_id: string
          requested_by_id: string
          project_name: string
          project_description: string
          work_location: string
          work_city: string | null
          work_region: string | null
          latitude: number | null
          longitude: number | null
          start_date: string | null
          end_date: string | null
          estimated_duration_days: number | null
          required_level_1: number
          required_level_2: number
          required_level_3: number
          required_specializations: string[] | null
          required_equipment: string[] | null
          status: JobStatus
          priority: string
          base_quote_sar: number | null
          final_quote_sar: number | null
          quote_breakdown: Json | null
          quote_currency: CurrencyCode
          quote_valid_until: string | null
          quote_sent_at: string | null
          quote_approved_at: string | null
          completed_at: string | null
          client_rating: number | null
          client_feedback: string | null
          admin_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['job_requests']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['job_requests']['Insert']>
      }
      notifications: {
        Row: {
          id: string
          recipient_id: string
          type: NotificationType
          title: string
          body: string
          action_url: string | null
          metadata: Json
          is_read: boolean
          read_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>
      }
      ai_chat_sessions: {
        Row: {
          id: string
          profile_id: string
          session_title: string | null
          context_type: string
          job_request_id: string | null
          message_count: number
          total_tokens: number
          is_archived: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['ai_chat_sessions']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['ai_chat_sessions']['Insert']>
      }
      ai_chat_messages: {
        Row: {
          id: string
          session_id: string
          role: 'user' | 'model'
          content: string
          tokens_used: number | null
          metadata: Json
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['ai_chat_messages']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['ai_chat_messages']['Insert']>
      }
    }
    Views: {
      v_technician_dashboard: {
        Row: {
          technician_id: string
          full_name: string
          email: string
          avatar_url: string | null
          irata_level: IrataLevel
          irata_membership_no: string | null
          status: TechnicianStatus
          total_rope_hours: number
          performance_rating: number | null
          rating_count: number
          daily_rate_sar: number | null
          fatigue_score: number
          specializations: string[] | null
          next_available_date: string | null
          irata_cert_expiry: string | null
          medical_cert_expiry: string | null
          active_assignments: number
          created_at: string
        }
      }
      v_expiring_certifications: {
        Row: {
          cert_id: string
          technician_id: string
          technician_name: string
          technician_email: string
          irata_level: IrataLevel
          technician_status: TechnicianStatus
          cert_type: CertificationType
          cert_number: string | null
          issuing_body: string | null
          expiry_date: string
          is_verified: boolean
          days_until_expiry: number
          expiry_status: 'expired' | 'critical' | 'urgent' | 'warning' | 'ok'
        }
      }
      v_job_pipeline: {
        Row: {
          id: string
          request_number: string | null
          project_name: string
          work_location: string
          status: JobStatus
          priority: string
          start_date: string | null
          end_date: string | null
          final_quote_sar: number | null
          quote_currency: CurrencyCode
          client_org_name: string
          client_logo_url: string | null
          requested_by_name: string
          total_crew_required: number
          crew_assigned_count: number
          ai_risk_level: RiskLevel | null
          created_at: string
          updated_at: string
        }
      }
    }
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean }
      is_super_admin: { Args: Record<string, never>; Returns: boolean }
      current_user_role: { Args: Record<string, never>; Returns: UserRole }
      current_technician_id: { Args: Record<string, never>; Returns: string }
    }
    Enums: {
      user_role: UserRole
      irata_level: IrataLevel
      technician_status: TechnicianStatus
      job_status: JobStatus
      certification_type: CertificationType
      risk_level: RiskLevel
      logbook_verification_status: LogbookVerificationStatus
      notification_type: NotificationType
      currency_code: CurrencyCode
    }
  }
}

// ── Convenience helpers ───────────────────────────────────────────────────────

/** Extracts the Row type for a given table */
export type TableRow<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

/** Extracts the Insert type for a given table */
export type TableInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

/** Extracts the Update type for a given table */
export type TableUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

// Shorthand row types for common use
export type Profile = TableRow<'profiles'>
export type Organization = TableRow<'organizations'>
export type Technician = TableRow<'technicians'>
export type Certification = TableRow<'certifications'>
export type JobRequest = TableRow<'job_requests'>
export type Notification = TableRow<'notifications'>
export type AiChatSession = TableRow<'ai_chat_sessions'>
export type AiChatMessage = TableRow<'ai_chat_messages'>
