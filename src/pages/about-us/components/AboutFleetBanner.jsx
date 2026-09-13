import { useTranslation } from 'react-i18next'
import { ArrowRight } from '@phosphor-icons/react'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'
import { typography } from '../../../styles/typography.js'
import fleetPhoto from '../../../assets/images/about-us/fleet.jpg'

const AboutFleetBanner = () => {
  const { t } = useTranslation()

  return (
    <section className="relative isolate flex min-h-[300px] items-center overflow-hidden rounded-xl bg-primary-1 px-6 py-10 sm:px-10 md:min-h-[360px] md:px-16">
      <img
        src={fleetPhoto}
        alt={t('aboutUs.fleet.imageAlt')}
        className="absolute inset-0 -z-10 size-full object-cover opacity-90"
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-secondary-2 from-0% to-secondary-2/0 to-[121%] backdrop-blur-[23px] rtl:bg-linear-to-l" />

      <div className="flex max-w-[640px] flex-col gap-6">
        <div className="flex flex-col gap-3 text-50">
          <h2 className="m-0 text-2xl font-semibold sm:text-3xl md:text-4xl">
            {t('aboutUs.fleet.title')}
          </h2>
          <p className={`m-0 font-normal leading-relaxed ${typography.sectionDescription}`}>
            {t('aboutUs.fleet.description')}
          </p>
        </div>

        <LocalizedLink
          href="/our-destinations"
          className={`inline-flex w-fit items-center gap-2.5 rounded-lg bg-primary-2 px-5 py-3.5 font-semibold text-btn no-underline transition-opacity hover:opacity-90 ${typography.button}`}
        >
          {t('aboutUs.fleet.cta')}
          <ArrowRight size={24} weight="bold" className="rtl:rotate-180" />
        </LocalizedLink>
      </div>
    </section>
  )
}

export default AboutFleetBanner
