'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PNWAlliance } from '@/types'
import AllianceSearch from '@/components/admin/AllianceSearch'
import WhitelistedAlliances from '@/components/admin/WhitelistedAlliances'
import AdminSettings from '@/components/admin/AdminSettings'

export default function AdminPanel() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedAlliance, setSelectedAlliance] = useState<PNWAlliance | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Redirect if not admin
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  if (!session.user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">You need administrator privileges to access this page.</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  const handleSelectAlliance = (alliance: PNWAlliance) => {
    setSelectedAlliance(alliance)
    setMessage(null)
  }

  const handleAddAlliance = async () => {
    if (!selectedAlliance) return

    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/admin/alliances', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          allianceId: selectedAlliance.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add alliance')
      }

      setMessage({
        type: 'success',
        text: data.message || 'Alliance successfully added to whitelist',
      })
      setSelectedAlliance(null)
      setRefreshTrigger(prev => prev + 1)
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'An error occurred',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Back to Home
            </button>
          </div>
          <p className="text-gray-600">
            Manage whitelisted alliances and system settings for the PNW Alliance Manager.
          </p>
        </div>

        {/* Messages */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-100 border border-green-300 text-green-700'
                : 'bg-red-100 border border-red-300 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="space-y-8">
          {/* Admin Settings */}
          <AdminSettings />

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Add New Alliance */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Add Alliance to Whitelist</h2>

              <AllianceSearch onSelectAlliance={handleSelectAlliance} />

              {selectedAlliance && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Selected Alliance:</h3>
                  <div className="space-y-1 text-sm">
                    <p><strong>Name:</strong> {selectedAlliance.name}</p>
                    {selectedAlliance.acronym && (
                      <p><strong>Acronym:</strong> {selectedAlliance.acronym}</p>
                    )}
                    <p><strong>ID:</strong> {selectedAlliance.id}</p>
                    <p><strong>Rank:</strong> #{selectedAlliance.rank}</p>
                    <p><strong>Score:</strong> {selectedAlliance.score?.toLocaleString()}</p>
                    {selectedAlliance.color && (
                      <p><strong>Color:</strong> {selectedAlliance.color}</p>
                    )}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={handleAddAlliance}
                      disabled={loading}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Adding...' : 'Add to Whitelist'}
                    </button>
                    <button
                      onClick={() => setSelectedAlliance(null)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Current Whitelisted Alliances */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <WhitelistedAlliances onRefresh={refreshTrigger} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}