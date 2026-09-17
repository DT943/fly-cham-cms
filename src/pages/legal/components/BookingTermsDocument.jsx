import { useTranslation } from 'react-i18next'
import LegalSidebar from './LegalSidebar.jsx'
import LegalSectionCard from './LegalSectionCard.jsx'

/**
 * Booking Terms document: lettered sections with bullet lists, plus the shared
 * legal sidebar (active item: ticket / booking terms).
 */
const BookingTermsDocument = () => {
  const { t } = useTranslation()
  const sections = t('legal.bookingTerms.sections', { returnObjects: true }) || []

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-6">
      <aside className="lg:w-[280px] lg:shrink-0">
        <LegalSidebar activeId="ticket" />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col gap-7">
        {sections.map((section, index) => (
          <LegalSectionCard key={index} title={section.title} items={section.items} />
        ))}
      </div>
    </div>
  )
}

export default BookingTermsDocument
