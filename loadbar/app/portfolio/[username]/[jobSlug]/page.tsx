import Link from 'next/link'
import { PortfolioView } from '@/components/portfolio/portfolio-view'
import { placeholderJobAnalysis, placeholderUser } from '@/lib/placeholder-data'

export default async function TailoredPortfolioPage({
  params
}: {
  params: Promise<{ username: string; jobSlug: string }>
}) {
  const { username } = await params

  return (
    <main className='mx-auto flex min-h-full w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-10'>
      <div className='flex items-center justify-between'>
        <Link href='/' className='text-sm font-medium'>
          LoadBar
        </Link>
        <p className='text-muted-foreground text-sm'>Job-specific portfolio</p>
      </div>
      <PortfolioView
        username={username || placeholderUser.username}
        tailoredFor={`${placeholderJobAnalysis.title} at ${placeholderJobAnalysis.company}`}
      />
    </main>
  )
}
