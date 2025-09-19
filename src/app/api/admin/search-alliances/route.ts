import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { searchAlliances, getAllianceById } from '@/lib/pnw-api'

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

    let alliances = []

    if (allianceId) {
      // Search by specific alliance ID
      const alliance = await getAllianceById(parseInt(allianceId))
      if (alliance) {
        alliances = [alliance]
      }
    } else if (query) {
      // Search by name
      alliances = await searchAlliances(query)
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