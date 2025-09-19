import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { validateApiKey } from '@/lib/pnw-api'
import { getUserById } from '@/lib/db'

// GET - Debug endpoint to check current user's nation data
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get user's API key from database
    const user = await getUserById(session.user.id)
    if (!user?.pnw_api_key) {
      return NextResponse.json(
        { error: 'No API key found for user' },
        { status: 400 }
      )
    }

    // Validate API key and get nation data
    const validation = await validateApiKey(user.pnw_api_key)

    if (!validation.valid || !validation.nation) {
      return NextResponse.json(
        { error: 'Failed to get nation data', details: validation.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        nation: validation.nation,
        hasAlliance: !!validation.nation.alliance,
        allianceId: validation.nation.alliance_id,
        allianceObject: validation.nation.alliance
      }
    })
  } catch (error) {
    console.error('Debug nation endpoint error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}