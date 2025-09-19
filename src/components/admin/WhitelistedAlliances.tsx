'use client'

import { useState, useEffect } from 'react'
import { WhitelistedAlliance } from '@/types'

interface WhitelistedAlliancesProps {
  onRefresh: () => void
}

export default function WhitelistedAlliances({ onRefresh }: WhitelistedAlliancesProps) {
  const [alliances, setAlliances] = useState<WhitelistedAlliance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAlliances = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/alliances')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch alliances')
      }

      setAlliances(data.data || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAlliances()
  }, [])

  useEffect(() => {
    fetchAlliances()
  }, [onRefresh])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getSubdomainUrl = (slug: string) => {
    const domain = process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_APP_DOMAIN
      : 'localhost:3000'

    return process.env.NODE_ENV === 'production'
      ? `https://${slug}.${domain}`
      : `http://${slug}.${domain}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">Loading whitelisted alliances...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
        {error}
        <button
          onClick={fetchAlliances}
          className="ml-4 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Whitelisted Alliances ({alliances.length})
        </h3>
        <button
          onClick={fetchAlliances}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Refresh
        </button>
      </div>

      {alliances.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No alliances have been whitelisted yet.
        </div>
      ) : (
        <div className="space-y-3">
          {alliances.map((alliance) => (
            <div
              key={alliance.id}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium text-gray-900">
                      {alliance.alliance_name}
                      {alliance.alliance_acronym && (
                        <span className="ml-2 text-sm text-gray-500">
                          [{alliance.alliance_acronym}]
                        </span>
                      )}
                    </h4>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        alliance.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {alliance.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Alliance ID:</span> {alliance.alliance_id}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Slug:</span> {alliance.slug}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Subdomain:</span>{' '}
                      <a
                        href={getSubdomainUrl(alliance.slug)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        {alliance.slug}.{process.env.NODE_ENV === 'production'
                          ? process.env.NEXT_PUBLIC_APP_DOMAIN
                          : 'localhost:3000'}
                      </a>
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Added:</span> {formatDate(alliance.created_at)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {alliance.is_active && (
                    <button
                      className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
                      onClick={() => {
                        // TODO: Implement deactivate functionality
                        console.log('Deactivate alliance:', alliance.id)
                      }}
                    >
                      Deactivate
                    </button>
                  )}
                  <button
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    onClick={() => {
                      // TODO: Implement remove functionality
                      console.log('Remove alliance:', alliance.id)
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}