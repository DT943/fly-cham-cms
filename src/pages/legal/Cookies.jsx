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
        { id: 'privacy', href: '/privacy-policy' },
        { id: 'beforeYouBook', href: '/booking-terms-and-conditions' },
      ]}
    >
      <CookiesContent />
    </LegalPageShell>
  )
}

export default Cookies
