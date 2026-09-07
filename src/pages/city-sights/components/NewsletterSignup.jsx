import { useTranslation } from 'react-i18next'

const NewsletterSignup = () => {
  const { t } = useTranslation()

  return (
    <section className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-11.5">
      <div className="flex flex-col gap-2 lg:w-121.5">
        <h2 className="m-0 text-xl font-semibold text-700 lg:text-2xl">
          {t('citySights.newsletter.title')}
        </h2>
        <p className="m-0 text-sm font-normal leading-5 text-800">
          {t('citySights.newsletter.description')}
        </p>
      </div>

      <form
        onSubmit={(event) => event.preventDefault()}
        className="w-full lg:w-121.5"
      >
        <input
          type="email"
          aria-label={t('citySights.newsletter.label')}
          placeholder={t('citySights.newsletter.placeholder')}
          className="w-full rounded-lg border border-solid border-200 bg-50 p-4 text-sm text-700 placeholder:text-700 focus:border-primary-1 focus:outline-none focus:ring-0"
        />
      </form>
    </section>
  )
}

export default NewsletterSignup
