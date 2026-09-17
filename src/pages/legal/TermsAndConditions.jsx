import { useTranslation } from 'react-i18next'
import LegalPageShell from './components/LegalPageShell.jsx'
import LegalDocument from './components/LegalDocument.jsx'
import heroImage from '../../assets/images/legal/terms-hero.jpg'

const TermsAndConditions = () => {
  const { t } = useTranslation()

  return (
    <LegalPageShell
      breadcrumbLabel={t('legal.terms.breadcrumb')}
      heroImage={heroImage}
      heroImageAlt={t('legal.terms.hero.imageAlt')}
      heroTitle={t('legal.terms.hero.title')}
      heroSubtitle={t('legal.terms.hero.subtitle')}
      moreInfoCards={[
        { id: 'privacy', href: '/legal/privacy-policy' },
        { id: 'cookies', href: '/legal/cookies' },
      ]}
    >
      <LegalDocument baseKey="legal.terms" activeId="terms" />
    </LegalPageShell>
  )
}

export default TermsAndConditions
