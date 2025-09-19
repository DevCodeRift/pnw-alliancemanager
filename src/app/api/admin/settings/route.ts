import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getAdminSettings, updateAdminSetting } from '@/lib/db'

// GET - Get all admin settings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const settings = await getAdminSettings()

    return NextResponse.json({
      success: true,
      data: settings,
    })
  } catch (error) {
    console.error('Error fetching admin settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admin settings' },
      { status: 500 }
    )
  }
}

// PUT - Update an admin setting
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { settingKey, settingValue } = await request.json()

    if (!settingKey) {
      return NextResponse.json(
        { error: 'Setting key is required' },
        { status: 400 }
      )
    }

    const success = await updateAdminSetting(settingKey, settingValue, session.user.id)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update setting' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Setting updated successfully',
    })
  } catch (error) {
    console.error('Error updating admin setting:', error)
    return NextResponse.json(
      { error: 'Failed to update setting' },
      { status: 500 }
    )
  }
}