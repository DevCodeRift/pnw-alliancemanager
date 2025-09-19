'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface ValidationResult {
  nation: {
    id: number
    name: string
    leader: string
    score: number
    cities: number
    alliance?: {
      id: number
      name: string
      acronym?: string
    }
  }
  alliance?: {
    whitelisted: boolean
    alliance: any
    added: boolean
  }
}

export default function SetupPage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [apiKey, setApiKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [step, setStep] = useState<'input' | 'validating' | 'result'>('input')

  // Redirect if not authenticated
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  // Redirect if already has API key
  if (session.user?.hasApiKey) {
    router.push('/dashboard')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!apiKey.trim()) {
      setError('Please enter your API key')
      return
    }

    setLoading(true)
    setError(null)
    setStep('validating')

    try {
      const response = await fetch('/api/setup/validate-api-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: apiKey.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to validate API key')
      }

      setValidationResult(data.data)
      setStep('result')

      // Update the session to reflect the API key is now linked
      await update()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setStep('input')
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    if (validationResult?.alliance?.whitelisted) {
      router.push('/dashboard')
    } else {
      router.push('/')
    }
  }

  if (step === 'result' && validationResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Setup Complete!</h1>
            <p className="text-blue-100">Your API key has been successfully validated and linked.</p>
          </div>

          <div className="space-y-6">
            {/* Nation Information */}
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Your Nation</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-blue-100"><strong>Nation:</strong> {validationResult.nation.name}</p>
                  <p className="text-blue-100"><strong>Leader:</strong> {validationResult.nation.leader}</p>
                  <p className="text-blue-100"><strong>Nation ID:</strong> {validationResult.nation.id}</p>
                </div>
                <div>
                  <p className="text-blue-100"><strong>Score:</strong> {validationResult.nation.score.toLocaleString()}</p>
                  <p className="text-blue-100"><strong>Cities:</strong> {validationResult.nation.cities}</p>
                </div>
              </div>
            </div>

            {/* Alliance Information */}
            {validationResult.nation.alliance ? (
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Your Alliance</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-blue-100">
                      <strong>Alliance:</strong> {validationResult.nation.alliance.name}
                      {validationResult.nation.alliance.acronym && (
                        <span className="ml-2">[{validationResult.nation.alliance.acronym}]</span>
                      )}
                    </p>
                    <p className="text-blue-100"><strong>Alliance ID:</strong> {validationResult.nation.alliance.id}</p>
                  </div>

                  {validationResult.alliance?.whitelisted ? (
                    <div className="flex items-center gap-2 p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-green-100 font-medium">
                        Your alliance is whitelisted! You can access the alliance management dashboard.
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                      <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span className="text-yellow-100 font-medium">
                        Your alliance is not currently whitelisted. Contact an administrator to request access.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Alliance Status</h3>
                <div className="flex items-center gap-2 p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-blue-100">
                    You are not currently in an alliance. You can still use basic features.
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleContinue}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition duration-200"
            >
              {validationResult.alliance?.whitelisted ? 'Go to Dashboard' : 'Continue to Home'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Complete Setup</h1>
          <p className="text-blue-100">
            Link your Politics and War API key to access alliance management features.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-100 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-blue-100 mb-2">
              Politics and War API Key
            </label>
            <input
              type="password"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your PNW API key..."
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
              required
            />
            <p className="mt-2 text-xs text-blue-200">
              Find your API key at:{' '}
              <a
                href="https://politicsandwar.com/account/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-blue-100 underline"
              >
                https://politicsandwar.com/account/
              </a>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !apiKey.trim()}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            {loading ? 'Validating...' : 'Validate API Key'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-blue-200 hover:text-white transition-colors text-sm"
          >
            ← Back to home
          </Link>
        </div>

        {step === 'validating' && (
          <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/50 text-blue-100 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-300"></div>
              <span>Validating your API key with Politics and War...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}