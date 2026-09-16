import { useTranslation } from 'react-i18next'
import Container from '../../../shared/components/Container.jsx'
import { typography } from '../../../styles/typography.js'
import newsletterPattern from '../../../assets/images/recent-news/pattern.png'

const copyPrefix = 'mediaCenter.newsletter'

const NewsletterContent = ({ t }) => (
  <>
    <div className="flex flex-col gap-3 lg:max-w-100 lg:shrink-0">
      <h2 className={`m-0 font-semibold text-800 ${typography.sectionTitle}`}>
        {t(`${copyPrefix}.title`)}
      </h2>
      <p className={`m-0 font-normal leading-relaxed text-700 ${typography.sectionDescription}`}>
        {t(`${copyPrefix}.description`)}
      </p>
    </div>

    <form
      onSubmit={(event) => event.preventDefault()}
      className="flex w-full items-center gap-3 overflow-hidden rounded-lg bg-background px-4 py-2 md:px-5 md:py-2 lg:min-w-0 lg:flex-1 lg:max-w-148"
    >
      <input
        type="email"
        aria-label={t(`${copyPrefix}.label`)}
        placeholder={t(`${copyPrefix}.placeholder`)}
        className={`min-w-0 flex-1 border-0 bg-transparent p-0 text-700 placeholder:text-600 focus:outline-none focus:ring-0 md:text-base ${typography.body}`}
      />
      <button
        type="submit"
        className={`h-10 shrink-0 cursor-pointer rounded-lg border-0 bg-secondary px-6 font-semibold text-btn transition-colors hover:bg-secondary-800 md:h-12 md:px-8 lg:min-w-35 ${typography.button}`}
      >
        {t(`${copyPrefix}.cta`)}
      </button>
    </form>
  </>
)

const MediaNewsletterSignup = ({ layout = 'inline' }) => {
  const { t } = useTranslation()

  if (layout === 'fullBleed') {
    return (
      <section className="relative mt-10 w-full overflow-hidden border border-200 border-e-0 bg-100 ">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 inset-s-0 z-0 w-28 overflow-hidden sm:w-36 md:w-44 lg:w-52"
        >
          <img
            src={newsletterPattern}
            alt=""
            className="size-full object-cover object-left"
          />
        </div>

        <Container className="relative z-10 flex flex-col gap-6 py-8 md:gap-8 md:py-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          <NewsletterContent t={t} />
        </Container>
      </section>
    )
  }

  return (
    <section className="flex flex-col gap-6 md:gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
      <NewsletterContent t={t} />
    </section>
  )
}

export default MediaNewsletterSignup
