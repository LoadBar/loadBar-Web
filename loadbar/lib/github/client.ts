// Shared GitHub API request helper. All GitHub HTTP calls go through this client.

import 'server-only'

export class GithubApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'GithubApiError'
    this.status = status
  }
}

export async function githubRequest<T>(
  token: string,
  path: string,
  searchParams?: Record<string, string>
): Promise<T> {
  const url = new URL(path, 'https://api.github.com')

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      url.searchParams.set(key, value)
    }
  }

  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'User-Agent': 'LoadBar',
      'X-GitHub-Api-Version': '2022-11-28'
    },
    cache: 'no-store'
  })

  if (!response.ok) {
    throw new GithubApiError(`GitHub API request failed for ${path}`, response.status)
  }

  return (await response.json()) as T
}
