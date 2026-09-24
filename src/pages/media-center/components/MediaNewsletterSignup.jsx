import { Envelope } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import Container from '../../../shared/components/Container.jsx'
import { typography } from '../../../styles/typography.js'
import newsletterPattern from '../../../assets/images/recent-news/pattern.png'

const DEFAULT_COPY = {
  inline: 'mediaCenter.newsletter',
  fullBleed: 'mediaCenter.newsletter',
  photo: 'home.newsletter',
}

/**
 * Shared newsletter capture used on Media Center, Recent News, and Home.
 * Presentational only (does not submit).
 *
 * layouts:
 * - inline — form row without chrome (Media Center)
 * - fullBleed — light band + side pattern (Recent News)
 * - photo — full-bleed photographic banner with overlay (Home)
 */
const NewsletterContent = ({ t, copyPrefix, variant = 'light' }) => {
  const isPhoto = variant === 'photo'

  return (
    <>
      <div className={`flex flex-col gap-3 lg:max-w-100 lg:shrink-0 ${isPhoto ? 'lg:max-w-xl' : ''}`}>
        <h2
          className={`m-0 font-semibold ${typography.sectionTitle} ${
            isPhoto ? 'text-50 lg:text-[28px]' : 'text-800'
          }`}
        >
          {t(`${copyPrefix}.title`)}
        </h2>
        <p
          className={`m-0 font-normal leading-relaxed ${typography.sectionDescription} ${
            isPhoto ? 'text-50/90' : 'text-700'
          }`}
        >
          {t(`${copyPrefix}.description`)}
        </p>
      </div>

      <form
        onSubmit={(event) => event.preventDefault()}
        className={`flex w-full items-center gap-3 overflow-hidden rounded-lg px-4 py-2 md:px-5 md:py-2.5 lg:min-w-0 lg:flex-1 lg:max-w-148 ${
          isPhoto
            ? 'bg-50 shadow-[0_4px_24px_rgba(0,0,0,0.12)]'
            : 'bg-background'
        }`}
      >
        {isPhoto ? (
          <Envelope size={22} weight="regular" className="shrink-0 text-primary-1" aria-hidden />
        ) : null}
        <input
          type="email"
          aria-label={t(`${copyPrefix}.label`)}
          placeholder={t(`${copyPrefix}.placeholder`)}
          className={`min-w-0 flex-1 border-0 bg-transparent p-0 text-700 placeholder:text-600 focus:outline-none focus:ring-0 md:text-base ${typography.body}`}
        />
        <button
          type="submit"
          className={`h-10 shrink-0 cursor-pointer rounded-lg border-0 bg-secondary px-6 font-semibold text-700 transition-colors hover:bg-secondary-800 md:h-12 md:px-8 lg:min-w-35 ${typography.button}`}
        >
          {t(`${copyPrefix}.cta`)}
        </button>
      </form>
    </>
  )
}

const MediaNewsletterSignup = ({
  layout = 'inline',
  backgroundImage,
  copyPrefix,
}) => {
  const { t } = useTranslation()
  const prefix = copyPrefix || DEFAULT_COPY[layout] || DEFAULT_COPY.inline

  if (layout === 'photo') {
    return (
      <section className="relative w-full overflow-hidden">
        {backgroundImage ? (
          <img
            src={backgroundImage}
            alt=""
            className="absolute inset-0 size-full object-cover object-[center_27%]"
          />
        ) : null}
        <div
          aria-hidden
          className="absolute inset-0 bg-black/20"
        />

        <Container className="relative z-10 flex flex-col gap-6 py-10 md:gap-8 md:py-14 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          <NewsletterContent t={t} copyPrefix={prefix} variant="photo" />
        </Container>
      </section>
    )
  }

  if (layout === 'fullBleed') {
    return (
      <section className="relative mt-10 w-full overflow-hidden border border-200 border-e-0 bg-100">
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
          <NewsletterContent t={t} copyPrefix={prefix} />
        </Container>
      </section>
    )
  }

  return (
    <section className="flex flex-col gap-6 md:gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
      <NewsletterContent t={t} copyPrefix={prefix} />
    </section>
  )
}

export default MediaNewsletterSignup
