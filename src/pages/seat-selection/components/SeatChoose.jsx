import { useTranslation } from 'react-i18next'
import { ArrowRight } from '@phosphor-icons/react'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'
import { typography } from '../../../styles/typography.js'
import choose1 from '../../../assets/images/seat-selection/choose-1.jpg'
import choose2 from '../../../assets/images/seat-selection/choose-2.jpg'
import choose3 from '../../../assets/images/seat-selection/choose-3.jpg'
import choose4 from '../../../assets/images/seat-selection/choose-4.jpg'

const chooseCards = [
  { id: 'bookingFlight', image: choose1, href: '/' },
  { id: 'manageBooking', image: choose2, href: '/help' },
  { id: 'loyalty', image: choose3, href: '/help' },
  { id: 'salesOffices', image: choose4, href: '/help/contact-us/our-offices' },
]

const SeatChoose = () => {
  const { t } = useTranslation()

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 text-700">
        <h2 className={`m-0 font-semibold ${typography.sectionTitle}`}>
          {t('seatSelection.choose.title')}
        </h2>
        <p className={`m-0 font-normal ${typography.sectionDescription}`}>
          {t('seatSelection.choose.description')}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {chooseCards.map((card) => (
          <LocalizedLink
            key={card.id}
            href={card.href}
            className="group relative flex h-96 flex-col justify-end overflow-hidden rounded-2xl"
          >
            <img
              src={card.image}
              alt=""
              className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-b from-transparent from-[25%] to-secondary-2" />
            <div className="relative flex flex-col gap-3 p-5 text-50">
              <h3 className={`m-0 font-semibold ${typography.itemTitle}`}>
                {t(`seatSelection.choose.cards.${card.id}.title`)}
              </h3>
              <p className={`m-0 font-normal ${typography.itemDescription}`}>
                {t(`seatSelection.choose.cards.${card.id}.description`)}
              </p>
              <span className={`mt-1 inline-flex items-center gap-2 font-semibold text-primary-3 ${typography.button}`}>
                {t(`seatSelection.choose.cards.${card.id}.cta`)}
                <ArrowRight
                  size={16}
                  weight="bold"
                  className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                />
              </span>
            </div>
          </LocalizedLink>
        ))}
      </div>
    </section>
  )
}

export default SeatChoose
