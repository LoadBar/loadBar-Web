'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CopyUrl } from '@/components/copy-url'
import { PortfolioView } from '@/components/portfolio/portfolio-view'
import {
  placeholderPortfolio,
  placeholderProfile,
  placeholderUser,
  portfolioPath,
  portfolioSectionLabels,
  type PortfolioSectionId
} from '@/lib/placeholder-data'
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react'

function moveItem<T>(items: T[], index: number, direction: -1 | 1) {
  const nextIndex = index + direction
  if (nextIndex < 0 || nextIndex >= items.length) {
    return items
  }

  const next = [...items]
  const [item] = next.splice(index, 1)
  next.splice(nextIndex, 0, item)
  return next
}

export function PortfolioEditor() {
  const [published, setPublished] = useState(placeholderPortfolio.published)
  const [sectionOrder, setSectionOrder] = useState(placeholderPortfolio.sectionOrder)
  const [projects, setProjects] = useState(placeholderProfile.projects)
  const [previewing, setPreviewing] = useState(false)

  const publicPath = portfolioPath(placeholderUser.username)
  const [publicUrl, setPublicUrl] = useState(publicPath)

  useEffect(() => {
    setPublicUrl(`${window.location.origin}${publicPath}`)
  }, [publicPath])

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
        <div className='space-y-1'>
          <h2 className='text-2xl font-semibold tracking-tight'>Portfolio editor</h2>
          <p className='text-muted-foreground'>
            One portfolio with Hero, About, Skills, Projects, Experience, Education, and Contact.
          </p>
        </div>
        <div className='flex flex-wrap items-center gap-2'>
          <Badge variant={published ? 'default' : 'secondary'}>{published ? 'Published' : 'Draft'}</Badge>
          <Button variant='outline' onClick={() => setPreviewing(current => !current)}>
            {previewing ? 'Edit portfolio' : 'Preview portfolio'}
          </Button>
          <Button onClick={() => setPublished(true)}>Publish portfolio</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Public portfolio URL</CardTitle>
          <CardDescription>Share this URL after you publish, or use it to preview the page.</CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col gap-3 sm:flex-row sm:items-center'>
          <code className='bg-muted flex-1 rounded-lg px-3 py-2 text-sm break-all'>{publicUrl}</code>
          <div className='flex gap-2'>
            <CopyUrl value={publicUrl} />
            <Button variant='outline' size='sm' render={<Link href={publicPath} />} nativeButton={false}>
              Preview
            </Button>
          </div>
        </CardContent>
      </Card>

      {previewing ? (
        <Card>
          <CardContent className='pt-6'>
            <PortfolioView sectionOrder={sectionOrder} projects={projects} />
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Sections</CardTitle>
              <CardDescription>Reorder the sections in your portfolio.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-2'>
              {sectionOrder.map((section, index) => (
                <div key={section} className='flex items-center justify-between gap-3 rounded-lg border px-3 py-2'>
                  <span className='font-medium'>{portfolioSectionLabels[section]}</span>
                  <div className='flex gap-1'>
                    <Button
                      variant='ghost'
                      size='icon-sm'
                      disabled={index === 0}
                      onClick={() => setSectionOrder(current => moveItem(current, index, -1))}
                    >
                      <ArrowUpIcon />
                      <span className='sr-only'>Move up</span>
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon-sm'
                      disabled={index === sectionOrder.length - 1}
                      onClick={() => setSectionOrder(current => moveItem(current, index, 1))}
                    >
                      <ArrowDownIcon />
                      <span className='sr-only'>Move down</span>
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>Reorder the projects shown in the portfolio.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-2'>
              {projects.map((project, index) => (
                <div key={project.id} className='flex items-center justify-between gap-3 rounded-lg border px-3 py-2'>
                  <div>
                    <p className='font-medium'>{project.name}</p>
                    <p className='text-muted-foreground text-sm'>{project.description}</p>
                  </div>
                  <div className='flex gap-1'>
                    <Button
                      variant='ghost'
                      size='icon-sm'
                      disabled={index === 0}
                      onClick={() => setProjects(current => moveItem(current, index, -1))}
                    >
                      <ArrowUpIcon />
                      <span className='sr-only'>Move project up</span>
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon-sm'
                      disabled={index === projects.length - 1}
                      onClick={() => setProjects(current => moveItem(current, index, 1))}
                    >
                      <ArrowDownIcon />
                      <span className='sr-only'>Move project down</span>
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
