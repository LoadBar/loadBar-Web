// Fetches repositories the authenticated user has granted the LoadBar GitHub App.

import 'server-only'
import { GITHUB_APP_SLUG } from '@/lib/github/auth'
import { githubRequest } from '@/lib/github/client'

export type GithubRepo = {
  id: number
  name: string
  fullName: string
  description: string | null
  htmlUrl: string
  private: boolean
  language: string | null
  updatedAt: string
}

type GithubRepoResponse = {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  private: boolean
  language: string | null
  updated_at: string
}

type InstallationListResponse = {
  installations?: {
    id: number
    app_id?: number
    app_slug?: string
  }[]
}

type InstallationReposResponse = {
  repositories?: GithubRepoResponse[]
}

function mapRepo(repo: GithubRepoResponse): GithubRepo {
  return {
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description,
    htmlUrl: repo.html_url,
    private: repo.private,
    language: repo.language,
    updatedAt: repo.updated_at
  }
}

async function resolveInstallationId(token: string, installationId?: string) {
  if (installationId) {
    return installationId
  }

  const data = await githubRequest<InstallationListResponse>(token, '/user/installations')
  const appId = process.env.GITHUB_APP_ID
  const installation = data.installations?.find(
    item => item.app_slug === GITHUB_APP_SLUG || (appId && String(item.app_id) === appId)
  )

  if (!installation) {
    throw new Error('installation_not_found')
  }

  return String(installation.id)
}

export async function fetchGrantedRepositories(token: string, installationId?: string) {
  const resolvedInstallationId = await resolveInstallationId(token, installationId)
  const repositories: GithubRepo[] = []
  const perPage = 100
  const maxPages = 5

  for (let page = 1; page <= maxPages; page += 1) {
    const data = await githubRequest<InstallationReposResponse>(
      token,
      `/user/installations/${resolvedInstallationId}/repositories`,
      {
        per_page: String(perPage),
        page: String(page)
      }
    )

    const batch = data.repositories ?? []
    repositories.push(...batch.map(mapRepo))

    if (batch.length < perPage) {
      break
    }
  }

  return repositories
}
