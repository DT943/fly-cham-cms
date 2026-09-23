import { useTranslation } from 'react-i18next'
import { ArrowRight } from '@phosphor-icons/react'
import Container from '../../../shared/components/Container.jsx'
import Button from '../../../shared/components/Button.jsx'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'
import { typography } from '../../../styles/typography.js'
import { cargoStationsRequest } from '../utils/cargoStationsContent.js'

/**
 * Request CTA.
 * - < lg: section title outside + white card (image, copy, full-width button)
 * - lg+: two-column text/image layout
 */
const CargoStationsRequest = () => {
  const { t } = useTranslation()

  return (
    <section className="w-full min-w-0">
      <Container className="flex min-w-0 flex-col gap-5 py-10 md:gap-8 md:py-14">
        {/* Mobile section title (outside card) */}
        <h2 className={`m-0 font-semibold text-700 lg:hidden ${typography.sectionTitle}`}>
          {t('cargoStations.request.title')}
        </h2>

        {/* Mobile card */}
        <article className="overflow-hidden rounded-2xl bg-50 shadow-[0_4px_16px_rgba(33,37,41,0.06)] lg:hidden">
          <div className="aspect-[16/10] w-full overflow-hidden">
            <img
              src={cargoStationsRequest.image}
              alt={t('cargoStations.request.imageAlt')}
              className="size-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-4 p-5">
            <div className="flex flex-col gap-2">
              <h3 className={`m-0 font-semibold text-700 ${typography.itemTitle}`}>
                {t('cargoStations.request.title')}
              </h3>
              <p className={`m-0 font-normal leading-relaxed text-600 ${typography.sectionDescription}`}>
                {t('cargoStations.request.description')}
              </p>
            </div>
            <LocalizedLink
              href={cargoStationsRequest.href}
              className={`inline-flex w-full items-center justify-center gap-2.5 rounded-lg bg-primary-1 px-6 py-3.5 font-semibold text-50 no-underline transition-colors hover:bg-primary-700 ${typography.button}`}
            >
              {t('cargoStations.request.cta')}
              <ArrowRight size={20} weight="bold" className="rtl:-scale-x-100" />
            </LocalizedLink>
          </div>
        </article>

        {/* Desktop two-column */}
        <div className="hidden min-w-0 gap-10 lg:grid lg:grid-cols-2 lg:items-center">
          <div className="flex flex-col items-start gap-5">
            <div className="flex flex-col gap-3">
              <h2 className={`m-0 font-semibold text-700 ${typography.sectionTitle} lg:text-[32px]`}>
                {t('cargoStations.request.title')}
              </h2>
              <p className={`m-0 max-w-lg font-normal leading-relaxed text-600 ${typography.sectionDescription}`}>
                {t('cargoStations.request.description')}
              </p>
            </div>
            <Button
              href={cargoStationsRequest.href}
              className="inline-flex w-fit items-center gap-2.5 !bg-primary-1 !text-50 hover:!bg-primary-700"
            >
              {t('cargoStations.request.cta')}
              <ArrowRight size={20} weight="bold" className="rtl:-scale-x-100" />
            </Button>
          </div>

          <div className="overflow-hidden rounded-2xl">
            <img
              src={cargoStationsRequest.image}
              alt={t('cargoStations.request.imageAlt')}
              className="aspect-[16/11] w-full object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  )
}

export default CargoStationsRequest
