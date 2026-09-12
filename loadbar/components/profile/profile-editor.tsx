'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { placeholderProfile, type EvidenceLevel } from '@/lib/placeholder-data'

const evidenceVariant: Record<EvidenceLevel, 'default' | 'secondary' | 'outline'> = {
  Strong: 'default',
  Partial: 'secondary',
  Limited: 'outline'
}

export function ProfileEditor() {
  const [headline, setHeadline] = useState(placeholderProfile.headline)
  const [about, setAbout] = useState(placeholderProfile.about)
  const [skills, setSkills] = useState(placeholderProfile.skills)
  const [projects, setProjects] = useState(placeholderProfile.projects)
  const [experience, setExperience] = useState(placeholderProfile.experience)
  const [education, setEducation] = useState(placeholderProfile.education)

  return (
    <div className='space-y-6'>
      <div className='space-y-1'>
        <h2 className='text-2xl font-semibold tracking-tight'>Developer profile</h2>
        <p className='text-muted-foreground'>
          Edit or remove information detected from your GitHub activity.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Headline and about</CardTitle>
          <CardDescription>This summary is used on your dashboard and portfolio.</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='headline'>Headline</Label>
            <Input id='headline' value={headline} onChange={event => setHeadline(event.target.value)} />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='about'>About</Label>
            <Textarea id='about' value={about} onChange={event => setAbout(event.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
          <CardDescription>Each skill includes an evidence level from your repositories.</CardDescription>
        </CardHeader>
        <CardContent className='space-y-3'>
          {skills.map(skill => (
            <div key={skill.id} className='flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-start'>
              <div className='grid flex-1 gap-2'>
                <Input
                  value={skill.name}
                  onChange={event =>
                    setSkills(current =>
                      current.map(item =>
                        item.id === skill.id ? { ...item, name: event.target.value } : item
                      )
                    )
                  }
                />
                <p className='text-muted-foreground text-sm'>{skill.evidence}</p>
              </div>
              <div className='flex items-center gap-2'>
                <Badge variant={evidenceVariant[skill.evidenceLevel]}>{skill.evidenceLevel}</Badge>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setSkills(current => current.filter(item => item.id !== skill.id))}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
          <CardDescription>Detected from your GitHub repositories.</CardDescription>
        </CardHeader>
        <CardContent className='space-y-3'>
          {projects.map(project => (
            <div key={project.id} className='space-y-3 rounded-lg border p-3'>
              <div className='flex flex-col gap-3 sm:flex-row'>
                <Input
                  value={project.name}
                  onChange={event =>
                    setProjects(current =>
                      current.map(item =>
                        item.id === project.id ? { ...item, name: event.target.value } : item
                      )
                    )
                  }
                />
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setProjects(current => current.filter(item => item.id !== project.id))}
                >
                  Remove
                </Button>
              </div>
              <Textarea
                className='min-h-24'
                value={project.description}
                onChange={event =>
                  setProjects(current =>
                    current.map(item =>
                      item.id === project.id ? { ...item, description: event.target.value } : item
                    )
                  )
                }
              />
              <p className='text-muted-foreground text-sm'>
                {project.role} · {project.skills.join(', ')}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Experience</CardTitle>
        </CardHeader>
        <CardContent className='space-y-3'>
          {experience.map(item => (
            <div key={item.id} className='space-y-3 rounded-lg border p-3'>
              <div className='grid gap-2 md:grid-cols-2'>
                <Input
                  value={item.title}
                  onChange={event =>
                    setExperience(current =>
                      current.map(entry =>
                        entry.id === item.id ? { ...entry, title: event.target.value } : entry
                      )
                    )
                  }
                />
                <Input
                  value={item.organization}
                  onChange={event =>
                    setExperience(current =>
                      current.map(entry =>
                        entry.id === item.id ? { ...entry, organization: event.target.value } : entry
                      )
                    )
                  }
                />
              </div>
              <Input
                value={item.period}
                onChange={event =>
                  setExperience(current =>
                    current.map(entry =>
                      entry.id === item.id ? { ...entry, period: event.target.value } : entry
                    )
                  )
                }
              />
              <Textarea
                className='min-h-24'
                value={item.summary}
                onChange={event =>
                  setExperience(current =>
                    current.map(entry =>
                      entry.id === item.id ? { ...entry, summary: event.target.value } : entry
                    )
                  )
                }
              />
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setExperience(current => current.filter(entry => entry.id !== item.id))}
              >
                Remove
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Education</CardTitle>
        </CardHeader>
        <CardContent className='space-y-3'>
          {education.map(item => (
            <div key={item.id} className='space-y-3 rounded-lg border p-3'>
              <Input
                value={item.school}
                onChange={event =>
                  setEducation(current =>
                    current.map(entry =>
                      entry.id === item.id ? { ...entry, school: event.target.value } : entry
                    )
                  )
                }
              />
              <div className='grid gap-2 md:grid-cols-2'>
                <Input
                  value={item.program}
                  onChange={event =>
                    setEducation(current =>
                      current.map(entry =>
                        entry.id === item.id ? { ...entry, program: event.target.value } : entry
                      )
                    )
                  }
                />
                <Input
                  value={item.period}
                  onChange={event =>
                    setEducation(current =>
                      current.map(entry =>
                        entry.id === item.id ? { ...entry, period: event.target.value } : entry
                      )
                    )
                  }
                />
              </div>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setEducation(current => current.filter(entry => entry.id !== item.id))}
              >
                Remove
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
