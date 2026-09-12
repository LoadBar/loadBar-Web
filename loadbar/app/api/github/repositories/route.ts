// Returns repositories granted to LoadBar for the current server-side GitHub session.

import { NextResponse } from 'next/server'
import { fetchGithubUser, getValidRequestSession } from '@/lib/github/auth'
import { fetchGrantedRepositories } from '@/lib/github/repositories'

export async function GET() {
  const session = await getValidRequestSession()

  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Not authenticated with GitHub' }, { status: 401 })
  }

  let user
  try {
    user = await fetchGithubUser(session.accessToken)
  } catch {
    return NextResponse.json({ error: 'Failed to verify GitHub user' }, { status: 401 })
  }

  try {
    const repositories = await fetchGrantedRepositories(
      session.accessToken,
      session.installationId ?? undefined
    )
    return NextResponse.json({ user, repositories })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch repositories', user }, { status: 502 })
  }
}
