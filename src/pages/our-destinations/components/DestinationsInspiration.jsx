import { ArrowRight } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import Button from '../../../shared/components/Button.jsx'
import { typography } from '../../../styles/typography.js'
import planeBg from '../../../assets/images/our-destenations/ph5.png'
import photoFalls from '../../../assets/images/our-destenations/ph2.jpg'
import photoCity from '../../../assets/images/our-destenations/ph3.jpg'
import photoCoast from '../../../assets/images/our-destenations/ph4.jpg'

const stackPhotoClass =
  'rounded-2xl object-cover shadow-[0_8px_20px_rgba(0,0,0,0.28)] sm:shadow-none'

const DestinationsInspiration = () => {
  const { t } = useTranslation()

  return (
    <section className="relative overflow-hidden rounded-2xl bg-secondary-2">
      <img
        src={planeBg}
        alt=""
        className="pointer-events-none absolute inset-0 size-full object-cover object-[60%_center] opacity-60 rtl:-scale-x-100"
      />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-l from-secondary-2/90 via-secondary-2/55 to-secondary-2/90 rtl:bg-linear-to-l" />

      <div className="relative z-10 flex flex-col items-center gap-8 px-5 py-8 sm:gap-10 sm:px-8 sm:py-10 md:px-12 md:py-12 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-14 lg:py-12">
        <div className="flex w-full max-w-xl flex-col items-start gap-3 md:gap-5 lg:flex-1">
          <h2 className={`${typography.sectionTitle} m-0 font-semibold leading-tight text-50`}>
            {t('destinations.inspiration.title')}
          </h2>
          <p className={`${typography.sectionDescription} font-medium m-0 leading-relaxed text-50`}>
            {t('destinations.inspiration.description')}
          </p>
          <Button href="#" className="gap-2">
            {t('destinations.inspiration.cta')}
            <ArrowRight size={16} weight="bold" className="rtl:-scale-x-100" />
          </Button>
        </div>

        <div className="relative  flex h-64 w-full max-w-88 shrink-0 items-center justify-center sm:h-72 sm:max-w-96 lg:h-60 lg:max-w-104">
          <img
            src={photoCoast}
            alt={t('destinations.inspiration.coastAlt')}
            className={`${stackPhotoClass} relative z-0 -me-5 h-[80%] w-[37%] sm:-me-4 sm:h-[75%] sm:w-[34%]`}
          />
          <img
            src={photoFalls}
            alt={t('destinations.inspiration.fallsAlt')}
            className={`${stackPhotoClass} relative z-10 h-full w-[46%]  sm:w-[42%] `}
          />
          <img
            src={photoCity}
            alt={t('destinations.inspiration.cityAlt')}
            className={`${stackPhotoClass} relative z-0 -ms-5 h-[80%] w-[37%] sm:-ms-4 sm:h-[75%] sm:w-[34%]`}
          />
        </div>
      </div>
    </section>
  )
}

export default DestinationsInspiration
