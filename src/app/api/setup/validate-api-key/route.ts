import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { validateApiKey } from '@/lib/pnw-api'
import { updateUserApiKey, addUserToAlliance, getAllianceById } from '@/lib/db'

// POST - Validate and link PNW API key
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { apiKey } = await request.json()

    if (!apiKey || typeof apiKey !== 'string') {
      return NextResponse.json(
        { error: 'Valid API key is required' },
        { status: 400 }
      )
    }

    // Validate the API key with PNW API
    const validation = await validateApiKey(apiKey.trim())

    if (!validation.valid) {
      return NextResponse.json(
        {
          error: 'Invalid API key',
          details: validation.error || 'API key validation failed'
        },
        { status: 400 }
      )
    }

    if (!validation.nation) {
      return NextResponse.json(
        { error: 'Could not retrieve nation data with this API key' },
        { status: 400 }
      )
    }

    const nation = validation.nation

    // Update user with API key and nation ID
    const updateSuccess = await updateUserApiKey(
      session.user.id,
      apiKey.trim(),
      nation.id
    )

    if (!updateSuccess) {
      return NextResponse.json(
        { error: 'Failed to save API key' },
        { status: 500 }
      )
    }

    // If the nation is in an alliance, check if that alliance is whitelisted
    let allianceStatus = null
    if (nation.alliance_id) {
      const whitelistedAlliance = await getAllianceById(nation.alliance_id)

      if (whitelistedAlliance) {
        // Add user to alliance with member role by default
        const allianceAdded = await addUserToAlliance(
          session.user.id,
          nation.alliance_id,
          'member'
        )

        allianceStatus = {
          whitelisted: true,
          alliance: whitelistedAlliance,
          added: allianceAdded,
        }
      } else {
        allianceStatus = {
          whitelisted: false,
          alliance: nation.alliance,
          added: false,
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'API key successfully validated and linked',
      data: {
        nation: {
          id: nation.id,
          name: nation.nation_name,
          leader: nation.leader_name,
          score: nation.score,
          cities: nation.num_cities,
          alliance: nation.alliance,
        },
        alliance: allianceStatus,
      },
    })
  } catch (error) {
    console.error('Error validating API key:', error)
    return NextResponse.json(
      { error: 'Failed to validate API key' },
      { status: 500 }
    )
  }
}