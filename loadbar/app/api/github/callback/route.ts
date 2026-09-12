// GitHub OAuth callback: validates CSRF state, stores the user token, then continues or installs the app.

import { NextRequest, NextResponse } from 'next/server'
import {
  GITHUB_APP_SLUG,
  SESSION_COOKIE,
  consumeConnectState,
  exchangeCodeForToken,
  fetchGithubUser,
  findLoadbarInstallation,
  getGithubCookieOptions,
  revokeSession,
  rotateCsrfState,
  saveAuthenticatedSession
} from '@/lib/github/auth'

const GITHUB_OAUTH_REDIRECT_URI = 'http://localhost:3000/api/github/callback'

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin
  const params = request.nextUrl.searchParams
  const oauthError = params.get('error')
  const sessionId = request.cookies.get(SESSION_COOKIE)?.value

  if (oauthError) {
    const url = new URL('/onboarding', origin)
    url.searchParams.set('error', oauthError)
    return NextResponse.redirect(url)
  }

  const pending = await consumeConnectState(sessionId, params.get('state'))

  if (!pending) {
    const response = NextResponse.redirect(new URL('/onboarding?error=invalid_state', origin))
    response.cookies.set(SESSION_COOKIE, '', getGithubCookieOptions(0))
    return response
  }

  const code = params.get('code')

  try {
    let accessToken = pending.session.accessToken
    let tokens = accessToken
      ? {
          accessToken,
          accessTokenExpiresAt: pending.session.accessTokenExpiresAt ?? null,
          refreshToken: pending.session.refreshToken ?? null,
          refreshTokenExpiresAt: pending.session.refreshTokenExpiresAt ?? null
        }
      : null
    let user = pending.session.user

    if (code) {
      tokens = await exchangeCodeForToken(code, GITHUB_OAUTH_REDIRECT_URI)
      accessToken = tokens.accessToken
      user = await fetchGithubUser(accessToken)
    }

    if (!tokens || !accessToken || !user) {
      await revokeSession(pending.sessionId)
      const response = NextResponse.redirect(new URL('/onboarding?error=oauth', origin))
      response.cookies.set(SESSION_COOKIE, '', getGithubCookieOptions(0))
      return response
    }

    const installationId =
      params.get('installation_id') ?? (await findLoadbarInstallation(accessToken))

    await saveAuthenticatedSession(pending.sessionId, {
      tokens,
      installationId: installationId ?? undefined,
      user
    })

    if (!installationId) {
      const nextState = await rotateCsrfState(pending.sessionId)
      const installUrl = new URL(`https://github.com/apps/${GITHUB_APP_SLUG}/installations/new`)
      installUrl.searchParams.set('state', nextState)
      const response = NextResponse.redirect(installUrl)
      response.cookies.set(SESSION_COOKIE, pending.sessionId, getGithubCookieOptions(10 * 60))
      return response
    }

    const response = NextResponse.redirect(new URL('/onboarding?step=verify', origin))
    response.cookies.set(SESSION_COOKIE, pending.sessionId, getGithubCookieOptions(60 * 60 * 24 * 7))
    return response
  } catch {
    await revokeSession(pending.sessionId)
    const response = NextResponse.redirect(new URL('/onboarding?error=oauth', origin))
    response.cookies.set(SESSION_COOKIE, '', getGithubCookieOptions(0))
    return response
  }
}
