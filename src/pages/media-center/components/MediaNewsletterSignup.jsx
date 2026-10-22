import { useTranslation } from 'react-i18next'
import Container from '../../../shared/components/Container.jsx'
import { MEDIA_NEWSLETTER_DEFAULT_PATTERN } from '../../../shared/components/mediaNewsletterSignupConstants.js'
import { trackNewsletterAttempt } from '../../../shared/analytics/cmsEvents.js'
import { typography } from '../../../styles/typography.js'

const copyPrefix = 'mediaCenter.newsletter'

/**
 * Static media-center newsletter band — same layout as the CMS block
 * (Figma 41004:70191): copy + form on the start side, pattern on the end.
 */
const MediaNewsletterSignup = () => {
  const { t } = useTranslation()

  return (
    <section className="relative mt-10 w-full overflow-hidden bg-100">
      <div
        aria-hidden
        className="pointer-events-none absolute -end-0 -top-6 z-0 hidden h-[min(100%,23rem)] w-[min(21.5rem,40%)] opacity-60 lg:block lg:w-[min(22rem,36%)]"
      >
        <img
          loading="lazy"
          decoding="async"
          src={MEDIA_NEWSLETTER_DEFAULT_PATTERN}
          alt=""
          width={680}
          height={766}
          className="h-full w-full max-w-none origin-center object-cover object-right object-top rotate-[0.4deg] skew-x-[4.5deg] rtl:-scale-x-100 rtl:object-left"
        />
      </div>

      <Container className="relative z-10 py-8 md:py-10 lg:py-[42px]">
        <div className="relative z-10 flex w-full max-w-xl flex-col gap-3 md:max-w-[40rem] lg:max-w-[48rem]">
          <h2 className={`m-0 font-semibold text-800 ${typography.sectionTitle}`}>
            {t(`${copyPrefix}.title`)}
          </h2>
          <p className={`m-0 font-normal leading-6 text-700 ${typography.sectionDescription}`}>
            {t(`${copyPrefix}.description`)}
          </p>

          <form
            onSubmit={(event) => {
              event.preventDefault()
              trackNewsletterAttempt({
                formLocation: 'media_center_newsletter',
                formId: 'media-center-newsletter',
              })
            }}
            className="mt-1 flex w-full flex-col gap-4 sm:max-w-sm"
          >
            <input
              type="email"
              aria-label={t(`${copyPrefix}.label`)}
              placeholder={t(`${copyPrefix}.placeholder`)}
              className={`h-11 w-full rounded-lg border-0 bg-background px-4 text-700 placeholder:text-600 focus:outline-none focus:ring-0 ${typography.body}`}
            />
            <button
              type="submit"
              className={`flex h-11 w-fit min-w-[8.375rem] cursor-pointer items-center justify-center rounded-lg border-0 bg-secondary px-6 font-semibold text-btn transition-colors hover:bg-secondary-800 ${typography.button}`}
            >
              {t(`${copyPrefix}.cta`)}
            </button>
          </form>
        </div>
      </Container>
    </section>
  )
}

export default MediaNewsletterSignup
