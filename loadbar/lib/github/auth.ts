// GitHub App OAuth helpers: CSRF state, code exchange, token refresh, and Supabase session storage.
// The browser cookie holds only an opaque session id. Access and refresh tokens never leave the server.

import 'server-only'
import { cookies } from 'next/headers'
import { githubRequest } from '@/lib/github/client'
import { createServiceClient } from '@/lib/supabase/server'

export const SESSION_COOKIE = 'loadbar_session'
export const GITHUB_APP_SLUG = 'loadbar'

export type GithubUser = {
  id: number
  login: string
  name: string | null
  avatarUrl: string
  htmlUrl: string
}

export type GithubSession = {
  id: string
  csrfState: string | null
  accessToken?: string
  accessTokenExpiresAt?: string | null
  refreshToken?: string | null
  refreshTokenExpiresAt?: string | null
  installationId?: string | null
  user?: GithubUser
}

type GithubSessionRow = {
  id: string
  csrf_state: string | null
  github_access_token: string | null
  github_access_token_expires_at: string | null
  github_refresh_token: string | null
  github_refresh_token_expires_at: string | null
  github_installation_id: string | null
  github_user_id: number | null
  github_login: string | null
  github_name: string | null
  github_avatar_url: string | null
  github_html_url: string | null
  expires_at: string
  revoked_at: string | null
}

type GithubUserResponse = {
  id?: number
  login?: string
  name?: string | null
  avatar_url?: string
  html_url?: string
}

type GithubTokenResponse = {
  access_token?: string
  expires_in?: number
  refresh_token?: string
  refresh_token_expires_in?: number
  error?: string
}

export type GithubTokenBundle = {
  accessToken: string
  accessTokenExpiresAt: string | null
  refreshToken: string | null
  refreshTokenExpiresAt: string | null
}

const STATE_TTL_MS = 10 * 60 * 1000
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000
const ACCESS_TOKEN_REFRESH_SKEW_MS = 60 * 1000

function randomId() {
  return Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString('hex')
}

function addMs(ms: number) {
  return new Date(Date.now() + ms).toISOString()
}

function expiryFromSeconds(seconds?: number) {
  if (!seconds) {
    return null
  }

  return addMs(seconds * 1000)
}

function isPast(iso: string | null | undefined, skewMs = 0) {
  if (!iso) {
    return false
  }

  return Date.parse(iso) - skewMs <= Date.now()
}

export function getGithubCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge
  }
}

export function getGithubOAuthConfig() {
  const clientId = process.env.GITHUB_CLIENT_ID
  const clientSecret = process.env.GITHUB_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('GitHub OAuth is not configured')
  }

  return { clientId, clientSecret }
}

function mapSession(row: GithubSessionRow): GithubSession {
  return {
    id: row.id,
    csrfState: row.csrf_state,
    accessToken: row.github_access_token ?? undefined,
    accessTokenExpiresAt: row.github_access_token_expires_at,
    refreshToken: row.github_refresh_token,
    refreshTokenExpiresAt: row.github_refresh_token_expires_at,
    installationId: row.github_installation_id,
    user:
      row.github_user_id && row.github_login
        ? {
            id: row.github_user_id,
            login: row.github_login,
            name: row.github_name,
            avatarUrl: row.github_avatar_url ?? '',
            htmlUrl: row.github_html_url ?? ''
          }
        : undefined
  }
}

async function deleteExpiredSessions() {
  const supabase = createServiceClient()
  await supabase
    .from('github_sessions')
    .delete()
    .or(`expires_at.lte.${new Date().toISOString()},revoked_at.not.is.null`)
}

export async function getSession(sessionId: string | undefined) {
  if (!sessionId) {
    return null
  }

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('github_sessions')
    .select(
      'id, csrf_state, github_access_token, github_access_token_expires_at, github_refresh_token, github_refresh_token_expires_at, github_installation_id, github_user_id, github_login, github_name, github_avatar_url, github_html_url, expires_at, revoked_at'
    )
    .eq('id', sessionId)
    .maybeSingle()

  if (error || !data) {
    return null
  }

  const row = data as GithubSessionRow

  if (row.revoked_at || isPast(row.expires_at)) {
    await supabase.from('github_sessions').delete().eq('id', sessionId)
    return null
  }

  return mapSession(row)
}

export async function createConnectSession() {
  await deleteExpiredSessions()

  const sessionId = randomId()
  const state = randomId()
  const supabase = createServiceClient()
  const { error } = await supabase.from('github_sessions').insert({
    id: sessionId,
    csrf_state: state,
    expires_at: addMs(STATE_TTL_MS)
  })

  if (error) {
    const failure = new Error('session_create_failed') as Error & {
      supabase?: { code?: string; message?: string; hint?: string }
    }
    failure.supabase = {
      code: error.code,
      message: error.message,
      hint: error.hint
    }
    throw failure
  }

  return { sessionId, state }
}

export async function consumeConnectState(sessionId: string | undefined, state: string | null) {
  const session = await getSession(sessionId)

  if (!sessionId || !session || !state || session.csrfState !== state) {
    return null
  }

  return { sessionId, session }
}

