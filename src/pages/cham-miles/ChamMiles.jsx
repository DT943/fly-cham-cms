import { useTranslation } from 'react-i18next'
import LocalizedLink from '../../shared/components/LocalizedLink.jsx'
import { typography } from '../../styles/typography.js'
import ChamMilesRegisterForm from './components/ChamMilesRegisterForm.jsx'

// Legacy static page — unrouted (/cham-miles is now the CMS page "cham-miles",
// block "cham-miles-register"). Artwork lives only in the cms-media bucket.
const MEDIA =
  'https://xbqrfakpcisqunyugrqt.supabase.co/storage/v1/object/public/cms-media/cham-miles'
const backgroundImage = `${MEDIA}/background.webp`
const chamMilesLogo = `${MEDIA}/logo.webp`

/**
 * Cham Miles registration — full-bleed geometric background,
 * logo top-start, welcome copy left, form right (login-travel-agent layout).
 */
const ChamMiles = () => {
  const { t } = useTranslation()

  return (
    <main className="relative min-h-dvh w-full min-w-0 overflow-x-clip">
      <img
        src={backgroundImage}
        alt=""
        className="absolute inset-0 size-full object-cover"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-page flex-col py-5 ps-3 pe-4 sm:ps-5 sm:pe-8 md:py-8 md:ps-6 md:pe-10 xl:ps-2 xl:pe-0">
        <LocalizedLink
          href="/"
          className="inline-flex w-fit shrink-0"
          aria-label={t('chamMiles.logoAlt')}
        >
          <img
            src={chamMilesLogo}
            alt={t('chamMiles.logoAlt')}
            className="w-auto object-contain"
          />
        </LocalizedLink>

        <div className="grid flex-1 grid-cols-1 items-center gap-10 py-8 lg:grid-cols-2 lg:gap-8 xl:gap-12">
          <div className="relative z-10 flex max-w-md flex-col gap-1 lg:max-w-xl lg:self-start lg:pt-[12vh]">
            <h2
              className={`m-0 font-bold leading-tight ${typography.pageTitle} lg:text-[44px] xl:text-[44px]`}
            >
              <span className="text-primary-1">{t('chamMiles.welcome.headlineBefore')}</span>{' '}
              <span className="text-secondary">{t('chamMiles.welcome.headlineBrand')}</span>{' '}
              <span className="text-primary-1">{t('chamMiles.welcome.headlineAfter')}</span>
            </h2>
            <p className={`m-0 font-normal leading-relaxed text-800 ${typography.sectionDescription}`}>
              {t('chamMiles.welcome.description')}
            </p>
          </div>

          <div className="relative z-10 flex w-full justify-center lg:justify-end lg:translate-x-3 xl:translate-x-6 rtl:lg:-translate-x-3 rtl:xl:-translate-x-6">
            <ChamMilesRegisterForm />
          </div>
        </div>
      </div>
    </main>
  )
}

export default ChamMiles
