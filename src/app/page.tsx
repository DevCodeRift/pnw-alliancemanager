'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'

export default function Home() {
  const { data: session, status } = useSession()

  const handleSignIn = () => {
    signIn('discord')
  }

  const handleSignOut = () => {
    signOut()
  }

  if (status === 'loading') {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      <div className="container mx-auto px-4 py-16">
        {session && (
          <div className="flex justify-end mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20 flex items-center gap-4">
              <div className="text-white">
                Welcome, {session.user?.name || session.user?.email}
              </div>
              <button
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            PNW Alliance Manager
          </h1>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
            Comprehensive alliance management system for Politics and War.
            Manage your alliance operations, track member activity, and coordinate effectively.
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Login/Dashboard Section */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20">
              <h2 className="text-2xl font-semibold text-white mb-4">
                {session ? 'Member Dashboard' : 'Member Login'}
              </h2>
              <p className="text-blue-100 mb-6">
                {session
                  ? 'Access your alliance management dashboard and tools'
                  : 'Sign in with Discord to access your alliance management dashboard'}
              </p>
              {session ? (
                <div className="space-y-3">
                  {session.user?.hasApiKey ? (
                    <Link
                      href="/dashboard"
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 block text-center"
                    >
                      Go to Dashboard
                    </Link>
                  ) : (
                    <Link
                      href="/setup"
                      className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 block text-center"
                    >
                      Complete Setup
                    </Link>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleSignIn}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
                >
                  Login with Discord
                </button>
              )}
            </div>

            {/* Admin Section */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20">
              <h2 className="text-2xl font-semibold text-white mb-4">Admin Panel</h2>
              <p className="text-blue-100 mb-6">
                Central administration for managing whitelisted alliances and system settings
              </p>
              {session?.user?.isAdmin ? (
                <Link
                  href="/admin"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 block text-center"
                >
                  Access Admin Panel
                </Link>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-600 text-gray-300 font-semibold py-3 px-6 rounded-lg cursor-not-allowed"
                >
                  Admin Access Required
                </button>
              )}
            </div>
          </div>

          <div className="mt-16">
            <h3 className="text-2xl font-semibold text-white mb-8">Features</h3>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <h4 className="text-lg font-semibold text-white mb-2">Alliance Dashboard</h4>
                <p className="text-blue-100 text-sm">
                  Comprehensive overview of your alliance operations and member status
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <h4 className="text-lg font-semibold text-white mb-2">API Integration</h4>
                <p className="text-blue-100 text-sm">
                  Direct integration with Politics and War API for real-time data
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <h4 className="text-lg font-semibold text-white mb-2">Subdomain Access</h4>
                <p className="text-blue-100 text-sm">
                  Each alliance gets their own subdomain for dedicated access
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}