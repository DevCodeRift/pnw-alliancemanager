'use client'

import { useState, useEffect, useRef } from 'react'
import { PNWAlliance } from '@/types'

interface AllianceSearchProps {
  onSelectAlliance: (alliance: PNWAlliance) => void
}

export default function AllianceSearch({ onSelectAlliance }: AllianceSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<PNWAlliance[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isMountedRef = useRef(true)

  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const handleSearch = async () => {
    if (!searchQuery.trim() || !isMountedRef.current) return

    setLoading(true)
    setError(null)

    try {
      const isNumeric = /^\d+$/.test(searchQuery.trim())
      const url = isNumeric
        ? `/api/admin/search-alliances?id=${searchQuery.trim()}`
        : `/api/admin/search-alliances?q=${encodeURIComponent(searchQuery.trim())}`

      const response = await fetch(url)
      const data = await response.json()

      if (!isMountedRef.current) return

      if (!response.ok) {
        throw new Error(data.error || 'Failed to search alliances')
      }

      setSearchResults(data.data || [])
    } catch (err) {
      if (!isMountedRef.current) return
      setError(err instanceof Error ? err.message : 'An error occurred')
      setSearchResults([])
    } finally {
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search by alliance name or ID..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          disabled={loading || !searchQuery.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900">Search Results:</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {searchResults.map((alliance) => (
              <div
                key={alliance.id}
                className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => onSelectAlliance(alliance)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {alliance.name}
                      {alliance.acronym && (
                        <span className="ml-2 text-sm text-gray-500">[{alliance.acronym}]</span>
                      )}
                    </h4>
                    <p className="text-sm text-gray-600">
                      ID: {alliance.id} • Rank: #{alliance.rank} • Score: {alliance.score?.toLocaleString()}
                    </p>
                    {alliance.color && (
                      <span className={`inline-block px-2 py-1 rounded text-xs text-white mt-1 bg-${alliance.color}-500`}>
                        {alliance.color}
                      </span>
                    )}
                  </div>
                  <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                    Select
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {searchResults.length === 0 && searchQuery && !loading && !error && (
        <div className="p-4 bg-yellow-100 border border-yellow-300 text-yellow-700 rounded-lg">
          No alliances found matching your search.
        </div>
      )}
    </div>
  )
}