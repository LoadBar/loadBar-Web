import type { Metadata } from 'next'
import HeroSection from '@/components/shadcn-studio/blocks/hero-section-01/hero-section-01'
import Navbar from '@/components/shadcn-studio/blocks/navbar-component-01/navbar-component-01'
import AboutUs from '@/components/shadcn-studio/blocks/about-us-page-01/about-us-page-01'
import { FolderGit2Icon, GitCommitHorizontalIcon, ChartLineIcon, ActivityIcon, LinkIcon } from 'lucide-react'
import CompareUILib from '@/components/shadcn-studio/blocks/compare-07/compare-07'
import LogoCloud from '@/components/shadcn-studio/blocks/logo-cloud-01/logo-cloud-01'
import ContactUs from '@/components/shadcn-studio/blocks/contact-us-page-01/contact-us-page-01'

export const metadata: Metadata = {
  title: 'LoadBar',
  description:
    'Connect your GitHub account and turn your repositories, commits, and development activity into a clear dashboard.'
}

const navigationData = [
  {
    title: 'About',
    href: '#about'
  },
  {
    title: 'Features',
    href: '#features'
  },
  {
    title: 'Overview',
    href: '#overview'
  },
  {
    title: 'Contact',
    href: '#contact'
  }
]

const stats = [
  {
    icon: <FolderGit2Icon />,
    value: 'Repositories',
    description: 'Repository insights'
  },
  {
    icon: <GitCommitHorizontalIcon />,
    value: 'Commits',
    description: 'Commit activity'
  },
  {
    icon: <ChartLineIcon />,
    value: 'Contributions',
    description: 'Contribution tracking'
  },
  {
    icon: <ActivityIcon />,
    value: 'Overview',
    description: 'Developer activity overview'
  }
]

const comparisonData = {
  column1Header: {
    title: 'On GitHub'
  },
  column2Header: {
    title: 'In LoadBar'
  },
  column3Header: 'What this means for you',
  features: [
    {
      name: 'Repository insights',
      column1: 'Repositories are spread across profiles, organizations, and individual project pages',
      column2: 'Review repository insights in one dashboard',
      column3: 'See the projects you work on without jumping between pages'
    },
    {
      name: 'Commit activity',
      column1: 'Commit history lives inside each repository',
      column2: 'See commit activity across your work',
      column3: 'Understand when and where you ship code'
    },
    {
      name: 'Contribution tracking',
      column1: 'Contributions appear as a graph on your profile',
      column2: 'Track contributions alongside your other activity',
      column3: 'Follow your contribution history in context'
    },
    {
      name: 'Developer activity overview',
      column1: 'Activity is split across feeds, profiles, and repositories',
      column2: 'A single overview of your development activity',
      column3: 'Understand your GitHub activity at a glance'
    },
    {
      name: 'One place to look',
      column1: 'You piece the story together from multiple GitHub screens',
      column2: 'Repositories, commits, and activity in one view',
      column3: 'Spend less time hunting for work you already did'
    }
  ]
}

const logos = [
  { alt: 'Repository insights' },
  { alt: 'Commit activity' },
  { alt: 'Contribution tracking' },
  { alt: 'Developer activity overview' },
  { alt: 'Repositories' },
  { alt: 'Commits' },
  { alt: 'Contributions' },
  { alt: 'GitHub account' }
]

const contactInfo = [
  {
    title: 'Product',
    icon: <FolderGit2Icon />,
    description: 'A GitHub developer\ndashboard'
  },
  {
    title: 'What you can view',
    icon: <GitCommitHorizontalIcon />,
    description: 'Repositories, commits,\nand contributions'
  },
  {
    title: 'Overview',
    icon: <ActivityIcon />,
    description: 'Your development activity\nin one place'
  },
  {
    title: 'Get started',
    icon: <LinkIcon />,
    description: 'Connect your GitHub\naccount to begin'
  }
]

const HeroSectionPage = () => {
  return (
    <>
      {/* Header Section */}
      <Navbar navigationData={navigationData} />

      {/* Main Content */}
      <main className='flex flex-col'>
        <HeroSection />
        <br />
        <AboutUs
          stats={stats}
          title='About LoadBar'
          description='LoadBar is a GitHub developer dashboard that will let you connect your GitHub account and view repository, commit, contribution, and development activity in one place.'
          ctaLabel='Explore features'
          ctaHref='#features'
        />
        <br />
        <CompareUILib
          data={comparisonData}
          title='GitHub data, one clear dashboard'
          description='See how LoadBar brings your repositories, commits, contributions, and development activity together.'
        />
        <br />
        <LogoCloud
          logos={logos}
          titlePrefix='The GitHub activity'
          titleHighlight='LoadBar brings together'
          titleSuffix=''
          description='Repository insights, commit activity, contribution tracking, and a developer activity overview.'
        />
        <br />
        <ContactUs
          contactInfo={contactInfo}
          subtitle='Questions about LoadBar?'
          description='LoadBar is a GitHub developer dashboard for viewing your repositories, commits, and development activity in one place.'
        />
      </main>
    </>
  )
}

export default HeroSectionPage
