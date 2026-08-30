import { NextResponse, type NextRequest } from 'next/server'
import { adminDeleteUserData } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const idFromParams = context?.params?.id
    const urlParts = request.nextUrl.pathname.split('/')
    const userIdToDelete = idFromParams || urlParts[urlParts.length - 1]

    if (!userIdToDelete || userIdToDelete === 'users') {
      return NextResponse.json(
        { error: 'Invalid or missing User ID parameter.' },
        { status: 400 }
      )
    }

    // Perform complete cascading delete using Service Role
    await adminDeleteUserData(userIdToDelete)

    return NextResponse.json({
      success: true,
      deletedId: userIdToDelete,
      message: 'Account and associated records successfully removed.',
    })
  } catch (err: any) {
    console.error('[Admin Delete User Exception]', err)
    return NextResponse.json(
      { error: err.message || 'Internal server error while removing account' },
      { status: 500 }
    )
  }
}
