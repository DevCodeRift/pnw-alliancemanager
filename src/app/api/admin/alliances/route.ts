import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getWhitelistedAlliances, addWhitelistedAlliance, getAllianceById as getDbAllianceById } from '@/lib/db'
import { getAllianceById as getPnwAllianceById, createSlugFromName } from '@/lib/pnw-api'
import { getAdminSetting } from '@/lib/db'

// GET - Get all whitelisted alliances
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const alliances = await getWhitelistedAlliances()
    return NextResponse.json({ success: true, data: alliances })
  } catch (error) {
    console.error('Error fetching whitelisted alliances:', error)
    return NextResponse.json(
      { error: 'Failed to fetch alliances' },
      { status: 500 }
    )
  }
}

// POST - Add new alliance to whitelist
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { allianceId } = await request.json()

    if (!allianceId || typeof allianceId !== 'number') {
      return NextResponse.json(
        { error: 'Valid alliance ID is required' },
        { status: 400 }
      )
    }

    // Check if alliance is already whitelisted
    const existingAlliance = await getDbAllianceById(allianceId)
    if (existingAlliance) {
      return NextResponse.json(
        { error: 'Alliance is already whitelisted' },
        { status: 409 }
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

    // Fetch alliance data from PNW API
    const pnwAlliance = await getPnwAllianceById(allianceId, globalApiKey)
    if (!pnwAlliance) {
      return NextResponse.json(
        { error: 'Alliance not found in Politics and War' },
        { status: 404 }
      )
    }

    // Create slug from alliance name
    const slug = createSlugFromName(pnwAlliance.name)

    // Add to whitelist
    const newAlliance = await addWhitelistedAlliance({
      alliance_id: pnwAlliance.id,
      alliance_name: pnwAlliance.name,
      alliance_acronym: pnwAlliance.acronym || undefined,
      slug: slug,
      added_by_user_id: session.user.id,
    })

    if (!newAlliance) {
      return NextResponse.json(
        { error: 'Failed to add alliance to whitelist' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: newAlliance,
      message: 'Alliance successfully added to whitelist',
    })
  } catch (error) {
    console.error('Error adding alliance to whitelist:', error)
    return NextResponse.json(
      { error: 'Failed to add alliance to whitelist' },
      { status: 500 }
    )
  }
}