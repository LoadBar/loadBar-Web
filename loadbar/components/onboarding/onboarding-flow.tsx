'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Logo from '@/components/shadcn-studio/logo'
import { AlertCircleIcon, CheckCircle2Icon, LoaderCircleIcon } from 'lucide-react'

type OnboardingStep = 'connect' | 'verify' | 'error' | 'fetch'

type GithubUser = {
  login: string
  name: string | null
  avatarUrl: string
  htmlUrl: string
}

type GithubRepo = {
  id: number
  name: string
  fullName: string
  description: string | null
  htmlUrl: string
  private: boolean
  language: string | null
  updatedAt: string
}

const stepperItems = [
  { id: 'connect', label: 'Connect' },
  { id: 'verify', label: 'Verify' },
  { id: 'fetch', label: 'Fetch' },
  { id: 'analyse', label: 'Analyse' },
  { id: 'profile', label: 'Profile' }
] as const

const errorMessages: Record<string, string> = {
  access_denied: 'GitHub access was denied.',
  invalid_state: 'The GitHub sign-in request could not be verified. Try connecting again.',
  oauth: 'GitHub authentication failed. Try connecting again.',
  config: 'GitHub OAuth is not configured on the server.',
  user_fetch: 'GitHub authenticated, but the user profile could not be loaded.',
  verify: 'GitHub authentication could not be verified.',
  fetch: 'Repositories could not be fetched from GitHub.'
}

