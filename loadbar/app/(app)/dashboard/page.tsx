import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  placeholderJobMatches,
  placeholderPortfolio,
  placeholderProfile
} from '@/lib/placeholder-data'

const recommendationVariant = {
  Apply: 'default',
  Stretch: 'secondary',
  'Poor Match': 'outline'
} as const

export default function DashboardPage() {
  return (
    <>
      <div className='space-y-1'>
        <h2 className='text-2xl font-semibold tracking-tight'>Your LoadBar overview</h2>
        <p className='text-muted-foreground'>
          Profile completion, detected work, portfolio status, and recent job matches.
        </p>
      </div>

      <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
        <Card>
          <CardHeader>
            <CardDescription>Profile completion</CardDescription>
            <CardTitle className='text-3xl'>{placeholderProfile.completion}%</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <Progress value={placeholderProfile.completion} />
            <Button variant='outline' size='sm' render={<Link href='/profile' />} nativeButton={false}>
              Review profile
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Detected skills</CardDescription>
            <CardTitle className='text-3xl'>{placeholderProfile.skills.length}</CardTitle>
          </CardHeader>
          <CardContent className='text-muted-foreground'>
            Skills inferred from repositories and commit activity.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Detected projects</CardDescription>
            <CardTitle className='text-3xl'>{placeholderProfile.projects.length}</CardTitle>
          </CardHeader>
          <CardContent className='text-muted-foreground'>
            Projects pulled from your GitHub repositories.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Portfolio status</CardDescription>
            <CardTitle>{placeholderPortfolio.published ? 'Published' : 'Draft'}</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant='outline' size='sm' render={<Link href='/portfolio' />} nativeButton={false}>
              Open portfolio
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-4 lg:grid-cols-[1.4fr_0.8fr]'>
        <Card>
          <CardHeader>
            <CardTitle>Recent job matches</CardTitle>
            <CardDescription>Latest roles compared against your detected profile.</CardDescription>
          </CardHeader>
          <CardContent className='space-y-3'>
            {placeholderJobMatches.map(job => (
              <div key={job.id} className='flex items-center justify-between gap-4 rounded-lg border p-3'>
                <div>
                  <p className='font-medium'>{job.title}</p>
                  <p className='text-muted-foreground text-sm'>{job.company}</p>
                </div>
                <div className='flex items-center gap-3'>
                  <span className='text-sm font-medium'>{job.score}</span>
                  <Badge variant={recommendationVariant[job.recommendation]}>{job.recommendation}</Badge>
                </div>
              </div>
            ))}
            <Button variant='outline' render={<Link href='/jobs' />} nativeButton={false}>
              Analyse a job
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick links</CardTitle>
            <CardDescription>Continue from the current profile and portfolio.</CardDescription>
          </CardHeader>
          <CardContent className='flex flex-col gap-2'>
            <Button variant='outline' render={<Link href='/profile' />} nativeButton={false}>
              Profile
            </Button>
            <Button variant='outline' render={<Link href='/portfolio' />} nativeButton={false}>
              Portfolio
            </Button>
            <Button variant='outline' render={<Link href='/jobs' />} nativeButton={false}>
              Jobs
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
