'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { WhitelistedAlliance, PNWAlliance } from '@/types'

interface AlliancePageProps {
  alliance: WhitelistedAlliance
  pnwData: PNWAlliance | null
}

export default function AlliancePage({ alliance, pnwData }: AlliancePageProps) {
  const { data: session } = useSession()
  const [isUserInAlliance, setIsUserInAlliance] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    // Check if the current user is a member of this alliance
    if (session?.user && pnwData) {
      // This would typically involve checking user's nation alliance ID
      // For now, we'll use a placeholder check
      // TODO: Implement proper alliance membership check
    }
  }, [session, pnwData])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-white">
                {alliance.alliance_name}
                {alliance.alliance_acronym && (
                  <span className="ml-2 text-lg text-blue-200">[{alliance.alliance_acronym}]</span>
                )}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {session ? (
                <div className="flex items-center gap-4">
                  <span className="text-blue-100">
                    Welcome, {session.user?.name}
                  </span>
                  {isUserInAlliance && (
                    <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full">
                      {userRole || 'Member'}
                    </span>
                  )}
                  <Link
                    href="/auth/signout"
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-200"
                  >
                    Sign Out
                  </Link>
                </div>
              ) : (
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition duration-200"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="space-y-8">
          {/* Alliance Overview */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-6">Alliance Overview</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pnwData && (
                <>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="text-sm font-medium text-blue-200 mb-1">Alliance Rank</h3>
                    <p className="text-2xl font-bold text-white">#{pnwData.rank}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="text-sm font-medium text-blue-200 mb-1">Total Score</h3>
                    <p className="text-2xl font-bold text-white">{pnwData.score?.toLocaleString()}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="text-sm font-medium text-blue-200 mb-1">Members</h3>
                    <p className="text-2xl font-bold text-white">{pnwData.nations?.length || 0}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="text-sm font-medium text-blue-200 mb-1">Average Score</h3>
                    <p className="text-2xl font-bold text-white">
                      {pnwData.score && pnwData.nations?.length
                        ? Math.round(pnwData.score / pnwData.nations.length).toLocaleString()
                        : 'N/A'
                      }
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Navigation Sections */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Member Dashboard */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">Member Dashboard</h3>
              <p className="text-blue-100 mb-6">
                Access member management, nation tracking, and alliance tools.
              </p>
              {session && isUserInAlliance ? (
                <Link
                  href={`/alliance/${alliance.slug}/dashboard`}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 block text-center"
                >
                  Access Dashboard
                </Link>
              ) : session ? (
                <div className="w-full bg-gray-600 text-gray-300 font-semibold py-3 px-6 rounded-lg text-center">
                  Members Only
                </div>
              ) : (
                <Link
                  href="/auth/signin"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 block text-center"
                >
                  Login to Access
                </Link>
              )}
            </div>

            {/* Alliance Information */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">Alliance Information</h3>
              <p className="text-blue-100 mb-6">
                View public alliance information, members, and statistics.
              </p>
              <Link
                href={`/alliance/${alliance.slug}/info`}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 block text-center"
              >
                View Info
              </Link>
            </div>

            {/* Recruitment */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">Join Alliance</h3>
              <p className="text-blue-100 mb-6">
                Interested in joining? Learn about our alliance and application process.
              </p>
              <Link
                href={`/alliance/${alliance.slug}/join`}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 block text-center"
              >
                Join Us
              </Link>
            </div>
          </div>

          {/* Recent Activity or News */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-6">Alliance News</h2>
            <div className="text-blue-100">
              <p className="mb-4">
                Welcome to the {alliance.alliance_name} alliance management portal.
              </p>
              <p>
                This is where alliance members can access tools, track progress, and coordinate activities.
                {!session && ' Please login with Discord to access member features.'}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-md border-t border-white/10 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-blue-200">
            <p>&copy; 2024 PNW Alliance Manager. Powered by Politics and War.</p>
            <div className="mt-2">
              <Link
                href="/"
                className="text-blue-300 hover:text-blue-100 transition-colors"
              >
                Main Site
              </Link>
              {' • '}
              <a
                href={`https://politicsandwar.com/alliance/id=${alliance.alliance_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-blue-100 transition-colors"
              >
                View on PNW
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}