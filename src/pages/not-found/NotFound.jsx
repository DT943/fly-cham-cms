import { useTranslation } from 'react-i18next'
import Button from '../../shared/components/Button.jsx'
import { typography } from '../../styles/typography.js'
import cloudsImage from '../../assets/images/not-found/clouds.jpg'

/**
 * Full-bleed 404: cloud aerial photo, navy overlay (#01263B at 40%),
 * centered message and home CTA.
 *
 * Uses min-h-dvh and pulls under the sticky header so the photo always
 * covers the full viewport — including after scrolling to the footer
 * and back (avoids a dark gap at the bottom).
 */
const NotFound = () => {
  const { t } = useTranslation()

  return (
    <main className="relative flex min-h-dvh w-full flex-1 items-center justify-center overflow-hidden bg-secondary-2 -mt-16 pt-16 md:-mt-[4.5rem] md:pt-[4.5rem]">
      <div className="absolute inset-0">
        <img
          src={cloudsImage}
          alt={t('notFound.imageAlt')}
          className="size-full object-cover"
        />
        {/* Design overlay: #01263B66 */}
        <div className="absolute inset-0 bg-[#01263B]/40" aria-hidden />
      </div>

      <div className="relative z-10 flex max-w-3xl flex-col items-center gap-4 px-6 py-16 text-center sm:gap-5 md:gap-6">
        <p className={`m-0 font-medium text-50 ${typography.sectionDescription}`}>{t('notFound.eyebrow')}</p>

        <h1 className="m-0 text-7xl leading-none font-bold tracking-tight text-50 sm:text-8xl md:text-9xl lg:text-[140px]">
          {t('notFound.title')}
        </h1>

        <p className={`m-0 max-w-xl font-normal text-50/90 ${typography.sectionDescription}`}>
          {t('notFound.description')}
        </p>

        <Button href="/" className="mt-2">
          {t('notFound.cta')}
        </Button>
      </div>
    </main>
  )
}

export default NotFound
