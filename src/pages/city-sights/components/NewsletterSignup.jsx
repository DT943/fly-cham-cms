import { Envelope } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import planeArt from '../../../assets/images/city-sights/newsletter-plane.png'

const NewsletterSignup = () => {
  const { t } = useTranslation()

  return (
    <section className="relative isolate overflow-hidden rounded-xl bg-linear-to-r from-primary-1 to-[#00141a] rtl:bg-linear-to-l lg:h-[159px]">
      {/*
        Exported flat from the Figma vector group — it is ~100 separately
        transformed paths in the file, and the export is already clipped to the
        sliver that shows inside the card.
      */}
      <img
        src={planeArt}
        alt=""
        className="pointer-events-none absolute inset-y-0 end-0 hidden h-full w-[139.5px] object-cover sm:block rtl:-scale-x-100"
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
          className="flex w-full items-center gap-2.5 rounded-lg border border-solid border-200 bg-50 p-2.5 lg:w-[480px] lg:shrink-0"
        >
          <Envelope size={24} className="shrink-0 text-primary-1" />
          <input
            type="email"
            aria-label={t('citySights.newsletter.label')}
            placeholder={t('citySights.newsletter.placeholder')}
            className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-700 placeholder:text-700 focus:outline-none focus:ring-0"
          />
          <button
            type="submit"
            className="h-11 shrink-0 cursor-pointer rounded-lg border-0 bg-primary-1 px-[15px] text-base font-medium text-50 transition-colors hover:bg-primary-800 lg:w-[123px]"
          >
            {t('citySights.newsletter.cta')}
          </button>
        </form>
      </div>
    </section>
  )
}

export default NewsletterSignup