export function OnboardingFlow() {
  const searchParams = useSearchParams()
  const queryError = searchParams.get('error')
  const stepParam = searchParams.get('step')
  const [step, setStep] = useState<OnboardingStep>(queryError ? 'error' : 'connect')
  const [errorMessage, setErrorMessage] = useState(
    queryError ? errorMessages[queryError] || 'GitHub verification failed.' : ''
  )
  const [user, setUser] = useState<GithubUser | null>(null)
  const [repositories, setRepositories] = useState<GithubRepo[] | null>(null)
  const [fetchError, setFetchError] = useState('')

  useEffect(() => {
    if (queryError) {
      setStep('error')
      setErrorMessage(errorMessages[queryError] || 'GitHub verification failed.')
      return
    }

    if (stepParam !== 'verify') {
      return
    }

    let cancelled = false

    async function verifyThenFetch() {
      setStep('verify')
      setErrorMessage('')
      setFetchError('')
      setUser(null)
      setRepositories(null)

      const reposResponse = await fetch('/api/github/repositories', { cache: 'no-store' })
      if (cancelled) {
        return
      }

      if (reposResponse.status === 401) {
        setErrorMessage(errorMessages.verify)
        setStep('error')
        return
      }

      const data = (await reposResponse.json()) as {
        user?: GithubUser
        repositories?: GithubRepo[]
      }

      if (!reposResponse.ok) {
        if (data.user?.login) {
          setUser(data.user)
        }
        setFetchError(errorMessages.fetch)
        setStep('fetch')
        return
      }

      if (!data.user?.login) {
        setErrorMessage(errorMessages.verify)
        setStep('error')
        return
      }

      if (!Array.isArray(data.repositories)) {
        setUser(data.user)
        setFetchError(errorMessages.fetch)
        setStep('fetch')
        return
      }

      setUser(data.user)
      setRepositories(data.repositories)
      setStep('fetch')
    }

    void verifyThenFetch()

    return () => {
      cancelled = true
    }
  }, [queryError, stepParam])

  async function retryFetch() {
    setFetchError('')
    setRepositories(null)

    const reposResponse = await fetch('/api/github/repositories', { cache: 'no-store' })
    if (reposResponse.status === 401) {
      setErrorMessage(errorMessages.verify)
      setStep('error')
      return
    }

    if (!reposResponse.ok) {
      setFetchError(errorMessages.fetch)
      return
    }

    const data = (await reposResponse.json()) as {
      user?: GithubUser
      repositories?: GithubRepo[]
    }
    if (data.user?.login) {
      setUser(data.user)
    }
    if (!Array.isArray(data.repositories)) {
      setFetchError(errorMessages.fetch)
      return
    }

    setRepositories(data.repositories)
  }

  const verifyComplete = Boolean(user)
  const fetchComplete = repositories !== null

  return (
    <div className='mx-auto flex min-h-full w-full max-w-3xl flex-1 flex-col justify-center gap-8 px-4 py-12'>
      <Link href='/' className='self-start'>
        <Logo />
      </Link>

      <div className='grid gap-3'>
        <ol className='grid gap-2 sm:grid-cols-5'>
          {stepperItems.map(item => {
            const implemented = item.id === 'connect' || item.id === 'verify' || item.id === 'fetch'
            const current = item.id === step || (step === 'error' && item.id === 'verify')
            const complete =
              (item.id === 'connect' && (step !== 'connect' || verifyComplete)) ||
              (item.id === 'verify' && verifyComplete) ||
              (item.id === 'fetch' && fetchComplete)

            return (
              <li
                key={item.id}
                className='flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm'
              >
                {!implemented ? (
                  <span className='size-4 rounded-full border' />
                ) : complete ? (
                  <CheckCircle2Icon className='size-4 text-primary' />
                ) : current ? (
                  <LoaderCircleIcon className='size-4 animate-spin text-primary' />
                ) : (
                  <span className='size-4 rounded-full border' />
                )}
                <span
                  className={
                    !implemented
                      ? 'text-muted-foreground'
                      : current
                        ? 'font-medium'
                        : 'text-muted-foreground'
                  }
                >
                  {item.label}
                </span>
              </li>
            )
          })}
        </ol>
      </div>

      <Card>
        {step === 'connect' ? (
          <>
            <CardHeader>
              <CardTitle>Connect your GitHub account</CardTitle>
              <CardDescription>
                LoadBar uses GitHub to fetch repositories, analyse activity, and build your developer
                profile.
              </CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col gap-4 sm:flex-row sm:items-center'>
              <Button size='lg' render={<a href='/api/github/connect' />} nativeButton={false}>
                Connect GitHub
              </Button>
              <p className='text-muted-foreground text-sm'>
                You will be asked to verify access, then LoadBar will continue automatically.
              </p>
            </CardContent>
          </>
        ) : null}

        {step === 'error' ? (
          <>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <AlertCircleIcon className='size-5 text-destructive' />
                GitHub verification failed
              </CardTitle>
              <CardDescription>{errorMessage}</CardDescription>
            </CardHeader>
            <CardContent className='flex flex-wrap gap-2'>
              <Button render={<a href='/api/github/connect' />} nativeButton={false}>
                Retry
              </Button>
              <Button variant='outline' render={<Link href='/' />} nativeButton={false}>
                Back to landing
              </Button>
            </CardContent>
          </>
        ) : null}

        {step === 'verify' ? (
          <>
            <CardHeader>
              <CardTitle>Verifying GitHub</CardTitle>
              <CardDescription>
                Confirming your GitHub account so LoadBar can continue.
              </CardDescription>
            </CardHeader>
            <CardContent className='flex items-center gap-2 text-sm'>
              <LoaderCircleIcon className='size-4 animate-spin' />
              Checking the authenticated GitHub user…
            </CardContent>
          </>
        ) : null}

        {step === 'fetch' ? (
          <>
            <CardHeader>
              <CardTitle>Fetching repositories</CardTitle>
              <CardDescription>
                {user
                  ? `Collecting repositories for ${user.login}.`
                  : 'Collecting the repositories connected to your GitHub account.'}
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {fetchError ? (
                <div className='space-y-3'>
                  <p className='text-destructive text-sm'>{fetchError}</p>
                  <Button onClick={() => void retryFetch()}>Retry fetch</Button>
                </div>
              ) : repositories === null ? (
                <div className='flex items-center gap-2 text-sm'>
                  <LoaderCircleIcon className='size-4 animate-spin' />
                  Requesting repositories from GitHub…
                </div>
              ) : repositories.length === 0 ? (
                <p className='text-muted-foreground text-sm'>
                  GitHub returned no repositories for this account.
                </p>
              ) : (
                <div className='space-y-3'>
                  <p className='text-sm font-medium'>
                    {repositories.length} repositor{repositories.length === 1 ? 'y' : 'ies'} fetched
                  </p>
                  <ul className='max-h-80 space-y-2 overflow-y-auto'>
                    {repositories.map(repo => (
                      <li key={repo.id} className='rounded-lg border px-3 py-2'>
                        <a href={repo.htmlUrl} className='font-medium hover:underline' target='_blank' rel='noreferrer'>
                          {repo.fullName}
                        </a>
                        {repo.description ? (
                          <p className='text-muted-foreground text-sm'>{repo.description}</p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                  <p className='text-muted-foreground text-sm'>
                    Analyse and profile generation are not implemented yet.
                  </p>
                </div>
              )}
            </CardContent>
          </>
        ) : null}
      </Card>
    </div>
  )
}
