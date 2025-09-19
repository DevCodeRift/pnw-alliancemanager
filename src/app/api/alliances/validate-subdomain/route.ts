import { NextRequest, NextResponse } from 'next/server'
import { getAllianceBySlug } from '@/lib/db'

// GET - Validate if a subdomain slug corresponds to a whitelisted alliance
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      )
    }

    const alliance = await getAllianceBySlug(slug)

    if (!alliance) {
      return NextResponse.json(
        { error: 'Alliance not found or not whitelisted' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        id: alliance.id,
        alliance_id: alliance.alliance_id,
        name: alliance.alliance_name,
        acronym: alliance.alliance_acronym,
        slug: alliance.slug,
        is_active: alliance.is_active,
      },
    })
  } catch (error) {
    console.error('Error validating subdomain:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}