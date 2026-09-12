import { Card, CardContent } from '@/components/ui/card'

type Logos = {
  image?: string
  alt: string
}

const LogoCloud = ({
  logos,
  titlePrefix = 'A thriving',
  titleHighlight = 'community of businesses',
  titleSuffix = 'driving innovation',
  description = 'Proudly partnering with top brands to drive success.'
}: {
  logos: Logos[]
  titlePrefix?: string
  titleHighlight?: string
  titleSuffix?: string
  description?: string
}) => {
  return (
    <section id="overview" className='bg-muted py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-12 space-y-4 text-center sm:mb-16 lg:mb-24'>
          <h2 className='text-2xl font-semibold md:text-3xl lg:text-4xl'>
            <span>{titlePrefix}</span>{' '}
            <span className='relative z-1'>
              {titleHighlight}
              <span className='bg-primary absolute bottom-1 left-0 -z-1 h-px w-full'></span>
            </span>
            {titleSuffix ? (
              <>
                {' '}
                <span>{titleSuffix}</span>
              </>
            ) : null}
          </h2>
          <p className='text-muted-foreground text-xl'>{description}</p>
        </div>

        <Card className='py-14 shadow-lg'>
          <CardContent className='px-14'>
            <div className='flex flex-wrap items-center justify-center gap-x-16 gap-y-8 max-sm:flex-col'>
              {logos.map((logo, index) =>
                logo.image ? (
                  <img key={index} src={logo.image} alt={logo.alt} className='h-7' />
                ) : (
                  <span key={index} className='text-muted-foreground text-lg font-medium'>
                    {logo.alt}
                  </span>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default LogoCloud
