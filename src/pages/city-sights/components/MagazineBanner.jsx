import { ArrowRight } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'
import bannerBg from '../../../assets/images/city-sights/magazine-bg.png'
import cover from '../../../assets/images/city-sights/magazine-cover.jpg'
import spreadOne from '../../../assets/images/city-sights/magazine-spread-1.jpg'
import spreadTwo from '../../../assets/images/city-sights/magazine-spread-2.jpg'

const MagazineBanner = () => {
  const { t } = useTranslation()

  return (
    <section className="relative isolate overflow-hidden rounded-xl bg-primary-1 lg:h-90">
      <div className="pointer-events-none absolute inset-0 opacity-90">
        <img src={bannerBg} alt="" className="absolute inset-0 size-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-linear-to-r from-[#01263b] to-transparent to-[121%] backdrop-blur-[23.1px] rtl:bg-linear-to-l" />
      </div>

      {/*
        Row at lg so the copy can never run under the artwork: the text is a
        shrinkable flex item capped at the design's 640px, the images are fixed.
      */}
      <div className="relative flex h-full flex-col justify-center gap-6 px-6 py-10 md:px-10 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:py-0 lg:ps-16 lg:pe-11.5">
        <div className="flex flex-col gap-6 lg:min-w-0 lg:max-w-160">
          <div className="flex flex-col gap-3 text-50">
            <h2 className="m-0 text-2xl font-semibold sm:text-3xl lg:text-4xl">
              {t('citySights.magazine.title')}
            </h2>
            <p className="m-0 text-base font-normal leading-6 md:text-lg">
              {t('citySights.magazine.description')}
            </p>
          </div>

          <LocalizedLink
            href="#"
            className="flex h-14 w-fit items-center justify-center gap-2.5 rounded-lg bg-secondary px-4 text-base font-semibold text-white no-underline transition-colors hover:bg-secondary-800 md:text-lg"
          >
            {t('citySights.magazine.cta')}
            <ArrowRight size={29} className="shrink-0 rtl:-scale-x-100" />
          </LocalizedLink>
        </div>

        {/* Cover plus two spreads, sized as in the design; too wide to keep below lg. */}
        <div className="pointer-events-none hidden shrink-0 items-center gap-2.5 lg:flex">
          <img src={cover} alt="" className="h-78.5 w-59.25 rounded-lg object-cover" />
          <div className="flex flex-col gap-2.5">
            <img src={spreadOne} alt="" className="h-38 w-32 rounded-lg object-cover" />
            <img src={spreadTwo} alt="" className="h-38 w-32 rounded-lg object-cover" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default MagazineBanner
