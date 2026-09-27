import { useTranslation } from 'react-i18next'
import Container from '../../../shared/components/Container.jsx'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'
import { typography } from '../../../styles/typography.js'
import { homeChamMilesBanner } from '../utils/homeChamMilesBanner.js'

/**
 * Join Cham Miles split banner — gradient + mark panel + cabin photo.
 */
const HomeChamMilesBanner = () => {
  const { t } = useTranslation()
  const { photoImage, markImage, joinHref, discoverHref } = homeChamMilesBanner

  return (
    <section className="w-full min-w-0">
      <Container className="py-6 md:py-8">
        <div className="grid min-w-0 overflow-hidden rounded-2xl lg:grid-cols-2">
          <div
            className="relative flex min-h-64 flex-col justify-between gap-8 overflow-hidden p-6 sm:min-h-72 sm:p-8 md:p-10 lg:min-h-80"
            style={{
              background: 'linear-gradient(102.31deg, #006080 0%, #00141A 100%)',
            }}
          >
            <img
              src={markImage}
              alt=""
              aria-hidden
              className="pointer-events-none absolute inset-e-0 top-1/2 h-[220%] w-[min(58%,20rem)] max-w-none -translate-y-2/4 select-none object-cover object-left opacity-10 mix-blend-screen sm:w-[min(52%,24rem)] lg:w-[min(65%,28rem)]"
            />

            <div className="relative z-10 flex max-w-md flex-col gap-3 text-50">
              <h2 className={`m-0 font-semibold leading-tight ${typography.sectionTitle} lg:text-[32px]`}>
                {t('home.chamMilesBanner.title')}
              </h2>
              <p className={`m-0 font-normal leading-relaxed text-50/90 ${typography.sectionDescription}`}>
                {t('home.chamMilesBanner.description')}
              </p>
            </div>

            <div className="relative z-10 flex flex-wrap items-center gap-3">
              <LocalizedLink
                href={joinHref}
                className={`inline-flex items-center justify-center rounded-lg bg-secondary px-6 py-3 font-semibold lowercase text-700 no-underline transition-colors hover:bg-secondary-800 ${typography.button}`}
              >
                {t('home.chamMilesBanner.joinNow')}
              </LocalizedLink>
              <LocalizedLink
                href={discoverHref}
                className={`inline-flex items-center justify-center rounded-lg bg-50 px-6 py-3 font-semibold text-primary-1 no-underline transition-colors hover:bg-50/90 ${typography.button}`}
              >
                {t('home.chamMilesBanner.discoverMore')}
              </LocalizedLink>
            </div>
          </div>

          <div className="relative min-h-56 overflow-hidden bg-primary-800 sm:min-h-64 lg:min-h-full">
            <img
              src={photoImage}
              alt={t('home.chamMilesBanner.imageAlt')}
              className="absolute inset-0 size-full object-cover object-center"
            />
          </div>
        </div>
      </Container>
    </section>
  )
}

export default HomeChamMilesBanner
