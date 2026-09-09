import { useTranslation } from 'react-i18next'
import { ArrowRight } from '@phosphor-icons/react'
import Container from '../../../shared/components/Container.jsx'
import Button from '../../../shared/components/Button.jsx'
import helpPhoto from '../../../assets/images/travel-experience/help-cta.png'

/**
 * Contained rounded help card: a customer-service photo tinted with the brand
 * blue on the copy (start) side, closing the page with a link to the Help
 * Center. Text sits over the solid-blue side; the photo shows through the end.
 */
const TravelExperienceHelpCta = () => {
  const { t } = useTranslation()

  return (
    <Container>
      <section className="relative isolate overflow-hidden rounded-2xl bg-primary-1">
        <img
          src={helpPhoto}
          alt={t('travelExperience.helpCta.imageAlt')}
          className="absolute inset-0 size-full object-cover object-right"
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-primary-1 from-45% to-transparent rtl:bg-linear-to-l" />

        <div className="relative flex flex-col gap-6 px-6 py-10 sm:px-10 md:px-14 md:py-16 lg:min-h-90">
          <div className="flex max-w-160 flex-col gap-3 text-50">
            <h2 className="m-0 text-2xl font-semibold leading-tight sm:text-3xl lg:text-[36px]">
              {t('travelExperience.helpCta.title')}
            </h2>
            <p className="m-0 text-base leading-relaxed lg:text-lg">
              {t('travelExperience.helpCta.description')}
            </p>
          </div>
          <Button href="/help" className="inline-flex w-fit items-center gap-2.5">
            {t('travelExperience.helpCta.cta')}
            <ArrowRight size={24} weight="bold" className="rtl:-scale-x-100" />
          </Button>
        </div>
      </section>
    </Container>
  )
}

export default TravelExperienceHelpCta
