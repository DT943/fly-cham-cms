import { useTranslation } from 'react-i18next'
import { Seat, SuitcaseRolling, Car, CaretRight } from '@phosphor-icons/react'
import Container from '../../../shared/components/Container.jsx'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'
import { typography } from '../../../styles/typography.js'
import { homeExtraServices } from '../utils/homeExtraServices.js'

const SERVICE_ICONS = {
  seatSelection: Seat,
  extraBaggage: SuitcaseRolling,
  limousine: Car,
}

/**
 * "Add extra services" — three horizontal service links under Plan Your Trip.
 */
const HomeExtraServices = () => {
  const { t } = useTranslation()

  return (
    <section className="w-full min-w-0 bg-100 pb-12 md:pb-16">
      <Container className="flex min-w-0 flex-col gap-5 md:gap-7">
        <div className="flex max-w-2xl flex-col gap-1.5 md:gap-2">
          <h2 className={`m-0 font-semibold text-700 ${typography.sectionTitle} lg:text-[32px]`}>
            {t('home.extraServices.title')}
          </h2>
          <p className={`m-0 font-normal text-600 ${typography.sectionDescription}`}>
            {t('home.extraServices.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {homeExtraServices.map((service) => {
            const Icon = SERVICE_ICONS[service.id] || Seat
            return (
              <LocalizedLink
                key={service.id}
                href={service.href}
                className="flex min-w-0 items-center gap-3 rounded-2xl border border-200 bg-50 p-4 no-underline shadow-[0_2px_12px_rgba(33,37,41,0.04)] transition-shadow hover:shadow-[0_4px_16px_rgba(33,37,41,0.08)] sm:gap-4 sm:p-5"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#E8F1F4] text-primary-1">
                  <Icon size={22} weight="regular" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className={`font-semibold text-700 ${typography.itemTitle}`}>
                    {t(`home.extraServices.items.${service.id}.title`)}
                  </span>
                  <span className={`font-normal leading-snug text-600 ${typography.caption}`}>
                    {t(`home.extraServices.items.${service.id}.description`)}
                  </span>
                </span>
                <CaretRight
                  size={18}
                  weight="bold"
                  className="shrink-0 text-primary-1 rtl:-scale-x-100"
                  aria-hidden
                />
              </LocalizedLink>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

export default HomeExtraServices
