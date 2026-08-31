import { NextResponse } from 'next/server'
import {
  getAdminClient,
  adminUpsertProfile,
  adminInsertTechnician,
  adminInsertOrganization,
  adminDeleteUserData,
} from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = getAdminClient()
  const results: any[] = []

  const accounts = [
    {
      email: 'admin@example.com',
      password: 'Password123!',
      fullName: 'Super Admin',
      role: 'super_admin',
    },
    {
      email: 'technician@example.com',
      password: 'Password123!',
      fullName: 'Demo Technician',
      role: 'technician',
      irataLevel: 'level_2',
      irataMembershipNo: '2/884920',
      dailyRateSar: 1250,
      yearsExperience: 4,
    },
    {
      email: 'client@example.com',
      password: 'Password123!',
      fullName: 'Demo Client Partner',
      role: 'client',
      organizationName: 'Saudi Aramco Operations',
      industrySector: 'Oil & Gas',
      city: 'Dhahran',
    },
  ]

  for (const acc of accounts) {
    try {
      // 1. Check if user already exists in auth.users
      const { data: listData } = await supabase.auth.admin.listUsers({ perPage: 100 })
      const existing = listData?.users?.find(
        (u) => u.email?.toLowerCase() === acc.email.toLowerCase()
      )

      let userId: string

      if (existing?.id) {
        // Delete existing corrupted SQL entry to recreate cleanly with full GoTrue schema
        await adminDeleteUserData(existing.id)
      }

      // 2. Create fresh auth user via official GoTrue Admin API
      const { data: created, error: createError } = await supabase.auth.admin.createUser({
        email: acc.email,
        password: acc.password,
        email_confirm: true,
        user_metadata: {
          full_name: acc.fullName,
          role: acc.role,
        },
      })

      if (createError || !created?.user?.id) {
        results.push({ email: acc.email, status: 'error', message: createError?.message })
        continue
      }

      userId = created.user.id

      // 3. Upsert Profile
      await adminUpsertProfile({
        id: userId,
        role: acc.role,
        full_name: acc.fullName,
        email: acc.email,
        is_active: true,
        onboarding_complete: true,
      })

      // 4. Role specific tables
      if (acc.role === 'technician') {
        await adminInsertTechnician({
          profile_id: userId,
          employee_id: 'PP-T8888',
          irata_level: acc.irataLevel || 'level_2',
          irata_membership_no: acc.irataMembershipNo || '2/884920',
          status: 'available',
          nationality: 'Saudi Arabia',
          years_experience: acc.yearsExperience || 4,
          specializations: ['NDT Thickness Gauging', 'Heavy Rigging', 'Painting & Blasting'],
          total_rope_hours: 1450,
          fatigue_score: 0.2,
          daily_rate_sar: acc.dailyRateSar || 1250,
          performance_rating: 4.90,
          rating_count: 15,
          is_featured: true,
        })
      }

      if (acc.role === 'client' && acc.organizationName) {
        await adminInsertOrganization({
          name: acc.organizationName,
          industry_sector: acc.industrySector || 'Oil & Gas',
          city: acc.city || 'Dhahran',
          primary_contact_id: userId,
          is_active: true,
        })
      }

      results.push({ email: acc.email, status: 'success', role: acc.role, id: userId })
    } catch (err: any) {
      results.push({ email: acc.email, status: 'exception', error: err.message })
    }
  }

  return NextResponse.json({
    message: 'Seed demo users processed cleanly via Supabase Auth Admin API.',
    results,
  })
}
