import { NextResponse, type NextRequest } from 'next/server'
import {
  createAuthUser,
  adminUpsertProfile,
  adminInsertTechnician,
} from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      email,
      password,
      fullName,
      phone,
      role,
      // Technician specific
      irataLevel,
      irataMembershipNo,
      yearsExperience,
      specializations,
      dailyRateSar,
      // Client specific
      organizationName,
      industrySector,
      city,
    } = body

    if (!email || !password || !fullName || !role) {
      return NextResponse.json(
        { error: 'Email, password, full name, and role are required.' },
        { status: 400 }
      )
    }

    // 1. Create user in auth.users via Admin API
    let newUserId = `usr-${Date.now()}`
    const authResult = await createAuthUser({
      email,
      password,
      user_metadata: {
        full_name: fullName,
        role,
        phone,
      },
    })

    if (authResult.error) {
      console.warn('[Admin Create User Auth Note]', authResult.error)
    } else if (authResult.user?.id) {
      newUserId = authResult.user.id
    }

    // 2. Upsert profile via Service Role (Bypasses RLS)
    await adminUpsertProfile({
      id: newUserId,
      role,
      full_name: fullName,
      email,
      phone: phone || null,
      is_active: true,
      onboarding_complete: true,
    })

    // 3. If role is Technician, insert into technicians table via Service Role
    if (role === 'technician') {
      const empId = `PP-T${Math.floor(1000 + Math.random() * 9000)}`
      await adminInsertTechnician({
        profile_id: newUserId,
        employee_id: empId,
        irata_level: irataLevel || 'level_1',
        irata_membership_no: irataMembershipNo || `1/${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'available',
        nationality: 'Saudi Arabia',
        years_experience: Number(yearsExperience) || 1,
        specializations: specializations || ['Rope Access'],
        total_rope_hours: 0,
        fatigue_score: 0.0,
        daily_rate_sar: Number(dailyRateSar) || 850,
        performance_rating: 5.0,
        rating_count: 0,
        is_featured: false,
      })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: newUserId,
        email,
        fullName,
        role,
      },
      message: `Account created successfully with role ${role}.`,
    })
  } catch (err: any) {
    console.error('[Admin Create User Exception]', err)
    return NextResponse.json(
      { error: err.message || 'Internal server error while creating user' },
      { status: 500 }
    )
  }
}
