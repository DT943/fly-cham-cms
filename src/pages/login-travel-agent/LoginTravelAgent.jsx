import { useTranslation } from 'react-i18next'
import LocalizedLink from '../../shared/components/LocalizedLink.jsx'
import { typography } from '../../styles/typography.js'
// Unrouted legacy page (now the CMS travel-agent-login block) — cms-media copies.
const logo = 'https://xbqrfakpcisqunyugrqt.supabase.co/storage/v1/object/public/cms-media/layout/logo.webp'
const backgroundImage = 'https://xbqrfakpcisqunyugrqt.supabase.co/storage/v1/object/public/cms-media/login-travel-agent/background.webp'
const planeImage = 'https://xbqrfakpcisqunyugrqt.supabase.co/storage/v1/object/public/cms-media/login-travel-agent/plane.webp'
import TravelAgentLoginForm from './components/TravelAgentLoginForm.jsx'

/**
 * Standalone Travel Agent B2B login.
 * Welcome copy and plane are separate layers over the sky — plane is a transparent PNG
 * (not nested under the text), login card sits on the right.
 */
const LoginTravelAgent = () => {
  const { t } = useTranslation()

  return (
    <main className="relative min-h-dvh w-full min-w-0 overflow-x-clip">
      <img loading="lazy" decoding="async"
        src={backgroundImage}
        alt=""
        className="absolute inset-0 size-full object-cover"
        aria-hidden
      />

      {/* Plane: decorative layer — raised slightly above vertical center */}
      <div
        className="pointer-events-none absolute inset-x-0 top-[18%] z-1 flex justify-center px-4 sm:top-[16%] lg:inset-y-auto lg:inset-s-0 lg:inset-e-[40%] lg:top-[14%] lg:bottom-[1%] lg:items-center lg:justify-center lg:px-6 xl:inset-e-[36%] xl:top-[12%]"
        aria-hidden
      >
        <img loading="lazy" decoding="async"
          src={planeImage}
          alt=""
          className="w-[min(92%,20rem)] object-contain drop-shadow-md sm:w-[min(85%,24rem)] lg:w-[min(100%,34rem)] xl:w-[min(100%,40rem)]"
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-page flex-col py-5 ps-3 pe-4 sm:ps-5 sm:pe-8 md:py-8 md:ps-6 md:pe-10 xl:ps-2 xl:pe-0">
        <LocalizedLink href="/" className="inline-flex w-fit shrink-0" aria-label="Fly Cham">
          <img loading="lazy" decoding="async" src={logo} alt="Fly Cham" className="h-10 w-auto sm:h-10 md:h-10" />
        </LocalizedLink>

        <div className="grid flex-1 grid-cols-1 items-center gap-10 py-8 lg:grid-cols-2 lg:gap-8 xl:gap-12">
          {/* Welcome only — no plane inside this block */}
          <div className="relative z-10 flex max-w-md flex-col gap-1 lg:max-w-xl lg:self-start lg:pt-[12vh]">
            <p
              className={`m-0 font-medium text-50 drop-shadow-[0_1px_2px_rgba(1,38,59,0.35)] ${typography.sectionDescription}`}
            >
              {t('loginTravelAgent.welcome')}
            </p>
            <h2
              className={`m-0 font-bold leading-tight text-primary-1 ${typography.pageTitle} lg:text-[44px] xl:text-[44px]`}
            >
              {t('loginTravelAgent.headline')}
            </h2>
          </div>

          {/* Login card — nudged toward the end (right in LTR) */}
          <div className="relative z-10 flex w-full justify-center lg:justify-end lg:translate-x-3 xl:translate-x-6 rtl:lg:-translate-x-3 rtl:xl:-translate-x-6">
            <TravelAgentLoginForm />
          </div>
        </div>
      </div>

      {/* Accessible plane description for screen readers */}
      <span className="sr-only">{t('loginTravelAgent.planeAlt')}</span>
    </main>
  )
}

export default LoginTravelAgent
