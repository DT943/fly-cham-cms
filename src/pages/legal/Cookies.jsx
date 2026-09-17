import { useTranslation } from 'react-i18next'
import LegalPageShell from './components/LegalPageShell.jsx'
import CookiesContent from './components/CookiesContent.jsx'
import heroImage from '../../assets/images/legal/cookies-hero.png'

const Cookies = () => {
  const { t } = useTranslation()

  return (
    <LegalPageShell
      breadcrumbLabel={t('legal.cookies.breadcrumb')}
      heroImage={heroImage}
      heroImageAlt={t('legal.cookies.hero.imageAlt')}
      heroTitle={t('legal.cookies.hero.title')}
      heroSubtitle={t('legal.cookies.hero.subtitle')}
      moreInfoCards={[
        { id: 'terms', href: '/legal/booking-terms-and-conditions' },
        { id: 'privacy', href: '/legal/privacy-policy' },
      ]}
    >
      <CookiesContent />
    </LegalPageShell>
  )
}

export default Cookies
