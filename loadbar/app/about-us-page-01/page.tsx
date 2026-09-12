import AboutUs from '@/components/shadcn-studio/blocks/about-us-page-01/about-us-page-01'
import { SparklesIcon, TargetIcon, StarIcon, MedalIcon } from "lucide-react"

const stats = [
  {
    icon: (
      <SparklesIcon
      />
    ),
    value: '20+',
    description: 'Years of Experience'
  },
  {
    icon: (
      <TargetIcon
      />
    ),
    value: '70+',
    description: 'Successful Projects'
  },
  {
    icon: (
      <StarIcon
      />
    ),
    value: '550+',
    description: 'Customer Reviews'
  },
  {
    icon: (
      <MedalIcon
      />
    ),
    value: '25',
    description: 'Achieve Awards'
  }
]

const AboutUsPage = () => {
  return <AboutUs stats={stats} />
}

export default AboutUsPage
