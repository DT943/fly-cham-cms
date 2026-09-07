import { ArrowRight } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'

const PlacesWorthDiscovering = () => {
  const { t } = useTranslation()

  return (
    <section className="relative isolate overflow-hidden rounded-2xl bg-linear-to-r from-[#01263b] to-primary-1 rtl:bg-linear-to-l">
      <div className="relative flex flex-col gap-5 px-6 py-8 md:px-10 md:py-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
        <div className="flex max-w-3xl flex-col gap-3 text-50">
          <h2 className="m-0 text-2xl font-semibold lg:text-3xl">
            {t('routeMap.places.title')}
          </h2>
          <p className="m-0 text-base leading-6">{t('routeMap.places.description')}</p>
        </div>

        <LocalizedLink
          href="/our-destinations/city-sights"
          className="flex h-14 w-full shrink-0 items-center justify-center gap-2.5 rounded-lg bg-secondary px-6 text-base font-semibold text-btn no-underline transition-colors hover:bg-secondary-800 lg:w-fit"
        >
          {t('routeMap.places.cta')}
          <ArrowRight size={20} weight="bold" className="shrink-0 rtl:-scale-x-100" />
        </LocalizedLink>
      </div>
    </section>
  )
}

export default PlacesWorthDiscovering