export async function rotateCsrfState(sessionId: string) {
  const state = randomId()
  const supabase = createServiceClient()
  const { error } = await supabase
    .from('github_sessions')
    .update({
      csrf_state: state,
      updated_at: new Date().toISOString()
    })
    .eq('id', sessionId)
    .is('revoked_at', null)

  if (error) {
    throw new Error('session_update_failed')
  }

  return state
}

export async function findLoadbarInstallation(token: string) {
  const data = await githubRequest<{
    installations?: { id: number; app_id?: number; app_slug?: string }[]
  }>(token, '/user/installations')
  const appId = process.env.GITHUB_APP_ID
  const installation = data.installations?.find(
    item => item.app_slug === GITHUB_APP_SLUG || (appId && String(item.app_id) === appId)
  )

  return installation ? String(installation.id) : null
}

export async function revokeSession(sessionId: string | undefined) {
  if (!sessionId) {
    return
  }

  const supabase = createServiceClient()
  await supabase
    .from('github_sessions')
    .update({
      github_access_token: null,
      github_refresh_token: null,
      csrf_state: null,
      revoked_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', sessionId)
}

export async function saveAuthenticatedSession(
  sessionId: string,
  data: {
    tokens: GithubTokenBundle
    installationId?: string
    user: GithubUser
  }
) {
  const supabase = createServiceClient()
  const { error } = await supabase
    .from('github_sessions')
    .update({
      csrf_state: null,
      github_access_token: data.tokens.accessToken,
      github_access_token_expires_at: data.tokens.accessTokenExpiresAt,
      github_refresh_token: data.tokens.refreshToken,
      github_refresh_token_expires_at: data.tokens.refreshTokenExpiresAt,
      github_installation_id: data.installationId ? Number(data.installationId) : null,
      github_user_id: data.user.id,
      github_login: data.user.login,
      github_name: data.user.name,
      github_avatar_url: data.user.avatarUrl,
      github_html_url: data.user.htmlUrl,
      expires_at: addMs(SESSION_TTL_MS),
      updated_at: new Date().toISOString()
    })
    .eq('id', sessionId)
    .is('revoked_at', null)

  if (error) {
    throw new Error('session_update_failed')
  }
}

async function readTokenResponse(response: Response): Promise<GithubTokenBundle> {
  if (!response.ok) {
    throw new Error('token_exchange_failed')
  }

  const data = (await response.json()) as GithubTokenResponse

  if (!data.access_token) {
    throw new Error(data.error || 'token_exchange_failed')
  }

  return {
    accessToken: data.access_token,
    accessTokenExpiresAt: expiryFromSeconds(data.expires_in),
    refreshToken: data.refresh_token ?? null,
    refreshTokenExpiresAt: expiryFromSeconds(data.refresh_token_expires_in)
  }
}

export async function exchangeCodeForToken(code: string, redirectUri: string) {
  const { clientId, clientSecret } = getGithubOAuthConfig()
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri
    })
  })

  return readTokenResponse(response)
}

async function refreshGithubAccessToken(refreshToken: string) {
  const { clientId, clientSecret } = getGithubOAuthConfig()
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    })
  })

  return readTokenResponse(response)
}

async function persistRefreshedTokens(sessionId: string, tokens: GithubTokenBundle) {
  const supabase = createServiceClient()
  const { error } = await supabase
    .from('github_sessions')
    .update({
      github_access_token: tokens.accessToken,
      github_access_token_expires_at: tokens.accessTokenExpiresAt,
      github_refresh_token: tokens.refreshToken,
      github_refresh_token_expires_at: tokens.refreshTokenExpiresAt,
      updated_at: new Date().toISOString()
    })
    .eq('id', sessionId)
    .is('revoked_at', null)

  if (error) {
    throw new Error('session_update_failed')
  }
}

export async function getValidRequestSession() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value
  const session = await getSession(sessionId)

  if (!session?.accessToken) {
    return null
  }

  const accessExpired = isPast(session.accessTokenExpiresAt, ACCESS_TOKEN_REFRESH_SKEW_MS)

  if (!accessExpired) {
    return session
  }

  if (!session.refreshToken || isPast(session.refreshTokenExpiresAt)) {
    await revokeSession(session.id)
    return null
  }

  try {
    const tokens = await refreshGithubAccessToken(session.refreshToken)
    await persistRefreshedTokens(session.id, tokens)
    return {
      ...session,
      accessToken: tokens.accessToken,
      accessTokenExpiresAt: tokens.accessTokenExpiresAt,
      refreshToken: tokens.refreshToken,
      refreshTokenExpiresAt: tokens.refreshTokenExpiresAt
    }
  } catch {
    await revokeSession(session.id)
    return null
  }
}

export async function fetchGithubUser(token: string): Promise<GithubUser> {
  const data = await githubRequest<GithubUserResponse>(token, '/user')

  if (!data.id || !data.login) {
    throw new Error('user_fetch_failed')
  }

  return {
    id: data.id,
    login: data.login,
    name: data.name ?? null,
    avatarUrl: data.avatar_url ?? '',
    htmlUrl: data.html_url ?? ''
  }
}
