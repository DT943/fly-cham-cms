import { Envelope } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import planeArt from '../../../assets/images/city-sights/newsletter-plane.png'

/**
 * Static city-sights newsletter banner.
 * - Large: text + inline white form bar + plane
 * - Small: stacked field then Subscribe on the dark gradient (no plane)
 */
const NewsletterSignup = () => {
  const { t } = useTranslation()

  return (
    <section className="relative isolate overflow-hidden rounded-xl bg-linear-to-br from-primary-1 to-[#00141a] rtl:bg-linear-to-bl lg:bg-linear-to-r lg:rtl:bg-linear-to-l lg:h-[159px]">
      <img
        src={planeArt}
        alt=""
        className="pointer-events-none absolute inset-y-0 end-0 hidden h-full w-[139.5px] object-cover lg:block rtl:-scale-x-100"
      />

      <div className="relative flex flex-col gap-6 p-6 lg:h-full lg:flex-row lg:items-center lg:gap-23 lg:p-0 lg:ps-[37px] lg:pe-[213px]">
        <div className="flex flex-col gap-3.5 text-50 lg:w-[401px] lg:shrink-0">
          <h2 className="m-0 text-xl font-semibold lg:text-2xl">
            {t('citySights.newsletter.title')}
          </h2>
          <p className="m-0 text-sm font-normal leading-5">
            {t('citySights.newsletter.description')}
          </p>
        </div>

        <form
          onSubmit={(event) => event.preventDefault()}
          className="flex w-full flex-col gap-3 lg:w-[480px] lg:shrink-0 lg:flex-row lg:items-center lg:gap-2.5 lg:rounded-lg lg:border lg:border-solid lg:border-200 lg:bg-50 lg:p-2.5"
        >
          <div className="flex w-full items-center gap-2.5 rounded-lg border border-solid border-200 bg-50 p-2.5 lg:min-w-0 lg:flex-1 lg:border-0 lg:bg-transparent lg:p-0">
            <Envelope size={24} className="shrink-0 text-primary-1" />
            <input
              type="email"
              aria-label={t('citySights.newsletter.label')}
              placeholder={t('citySights.newsletter.placeholder')}
              className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-700 placeholder:text-700/70 focus:outline-none focus:ring-0"
            />
          </div>
          <button
            type="submit"
            className="h-11 w-full shrink-0 cursor-pointer rounded-lg border-0 bg-secondary px-[15px] text-base font-medium text-btn transition-colors hover:bg-secondary-800 lg:w-[123px]"
          >
            {t('citySights.newsletter.cta')}
          </button>
        </form>
      </div>
    </section>
  )
}

export default NewsletterSignup
