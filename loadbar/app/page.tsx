import HeroSection from '@/components/shadcn-studio/blocks/hero-section-01/hero-section-01'
import type { NavigationSection } from '@/components/shadcn-studio/blocks/hero-section-01/header'
import Navbar from '@/components/shadcn-studio/blocks/navbar-component-01/navbar-component-01'

const navigationData: NavigationSection[] = [
  {
    title: 'Home',
    href: '#'
  },
  {
    title: 'Products',
    href: '#'
  },
  {
    title: 'About Us',
    href: '#'
  },
  {
    title: 'Contact Us',
    href: '#'
  }
]

const HeroSectionPage = () => {
  return (
    <>
      {/* Header Section */}
      <Navbar navigationData={[]}/>

      {/* Main Content */}
      <main className='flex flex-col'>
        <HeroSection />
      </main>
    </>
  )
}

export default HeroSectionPage