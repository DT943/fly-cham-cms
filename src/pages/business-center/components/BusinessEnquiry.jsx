import { useTranslation } from 'react-i18next'
import { ArrowRight } from '@phosphor-icons/react'
import Container from '../../../shared/components/Container.jsx'
import Button from '../../../shared/components/Button.jsx'
import { businessEnquiry } from '../utils/businessCenterContent.js'

/**
 * Full-width enquiry banner: photo + #01263B66 overlay, title, copy, CTA.
 */
const BusinessEnquiry = () => {
  const { t } = useTranslation()

  return (
    <Container className="py-2 md:py-4">
      <section className="relative isolate overflow-hidden rounded-2xl bg-secondary-2">
        <img
          src={businessEnquiry.image}
          alt={t('businessCenter.enquiry.imageAlt')}
          className="absolute inset-0 size-full object-cover object-[70%_center]"
        />
        {/* Design overlay: #01263B66 */}
        <div className="pointer-events-none absolute inset-0 bg-[#01263B]/40" aria-hidden />

        <div className="relative flex flex-col gap-6 px-6 py-10 sm:px-10 md:max-w-[60%] md:px-14 md:py-14 lg:min-h-80">
          <div className="flex flex-col gap-3 text-50">
            <h2 className="m-0 text-2xl font-semibold leading-tight sm:text-3xl lg:text-[36px]">
              {t('businessCenter.enquiry.title')}
            </h2>
            <p className="m-0 text-base leading-relaxed lg:text-lg">
              {t('businessCenter.enquiry.description')}
            </p>
          </div>
          <Button href={businessEnquiry.href} className="inline-flex w-fit items-center gap-2.5">
            {t('businessCenter.enquiry.cta')}
            <ArrowRight size={24} weight="bold" className="rtl:-scale-x-100" />
          </Button>
        </div>
      </section>
    </Container>
  )
}

export default BusinessEnquiry
