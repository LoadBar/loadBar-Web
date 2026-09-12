export type EvidenceLevel = 'Strong' | 'Partial' | 'Limited'
export type MatchRecommendation = 'Apply' | 'Stretch' | 'Poor Match'
export type PortfolioSectionId =
  | 'hero'
  | 'about'
  | 'skills'
  | 'projects'
  | 'experience'
  | 'education'
  | 'contact'

export const placeholderUser = {
  name: 'Alex Chen',
  username: 'alexchen',
  email: 'alex@example.com',
  githubHandle: 'alexchen',
  githubConnected: true
}

export const placeholderProfile = {
  headline: 'Full-stack developer focused on TypeScript, React, and developer tools.',
  about:
    'I build product-minded web apps and internal tools. LoadBar detected this summary from recent GitHub activity across repositories, commits, and contributions.',
  completion: 78,
  skills: [
    {
      id: 'skill-ts',
      name: 'TypeScript',
      evidenceLevel: 'Strong' as EvidenceLevel,
      evidence: 'Used across loadbar-web, issue-tracker, and design-system'
    },
    {
      id: 'skill-react',
      name: 'React',
      evidenceLevel: 'Strong' as EvidenceLevel,
      evidence: 'Primary UI library in loadbar-web and issue-tracker'
    },
    {
      id: 'skill-next',
      name: 'Next.js',
      evidenceLevel: 'Partial' as EvidenceLevel,
      evidence: 'App Router work in loadbar-web'
    },
    {
      id: 'skill-node',
      name: 'Node.js',
      evidenceLevel: 'Partial' as EvidenceLevel,
      evidence: 'API and CLI work in issue-tracker and cli-tools'
    },
    {
      id: 'skill-postgres',
      name: 'PostgreSQL',
      evidenceLevel: 'Limited' as EvidenceLevel,
      evidence: 'Schema changes in issue-tracker'
    }
  ],
  projects: [
    {
      id: 'proj-loadbar',
      name: 'loadbar-web',
      description: 'GitHub developer dashboard for repositories, commits, and activity.',
      skills: ['TypeScript', 'React', 'Next.js'],
      role: 'Primary contributor'
    },
    {
      id: 'proj-issues',
      name: 'issue-tracker',
      description: 'Lightweight issue tracker with filters, comments, and project boards.',
      skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL'],
      role: 'Primary contributor'
    },
    {
      id: 'proj-ds',
      name: 'design-system',
      description: 'Shared UI kit and tokens used across internal apps.',
      skills: ['TypeScript', 'React'],
      role: 'Maintainer'
    },
    {
      id: 'proj-cli',
      name: 'cli-tools',
      description: 'Command-line helpers for repository and release workflows.',
      skills: ['TypeScript', 'Node.js'],
      role: 'Contributor'
    }
  ],
  experience: [
    {
      id: 'exp-1',
      title: 'Frontend Engineer',
      organization: 'Northwind Labs',
      period: '2023 — Present',
      summary: 'Shipped dashboard UI, design-system components, and GitHub-connected product flows.'
    },
    {
      id: 'exp-2',
      title: 'Software Engineering Intern',
      organization: 'Harbor Software',
      period: '2022 — 2023',
      summary: 'Worked on internal tools, issue tracking, and TypeScript services.'
    }
  ],
  education: [
    {
      id: 'edu-1',
      school: 'University of Edinburgh',
      program: 'BSc Computer Science',
      period: '2019 — 2022'
    }
  ]
}

export const placeholderPortfolio = {
  published: false,
  contactEmail: placeholderUser.email,
  sectionOrder: [
    'hero',
    'about',
    'skills',
    'projects',
    'experience',
    'education',
    'contact'
  ] as PortfolioSectionId[]
}

export const placeholderJobMatches = [
  {
    id: 'job-1',
    title: 'Senior Frontend Engineer',
    company: 'Brightline',
    score: 86,
    recommendation: 'Apply' as MatchRecommendation,
    slug: 'senior-frontend-engineer'
  },
  {
    id: 'job-2',
    title: 'Full-Stack Engineer',
    company: 'Orbit',
    score: 71,
    recommendation: 'Stretch' as MatchRecommendation,
    slug: 'full-stack-engineer'
  },
  {
    id: 'job-3',
    title: 'Platform Engineer',
    company: 'Stackyard',
    score: 48,
    recommendation: 'Poor Match' as MatchRecommendation,
    slug: 'platform-engineer'
  }
]

export const placeholderJobAnalysis = {
  title: 'Senior Frontend Engineer',
  company: 'Brightline',
  score: 86,
  recommendation: 'Apply' as MatchRecommendation,
  strengths: ['TypeScript', 'React', 'Dashboard UI', 'Design systems'],
  partialMatches: ['Next.js', 'Node.js'],
  missingSkills: ['GraphQL', 'Cypress'],
  evidence: [
    {
      skill: 'TypeScript',
      project: 'loadbar-web',
      detail: 'Typed app routes, dashboard views, and shared UI components.'
    },
    {
      skill: 'React',
      project: 'issue-tracker',
      detail: 'Built filters, boards, and interactive issue workflows.'
    },
    {
      skill: 'Design systems',
      project: 'design-system',
      detail: 'Maintained shared components and tokens used by multiple apps.'
    }
  ],
  slug: 'senior-frontend-engineer'
}

export const portfolioSectionLabels: Record<PortfolioSectionId, string> = {
  hero: 'Hero',
  about: 'About',
  skills: 'Skills',
  projects: 'Projects',
  experience: 'Experience',
  education: 'Education',
  contact: 'Contact'
}

export function portfolioPath(username: string, jobSlug?: string) {
  return jobSlug ? `/portfolio/${username}/${jobSlug}` : `/portfolio/${username}`
}
