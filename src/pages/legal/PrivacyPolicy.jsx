import { useTranslation } from 'react-i18next'
import LegalPageShell from './components/LegalPageShell.jsx'
import PrivacyDocument from './components/PrivacyDocument.jsx'
import heroImage from '../../assets/images/legal/privacy-hero.jpg'

const PrivacyPolicy = () => {
  const { t } = useTranslation()

  return (
    <LegalPageShell
      breadcrumbLabel={t('legal.privacy.breadcrumb')}
      heroImage={heroImage}
      heroImageAlt={t('legal.privacy.hero.imageAlt')}
      heroTitle={t('legal.privacy.hero.title')}
      heroSubtitle={t('legal.privacy.hero.subtitle')}
      moreInfoCards={[
        { id: 'cookies', href: '/cookies' },
        { id: 'terms', href: '/terms-and-conditions' },
      ]}
    >
      <PrivacyDocument />
    </LegalPageShell>
  )
}

export default PrivacyPolicy
