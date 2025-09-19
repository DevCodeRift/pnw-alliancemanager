'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { UserAlliance, WhitelistedAlliance } from '@/types'

interface DashboardData {
  userAlliances: UserAlliance[]
  whitelistedAlliances: WhitelistedAlliance[]
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isMountedRef = useRef(true)

  // Handle redirects in useEffect to avoid rendering during navigation
  useEffect(() => {
    if (status !== 'loading') {
      if (!session) {
        router.push('/auth/signin')
        return
      }
      if (!session.user?.hasApiKey) {
        router.push('/setup')
        return
      }
      // Only fetch data if authenticated and has API key
      fetchDashboardData()
    }
  }, [session, status, fetchDashboardData])

  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  // Show loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  // Show loading while redirecting
  if (!session || !session.user?.hasApiKey) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Redirecting...</div>
      </div>
    )
  }

  const fetchDashboardData = useCallback(async () => {
    try {
      if (!isMountedRef.current) return
      setLoading(true)
      // TODO: Implement API routes for dashboard data
      // For now, we'll use placeholder data

      if (!isMountedRef.current) return

      setDashboardData({
        userAlliances: [],
        whitelistedAlliances: [],
      })
      setError(null)
    } catch (err) {
      if (!isMountedRef.current) return
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Alliance Dashboard</h1>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-gray-600">
                Welcome, {session.user?.name}
              </span>
              {session.user?.isAdmin && (
                <Link
                  href="/admin"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-200"
                >
                  Admin Panel
                </Link>
              )}
              <Link
                href="/"
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition duration-200"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-8">
          {/* User Overview */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Overview</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="text-sm font-medium text-blue-600 mb-1">Account Status</h3>
                <p className="text-lg font-bold text-blue-900">
                  {session.user?.hasApiKey ? 'Active' : 'Setup Required'}
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h3 className="text-sm font-medium text-green-600 mb-1">Nation ID</h3>
                <p className="text-lg font-bold text-green-900">
                  {session.user?.nationId || 'Not linked'}
                </p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h3 className="text-sm font-medium text-purple-600 mb-1">Role</h3>
                <p className="text-lg font-bold text-purple-900">
                  {session.user?.isAdmin ? 'Administrator' : 'Member'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                href="/setup"
                className="flex items-center gap-3 p-4 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-lg transition duration-200"
              >
                <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Account Settings</h3>
                  <p className="text-sm text-gray-600">Manage API key and preferences</p>
                </div>
              </Link>

              <button
                className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition duration-200"
                disabled
              >
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Member Management</h3>
                  <p className="text-sm text-gray-600">View and manage alliance members</p>
                </div>
              </button>

              <button
                className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition duration-200"
                disabled
              >
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Alliance Stats</h3>
                  <p className="text-sm text-gray-600">View alliance statistics and metrics</p>
                </div>
              </button>

              <button
                className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition duration-200"
                disabled
              >
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Tools</h3>
                  <p className="text-sm text-gray-600">Alliance management tools</p>
                </div>
              </button>
            </div>
          </div>

          {/* Alliance Memberships */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Alliances</h2>

            {dashboardData?.userAlliances && dashboardData.userAlliances.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.userAlliances.map((userAlliance) => (
                  <div
                    key={userAlliance.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Alliance ID: {userAlliance.alliance_id}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Role: {userAlliance.role}
                        </p>
                      </div>
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200">
                        Manage
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Alliance Memberships</h3>
                <p className="text-gray-600 mb-4">
                  You're not currently a member of any whitelisted alliances.
                </p>
                <p className="text-sm text-gray-500">
                  If you're in an alliance that should have access, contact an administrator.
                </p>
              </div>
            )}
          </div>

          {/* Help and Support */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Help & Support</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-medium text-blue-900 mb-2">Getting Started</h3>
                <p className="text-blue-700 text-sm mb-3">
                  New to the alliance manager? Learn how to get the most out of the platform.
                </p>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View Guide →
                </button>
              </div>

              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h3 className="font-medium text-green-900 mb-2">Contact Support</h3>
                <p className="text-green-700 text-sm mb-3">
                  Need help? Our team is here to assist you with any questions.
                </p>
                <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                  Get Help →
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}