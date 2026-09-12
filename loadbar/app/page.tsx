import HeroSection from '@/components/shadcn-studio/blocks/hero-section-01/hero-section-01'
import type { NavigationSection } from '@/components/shadcn-studio/blocks/hero-section-01/header'
import Navbar from '@/components/shadcn-studio/blocks/navbar-component-01/navbar-component-01'
import AboutUs from '@/components/shadcn-studio/blocks/about-us-page-01/about-us-page-01'
import { SparklesIcon, TargetIcon, StarIcon, MedalIcon } from 'lucide-react'
import CompareUILib from '@/components/shadcn-studio/blocks/compare-07/compare-07'
import LogoCloud from '@/components/shadcn-studio/blocks/logo-cloud-01/logo-cloud-01'
import ContactUs from '@/components/shadcn-studio/blocks/contact-us-page-01/contact-us-page-01'
import { Clock8Icon, MapPinIcon, BriefcaseBusinessIcon, PhoneIcon } from "lucide-react";


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

const stats = [
  {
    icon: (
      <SparklesIcon />
    ),
    value: '20+',
    description: 'Years of Experience'
  },
  {
    icon: (
      <TargetIcon />
    ),
    value: '70+',
    description: 'Successful Projects'
  },
  {
    icon: (
      <StarIcon />
    ),
    value: '550+',
    description: 'Customer Reviews'
  },
  {
    icon: (
      <MedalIcon />
    ),
    value: '25',
    description: 'Achieve Awards'
  }
]

const comparisonData = {
  column1Header: {
    icon: {
      light: 'https://cdn.shadcnstudio.com/ss-assets/brand-logo/notion-icon.png',
      dark: 'https://cdn.shadcnstudio.com/ss-assets/brand-logo/notion-white.png'
    },
    title: 'Notion ai'
  },
  column2Header: {
    icon: 'https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/compare/image-11.png',
    title: 'Jasper'
  },
  column3Header: 'What this means for you',
  features: [
    {
      name: 'Pricing',
      column1: 'Included inside Notion workspace, affordable add-on',
      column2: 'Subscription-based, higher pricing tiers',
      column3: 'Choose based on your budget and team size'
    },
    {
      name: 'Best for',
      column1: 'Best for writers who want AI inside their workspace',
      column2: 'Best for marketing teams & brand-heavy content',
      column3: 'Pick the tool that matches your workflow and goals'
    },
    {
      name: 'Writing Quality',
      column1: 'Clean, structured writing suited for notes & documents',
      column2: 'Persuasive, creative marketing-style writing',
      column3: 'Notion = clarity; Jasper = persuasion & creativity'
    },
    {
      name: 'Templates',
      column1: 'Minimal templates, utility-focused',
      column2: '50+ templates for ads, blogs, and social posts',
      column3: 'If templates matter, Jasper gives more flexibility'
    },
    {
      name: 'Long-form Writing',
      column1: 'Strong for drafting & expanding text',
      column2: 'Strong guided workflows for long-form content',
      column3: 'Jasper is better for blogs & long-form content'
    },
    {
      name: 'SEO Tools',
      column1: 'Limited SEO optimization',
      column2: 'SEO features + SurferSEO integration',
      column3: 'Choose Jasper for SEO-driven content creation'
    },
    {
      name: 'Multilingual Support',
      column1: 'Basic multilingual support',
      column2: '30+ languages with tone controls',
      column3: 'Jasper is ideal for global or multilingual teams'
    },
    {
      name: 'Brand Voice',
      column1: 'No dedicated brand-voice training',
      column2: 'Custom brand voice & style training',
      column3: 'Jasper helps maintain brand consistency'
    },
    {
      name: 'Integrations',
      column1: 'Deep integration inside Notion ecosystem',
      column2: 'Integrates with Google Docs, CMS tools, Surfer, Hubspot',
      column3: 'Use Jasper for cross-team, multi-platform workflows'
    },
    {
      name: 'Publishing',
      column1: 'Export or publish within Notion pages',
      column2: 'Supports publishing workflows to multiple platforms',
      column3: 'Jasper is better for marketing publishing needs'
    }
  ]
}

const logos = [
  {
    image: 'https://cdn.shadcnstudio.com/ss-assets/brand-logo/amazon-logo-bw.png',
    alt: 'Amazon'
  },
  {
    image: 'https://cdn.shadcnstudio.com/ss-assets/brand-logo/hubspot-logo-bw.png',
    alt: 'HubSpot'
  },
  {
    image: 'https://cdn.shadcnstudio.com/ss-assets/brand-logo/walmart-logo-bw.png',
    alt: 'Walmart'
  },
  {
    image: 'https://cdn.shadcnstudio.com/ss-assets/brand-logo/microsoft-logo-bw.png',
    alt: 'Microsoft'
  },
  {
    image: 'https://cdn.shadcnstudio.com/ss-assets/brand-logo/evernote-icon-bw.png',
    alt: 'Evernote'
  },
  {
    image: 'https://cdn.shadcnstudio.com/ss-assets/brand-logo/paypal-logo-bw.png',
    alt: 'PayPal'
  },
  {
    image: 'https://cdn.shadcnstudio.com/ss-assets/brand-logo/airbnb-logo-bw.png',
    alt: 'Airbnb'
  },
  {
    image: 'https://cdn.shadcnstudio.com/ss-assets/brand-logo/adobe-logo-bw.png',
    alt: 'Adobe'
  },
  {
    image: 'https://cdn.shadcnstudio.com/ss-assets/brand-logo/shopify-logo-bw.png',
    alt: 'Shopify'
  },
  {
    image: 'https://cdn.shadcnstudio.com/ss-assets/brand-logo/huawei-logo-bw.png',
    alt: 'Huawei'
  }
]

const contactInfo = [
  {
    title: 'Office Hours',
    icon: (
      <Clock8Icon />
    ),
    description: 'Monday-Friday\n8:00 am to 5:00 pm'
  },
  {
    title: 'Our Address',
    icon: (
      <MapPinIcon />
    ),
    description: '802 Perston Rd,Maine\n96812, USA'
  },
  {
    title: 'Office 2',
    icon: (
      <BriefcaseBusinessIcon />
    ),
    description: '802 Perston Rd,Maine\n96812, USA'
  },
  {
    title: 'Get in Touch',
    icon: (
      <PhoneIcon />
    ),
    description: '+1-316-888-9685\n+1-316-477-0169'
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
        <br/>
        <AboutUs stats={stats} />
        <br/>
        <CompareUILib data={comparisonData} />
        <br/>
        <LogoCloud logos={logos} />
        <br/>
        <ContactUs contactInfo={contactInfo} />
      </main>
    </>
  )
}

export default HeroSectionPage