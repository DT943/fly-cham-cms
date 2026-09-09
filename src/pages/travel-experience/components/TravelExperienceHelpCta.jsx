import { useTranslation } from 'react-i18next'
import { Headset, ArrowRight } from '@phosphor-icons/react'
import Container from '../../../shared/components/Container.jsx'
import Button from '../../../shared/components/Button.jsx'

/**
 * Full-bleed help banner that closes the page: a solid blue → near-black
 * gradient bar with the headset icon and copy on the start side and the gold
 * "Visit the Help Center" button on the end side (stacked on mobile).
 */
const TravelExperienceHelpCta = () => {
  const { t } = useTranslation()

  return (
    <section className="bg-linear-to-r from-primary-1 to-[#00141a] rtl:bg-linear-to-l">
      <Container className="flex flex-col items-start gap-6 py-10 md:flex-row md:items-center md:justify-between md:gap-10 lg:py-14">
        <div className="flex items-start gap-4 text-50 md:items-center">
          <Headset size={64} weight="regular" className="shrink-0 max-sm:size-12" />
          <div className="flex flex-col gap-2 md:gap-3">
            <h2 className="m-0 text-2xl font-semibold leading-tight sm:text-3xl lg:text-[36px]">
              {t('travelExperience.helpCta.title')}
            </h2>
            <p className="m-0 text-sm font-normal leading-relaxed sm:text-base lg:text-lg">
              {t('travelExperience.helpCta.description')}
            </p>
          </div>
        </div>
        <Button href="/help" className="inline-flex shrink-0 items-center gap-2.5 whitespace-nowrap">
          {t('travelExperience.helpCta.cta')}
          <ArrowRight size={24} weight="bold" className="rtl:-scale-x-100" />
        </Button>
      </Container>
    </section>
  )
}

export default TravelExperienceHelpCta
