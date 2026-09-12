// Starts GitHub user authorization: creates a CSRF state, stores it in the server session, then redirects.

import { NextRequest, NextResponse } from 'next/server'
import {
  SESSION_COOKIE,
  createConnectSession,
  getGithubCookieOptions,
  getGithubOAuthConfig
} from '@/lib/github/auth'

const GITHUB_OAUTH_REDIRECT_URI = 'http://localhost:3000/api/github/callback'

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin

  try {
    const { clientId } = getGithubOAuthConfig()
    const { sessionId, state } = await createConnectSession()
    const authorizeUrl = new URL('https://github.com/login/oauth/authorize')
    authorizeUrl.searchParams.set('client_id', clientId)
    authorizeUrl.searchParams.set('state', state)
    authorizeUrl.searchParams.set('redirect_uri', GITHUB_OAUTH_REDIRECT_URI)

    const response = NextResponse.redirect(authorizeUrl)
    response.cookies.set(SESSION_COOKIE, sessionId, getGithubCookieOptions(10 * 60))
    return response
  } catch (error) {
    const supabaseError =
      error && typeof error === 'object' && 'supabase' in error
        ? (error as { supabase?: { code?: string; message?: string; hint?: string } }).supabase
        : undefined

    console.error('createConnectSession failed', {
      name: error instanceof Error ? error.name : 'Error',
      message: error instanceof Error ? error.message : 'unknown',
      supabaseCode: supabaseError?.code,
      supabaseMessage: supabaseError?.message,
      supabaseHint: supabaseError?.hint
    })

    return NextResponse.redirect(new URL('/onboarding?error=config', origin))
  }
}
