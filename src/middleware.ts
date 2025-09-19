import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hostname = request.headers.get('host') || ''

  // Get the subdomain from the hostname
  const subdomain = getSubdomain(hostname)

  // Skip middleware for certain paths
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    pathname.startsWith('/auth')
  ) {
    return NextResponse.next()
  }

  // If there's a subdomain, handle alliance routing
  if (subdomain && subdomain !== 'www') {
    // Check if this is a valid alliance subdomain
    const isValidAlliance = await validateAllianceSubdomain(subdomain)

    if (!isValidAlliance) {
      // Redirect to main domain with error
      const url = new URL('/subdomain-not-found', request.url)
      url.hostname = getMainDomain(hostname)
      return NextResponse.redirect(url)
    }

    // Rewrite to alliance pages
    const url = request.nextUrl.clone()
    url.pathname = `/alliance/${subdomain}${pathname}`
    return NextResponse.rewrite(url)
  }

  // Handle main domain requests normally
  return NextResponse.next()
}

function getSubdomain(hostname: string): string | null {
  // Handle localhost development
  if (hostname.includes('localhost')) {
    const parts = hostname.split('.')
    if (parts.length > 1 && parts[0] !== 'localhost') {
      return parts[0]
    }
    return null
  }

  // Handle production domains
  const parts = hostname.split('.')
  if (parts.length >= 3) {
    return parts[0]
  }

  return null
}

function getMainDomain(hostname: string): string {
  if (hostname.includes('localhost')) {
    return 'localhost:3000'
  }

  const parts = hostname.split('.')
  if (parts.length >= 2) {
    return parts.slice(-2).join('.')
  }

  return hostname
}

async function validateAllianceSubdomain(subdomain: string): Promise<boolean> {
  try {
    // In a real implementation, you'd check against your database
    // For now, we'll make a simple API call
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/alliances/validate-subdomain?slug=${subdomain}`)
    return response.ok
  } catch (error) {
    console.error('Error validating subdomain:', error)
    return false
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}