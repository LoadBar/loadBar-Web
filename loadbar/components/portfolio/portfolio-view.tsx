import type { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import {
  placeholderProfile,
  placeholderUser,
  type PortfolioSectionId
} from '@/lib/placeholder-data'

const defaultOrder: PortfolioSectionId[] = [
  'hero',
  'about',
  'skills',
  'projects',
  'experience',
  'education',
  'contact'
]

export function PortfolioView({
  username = placeholderUser.username,
  name = placeholderUser.name,
  headline = placeholderProfile.headline,
  about = placeholderProfile.about,
  skills = placeholderProfile.skills,
  projects = placeholderProfile.projects,
  experience = placeholderProfile.experience,
  education = placeholderProfile.education,
  contactEmail = placeholderUser.email,
  sectionOrder = defaultOrder,
  tailoredFor
}: {
  username?: string
  name?: string
  headline?: string
  about?: string
  skills?: typeof placeholderProfile.skills
  projects?: typeof placeholderProfile.projects
  experience?: typeof placeholderProfile.experience
  education?: typeof placeholderProfile.education
  contactEmail?: string
  sectionOrder?: PortfolioSectionId[]
  tailoredFor?: string
}) {
  const sections: Record<PortfolioSectionId, ReactNode> = {
    hero: (
      <section className='space-y-2'>
        <p className='text-muted-foreground text-sm'>@{username}</p>
        <h1 className='text-3xl font-semibold tracking-tight'>{name}</h1>
        <p className='text-lg'>{headline}</p>
      </section>
    ),
    about: (
      <section className='space-y-2'>
        <h2 className='text-xl font-semibold'>About</h2>
        <p className='text-muted-foreground leading-relaxed'>{about}</p>
      </section>
    ),
    skills: (
      <section className='space-y-3'>
        <h2 className='text-xl font-semibold'>Skills</h2>
        <div className='flex flex-wrap gap-2'>
          {skills.map(skill => (
            <Badge key={skill.id} variant='secondary'>
              {skill.name}
            </Badge>
          ))}
        </div>
      </section>
    ),
    projects: (
      <section className='space-y-3'>
        <h2 className='text-xl font-semibold'>Projects</h2>
        <div className='grid gap-3 md:grid-cols-2'>
          {projects.map(project => (
            <article key={project.id} className='rounded-lg border p-4'>
              <h3 className='font-medium'>{project.name}</h3>
              <p className='text-muted-foreground mt-2 text-sm'>{project.description}</p>
              <p className='text-muted-foreground mt-3 text-xs'>{project.skills.join(' · ')}</p>
            </article>
          ))}
        </div>
      </section>
    ),
    experience: (
      <section className='space-y-3'>
        <h2 className='text-xl font-semibold'>Experience</h2>
        <div className='space-y-3'>
          {experience.map(item => (
            <article key={item.id} className='rounded-lg border p-4'>
              <h3 className='font-medium'>{item.title}</h3>
              <p className='text-muted-foreground text-sm'>
                {item.organization} · {item.period}
              </p>
              <p className='mt-2 text-sm'>{item.summary}</p>
            </article>
          ))}
        </div>
      </section>
    ),
    education: (
      <section className='space-y-3'>
        <h2 className='text-xl font-semibold'>Education</h2>
        {education.map(item => (
          <article key={item.id} className='rounded-lg border p-4'>
            <h3 className='font-medium'>{item.school}</h3>
            <p className='text-muted-foreground text-sm'>
              {item.program} · {item.period}
            </p>
          </article>
        ))}
      </section>
    ),
    contact: (
      <section className='space-y-2'>
        <h2 className='text-xl font-semibold'>Contact</h2>
        <p className='text-muted-foreground'>{contactEmail}</p>
      </section>
    )
  }

  return (
    <div className='mx-auto flex w-full max-w-4xl flex-col gap-10'>
      {tailoredFor ? (
        <p className='text-muted-foreground text-sm'>Tailored for {tailoredFor}</p>
      ) : null}
      {sectionOrder.map(section => (
        <div key={section}>{sections[section]}</div>
      ))}
    </div>
  )
}
