import { ArrowRight } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'
import useCurrentLanguage from '../../../shared/hooks/useCurrentLanguage.js'
import bannerBg from '../../../assets/images/city-sights/magazine-bg.png'
import MagazineFanCluster from './MagazineFanCluster.jsx'

const MediaMagazineBanner = () => {
  const { t } = useTranslation()
  const isRtl = useCurrentLanguage() === 'ar'
  const deg = isRtl ? 270 : 90

  return (
    <section className="relative isolate overflow-hidden rounded-[12px] bg-primary-1 lg:h-90">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[12px]"
        style={{ opacity: 0.9 }}
      >
        <img
          src={bannerBg}
          alt=""
          className="absolute inset-0 size-full rounded-[12px] object-cover opacity-50"
        />
        <div
          className="absolute inset-0 rounded-[12px]"
          style={{
            background: `linear-gradient(${deg}deg, #01263B 0%, rgba(1, 38, 59, 0) 100%)`,
            backdropFilter: 'blur(23.10px)',
            WebkitBackdropFilter: 'blur(23.10px)',
          }}
          aria-hidden
        />
      </div>

      <div className="relative flex h-full flex-col justify-center gap-6 px-6 py-10 md:px-10 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:py-0 lg:ps-16 lg:pe-11.5">
        <div className="flex flex-col gap-6 lg:min-w-0 lg:max-w-160">
          <div className="flex flex-col gap-3 text-50">
            <h2 className="m-0 text-2xl font-semibold sm:text-3xl lg:text-4xl">
              {t('mediaCenter.magazine.title')}
            </h2>
            <p className="m-0 text-base font-normal leading-6 md:text-lg">
              {t('mediaCenter.magazine.description')}
            </p>
          </div>

          <MagazineFanCluster compact className="mx-auto lg:hidden" />

          <LocalizedLink
            href="/magazine-view"
            className="flex h-14 w-full items-center justify-center gap-2.5 rounded-lg bg-secondary px-4 text-base font-semibold text-btn no-underline transition-colors hover:bg-secondary-800 md:text-lg lg:w-fit"
          >
            {t('mediaCenter.magazine.cta')}
            <ArrowRight size={29} className="shrink-0 text-btn rtl:-scale-x-100" />
          </LocalizedLink>
        </div>

        <MagazineFanCluster className="hidden lg:flex" />
      </div>
    </section>
  )
}

export default MediaMagazineBanner
