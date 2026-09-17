import { useTranslation } from 'react-i18next'
import LegalPageShell from './components/LegalPageShell.jsx'
import BookingTermsDocument from './components/BookingTermsDocument.jsx'
import useCurrentLanguage from '../../shared/hooks/useCurrentLanguage.js'
import { getManageBookingHref } from '../our-destinations/utils/destinationFaqs.js'
import heroImage from '../../assets/images/legal/terms-hero.jpg'

const BookingTermsAndConditions = () => {
  const { t } = useTranslation()
  const language = useCurrentLanguage()

  return (
    <LegalPageShell
      breadcrumbLabel={t('legal.bookingTerms.breadcrumb')}
      heroImage={heroImage}
      heroImageAlt={t('legal.bookingTerms.hero.imageAlt')}
      heroTitle={t('legal.bookingTerms.hero.title')}
      heroSubtitle={t('legal.bookingTerms.hero.subtitle')}
      moreInfoCards={[
        { id: 'manageBooking', href: getManageBookingHref(language) },
        { id: 'prepareJourney', href: '/travel-experience/before-you-fly' },
      ]}
    >
      <BookingTermsDocument />
    </LegalPageShell>
  )
}

export default BookingTermsAndConditions
