import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'

const MediaNewsletterSignup = () => {
  const { t } = useTranslation()

  return (
    <section className="flex flex-col gap-6 md:gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
      <div className="flex flex-col gap-3 lg:max-w-100 lg:shrink-0">
        <h2 className={`m-0 font-semibold text-800 ${typography.sectionTitle}`}>
          {t('mediaCenter.newsletter.title')}
        </h2>
        <p className={`m-0 font-normal leading-relaxed text-700 ${typography.sectionDescription}`}>
          {t('mediaCenter.newsletter.description')}
        </p>
      </div>

      <form
        onSubmit={(event) => event.preventDefault()}
        className="flex w-full items-center gap-3 overflow-hidden rounded-lg bg-background px-4 py-2 md:px-5 md:py-2 lg:min-w-0 lg:flex-1 lg:max-w-148"
      >
        <input
          type="email"
          aria-label={t('mediaCenter.newsletter.label')}
          placeholder={t('mediaCenter.newsletter.placeholder')}
          className={`min-w-0 flex-1 border-0 bg-transparent p-0 text-700 placeholder:text-600 focus:outline-none focus:ring-0 md:text-base ${typography.body}`}
        />
        <button
          type="submit"
          className={`h-10 shrink-0 cursor-pointer rounded-lg border-0 bg-secondary px-6 font-semibold text-btn transition-colors hover:bg-secondary-800 md:h-12 md:px-8 lg:min-w-35 ${typography.button}`}
        >
          {t('mediaCenter.newsletter.cta')}
        </button>
      </form>
    </section>
  )
}

export default MediaNewsletterSignup
