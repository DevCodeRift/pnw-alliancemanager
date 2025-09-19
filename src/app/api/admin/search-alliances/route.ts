import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { searchAlliances, getAllianceById } from '@/lib/pnw-api'
import { getAdminSetting } from '@/lib/db'
import { PNWAlliance } from '@/types'

// GET - Search alliances from PNW API
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const allianceId = searchParams.get('id')

    if (!query && !allianceId) {
      return NextResponse.json(
        { error: 'Search query or alliance ID is required' },
        { status: 400 }
      )
    }

    // Get global API key for PNW operations
    const globalApiKey = await getAdminSetting('global_pnw_api_key')

    if (!globalApiKey) {
      return NextResponse.json(
        { error: 'Global PNW API key not configured. Please set it in admin settings.' },
        { status: 400 }
      )
    }

    let alliances: PNWAlliance[] = []

    if (allianceId) {
      // Search by specific alliance ID
      const alliance = await getAllianceById(parseInt(allianceId), globalApiKey)
      if (alliance) {
        alliances = [alliance]
      }
    } else if (query) {
      // Search by name
      alliances = await searchAlliances(query, globalApiKey)
    }

    return NextResponse.json({
      success: true,
      data: alliances,
    })
  } catch (error) {
    console.error('Error searching alliances:', error)
    return NextResponse.json(
      { error: 'Failed to search alliances' },
      { status: 500 }
    )
  }
}