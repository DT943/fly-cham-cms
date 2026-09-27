import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Container from '../../../shared/components/Container.jsx'
import { typography } from '../../../styles/typography.js'
import { cargoShipmentTypes } from '../utils/cargoServiceContent.js'

/**
 * Shipment-type explorer under the cargo hero.
 * - < lg: scrollable pill tabs above a bordered image/text card
 * - lg+: full-width single-line underline tabs + text/image panel inside one white card
 */
const CargoShipmentTypes = () => {
  const { t } = useTranslation()
  const baseId = useId()
  const [activeId, setActiveId] = useState(cargoShipmentTypes[0]?.id)
  const active = cargoShipmentTypes.find((item) => item.id === activeId) || cargoShipmentTypes[0]

  if (!active) return null

  return (
    <section className="w-full min-w-0">
      <Container className="flex min-w-0 flex-col gap-5 py-10 md:gap-6 md:py-14">
        <div className="flex max-w-3xl flex-col gap-2 md:gap-3">
          <h2 className={`m-0 font-semibold text-700 ${typography.sectionTitle} lg:text-[32px]`}>
            {t('cargoService.shipments.title')}
          </h2>
          <p className={`m-0 font-normal leading-relaxed text-600 ${typography.sectionDescription}`}>
            {t('cargoService.shipments.description')}
          </p>
        </div>

        <div className="flex min-w-0 flex-col gap-4 lg:gap-6 lg:rounded-2xl lg:bg-50 lg:p-8 lg:shadow-[0_4px_16px_rgba(33,37,41,0.06)]">
          <div
            role="tablist"
            aria-label={t('cargoService.shipments.tabsLabel')}
            className="no-scrollbar -mx-4 flex w-[calc(100%+2rem)] gap-2 overflow-x-auto overscroll-x-contain px-4 sm:mx-0 sm:w-full sm:px-0 lg:justify-between lg:gap-2 xl:gap-3 lg:border-b lg:border-200"
          >
            {cargoShipmentTypes.map((item) => {
              const isActive = item.id === activeId
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  id={`${baseId}-tab-${item.id}`}
                  aria-selected={isActive}
                  aria-controls={`${baseId}-panel-${item.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveId(item.id)}
                  className={`m-0 shrink-0 cursor-pointer whitespace-nowrap border-0 transition-colors duration-200 ${typography.caption} ${
                    isActive
                      ? 'rounded-full bg-primary-1 px-4 py-2.5 font-semibold text-50 lg:rounded-none lg:border-b-2 lg:border-solid lg:border-primary-1 lg:bg-transparent lg:px-0 lg:pb-3 lg:pt-0 lg:text-primary-1'
                      : 'rounded-full border border-solid border-200 bg-[#F5F5F5] px-4 py-2.5 font-medium text-600 lg:rounded-none lg:border-0 lg:border-b-2 lg:border-transparent lg:bg-transparent lg:px-0 lg:pb-3 lg:pt-0 lg:text-600'
                  }`}
                >
                  {t(`cargoService.shipments.types.${item.id}.label`)}
                </button>
              )
            })}
          </div>

          <div
            role="tabpanel"
            id={`${baseId}-panel-${active.id}`}
            aria-labelledby={`${baseId}-tab-${active.id}`}
            className="overflow-hidden rounded-2xl border border-200 bg-50 p-4 sm:p-5 lg:border-0 lg:bg-transparent lg:p-0 lg:pt-2"
          >
            <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-10 xl:gap-14">
              <div className="order-2 flex flex-col gap-2 lg:order-1 lg:gap-3">
                <h3 className={`m-0 font-semibold text-700 ${typography.itemTitle} lg:text-2xl`}>
                  {t(`cargoService.shipments.types.${active.id}.title`)}
                </h3>
                <p className={`m-0 font-normal leading-relaxed text-600 ${typography.sectionDescription}`}>
                  {t(`cargoService.shipments.types.${active.id}.description`)}
                </p>
              </div>

              <div className="order-1 overflow-hidden rounded-2xl lg:order-2">
                <img
                  src={active.image}
                  alt={t(`cargoService.shipments.types.${active.id}.imageAlt`)}
                  className="aspect-[16/10] w-full object-cover lg:aspect-[16/11]"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default CargoShipmentTypes
