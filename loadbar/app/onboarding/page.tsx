import { Suspense } from 'react'
import { OnboardingFlow } from '@/components/onboarding/onboarding-flow'

export const metadata = {
  title: 'Connect GitHub · LoadBar'
}

export default function OnboardingPage() {
  return (
    <main className='bg-muted/40 flex min-h-full flex-1 flex-col'>
      <Suspense>
        <OnboardingFlow />
      </Suspense>
    </main>
  )
}
