'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CopyUrl } from '@/components/copy-url'
import {
  placeholderJobAnalysis,
  placeholderUser,
  portfolioPath
} from '@/lib/placeholder-data'

const recommendationVariant = {
  Apply: 'default',
  Stretch: 'secondary',
  'Poor Match': 'outline'
} as const

export function JobAnalyser() {
  const [jobUrl, setJobUrl] = useState('')
  const [description, setDescription] = useState('')
  const [analysed, setAnalysed] = useState(false)
  const [tailored, setTailored] = useState(false)

  const tailoredPath = portfolioPath(placeholderUser.username, placeholderJobAnalysis.slug)
  const [tailoredUrl, setTailoredUrl] = useState(tailoredPath)

  useEffect(() => {
    setTailoredUrl(`${window.location.origin}${tailoredPath}`)
  }, [tailoredPath])

  return (
    <div className='space-y-6'>
      <div className='space-y-1'>
        <h2 className='text-2xl font-semibold tracking-tight'>Job match</h2>
        <p className='text-muted-foreground'>
          Paste a job URL and description, then compare it with your detected profile.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job details</CardTitle>
          <CardDescription>LoadBar will analyse this role against your projects and skills.</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='job-url'>Job URL</Label>
            <Input
              id='job-url'
              placeholder='https://example.com/jobs/senior-frontend-engineer'
              value={jobUrl}
              onChange={event => setJobUrl(event.target.value)}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='job-description'>Job description</Label>
            <Textarea
              id='job-description'
              className='min-h-56'
              placeholder='Paste the full job description here.'
              value={description}
              onChange={event => setDescription(event.target.value)}
            />
          </div>
          <Button
            size='lg'
            onClick={() => {
              setAnalysed(true)
              setTailored(false)
            }}
          >
            Analyse Job
          </Button>
        </CardContent>
      </Card>

      {analysed ? (
        <>
          <div className='grid gap-4 md:grid-cols-3'>
            <Card>
              <CardHeader>
                <CardDescription>Match score</CardDescription>
                <CardTitle className='text-3xl'>{placeholderJobAnalysis.score}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Recommendation</CardDescription>
                <CardTitle>
                  <Badge variant={recommendationVariant[placeholderJobAnalysis.recommendation]}>
                    {placeholderJobAnalysis.recommendation}
                  </Badge>
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Role</CardDescription>
                <CardTitle>{placeholderJobAnalysis.title}</CardTitle>
              </CardHeader>
              <CardContent className='text-muted-foreground'>{placeholderJobAnalysis.company}</CardContent>
            </Card>
          </div>

          <div className='grid gap-4 lg:grid-cols-3'>
            <Card>
              <CardHeader>
                <CardTitle>Strengths</CardTitle>
              </CardHeader>
              <CardContent className='flex flex-wrap gap-2'>
                {placeholderJobAnalysis.strengths.map(item => (
                  <Badge key={item}>{item}</Badge>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Partial matches</CardTitle>
              </CardHeader>
              <CardContent className='flex flex-wrap gap-2'>
                {placeholderJobAnalysis.partialMatches.map(item => (
                  <Badge key={item} variant='secondary'>
                    {item}
                  </Badge>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Missing skills</CardTitle>
              </CardHeader>
              <CardContent className='flex flex-wrap gap-2'>
                {placeholderJobAnalysis.missingSkills.map(item => (
                  <Badge key={item} variant='outline'>
                    {item}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Evidence from projects</CardTitle>
              <CardDescription>Matches are tied to work already in your profile.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
              {placeholderJobAnalysis.evidence.map(item => (
                <div key={`${item.skill}-${item.project}`} className='rounded-lg border p-3'>
                  <p className='font-medium'>
                    {item.skill} · {item.project}
                  </p>
                  <p className='text-muted-foreground mt-1 text-sm'>{item.detail}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tailor portfolio</CardTitle>
              <CardDescription>
                Create a job-specific portfolio URL from this analysis.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <Button onClick={() => setTailored(true)}>Tailor Portfolio for this Job</Button>
              {tailored ? (
                <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
                  <code className='bg-muted flex-1 rounded-lg px-3 py-2 text-sm break-all'>
                    {tailoredUrl}
                  </code>
                  <div className='flex gap-2'>
                    <CopyUrl value={tailoredUrl} />
                    <Button
                      variant='outline'
                      size='sm'
                      render={<Link href={tailoredPath} />}
                      nativeButton={false}
                    >
                      Preview
                    </Button>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  )
}
