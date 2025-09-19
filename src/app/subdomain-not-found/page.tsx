import Link from 'next/link'

export default function SubdomainNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20 text-center">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">Alliance Not Found</h1>

        <p className="text-blue-100 mb-6">
          The alliance subdomain you're trying to access either doesn't exist or hasn't been whitelisted yet.
        </p>

        <div className="space-y-4">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="text-white font-semibold mb-2">Possible reasons:</h3>
            <ul className="text-blue-100 text-sm space-y-1 list-disc list-inside">
              <li>The alliance hasn't been added to the whitelist</li>
              <li>There's a typo in the subdomain URL</li>
              <li>The alliance has been deactivated</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 text-center"
            >
              Go to Main Site
            </Link>
            <Link
              href="/auth/signin"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 text-center"
            >
              Login
            </Link>
          </div>

          <div className="mt-6 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
            <p className="text-yellow-100 text-sm">
              <strong>Alliance leaders:</strong> If you believe your alliance should have access,
              please contact an administrator to request whitelisting.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Alliance Not Found - PNW Alliance Manager',
  description: 'The requested alliance subdomain could not be found.',
}