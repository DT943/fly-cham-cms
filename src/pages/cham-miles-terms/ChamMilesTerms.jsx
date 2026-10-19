import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../../shared/components/Breadcrumbs.jsx'
import Container from '../../shared/components/Container.jsx'
import LegalMoreInfo from '../../shared/components/LegalMoreInfo.jsx'
import PageMediaHero from '../../shared/components/PageMediaHero.jsx'
import ChamMilesTermsBody from './components/ChamMilesTermsBody.jsx'

const HERO_IMAGE =
  'https://xbqrfakpcisqunyugrqt.supabase.co/storage/v1/object/public/cms-media/travel-updates/hero.webp'

/** Cham Miles Terms — `/legal/cham-miles-terms`. */
const ChamMilesTerms = () => {
  const { t } = useTranslation()

  const moreInfoCards = useMemo(
    () => [
      {
        id: 'terms',
        icon: 'shield',
        title: t('chamMilesTerms.moreInfo.terms.title'),
        description: t('chamMilesTerms.moreInfo.terms.description'),
        cta: t('chamMilesTerms.moreInfo.terms.cta'),
        href: '/legal/terms-and-conditions',
      },
      {
        id: 'cookies',
        icon: 'cookie',
        title: t('chamMilesTerms.moreInfo.cookies.title'),
        description: t('chamMilesTerms.moreInfo.cookies.description'),
        cta: t('chamMilesTerms.moreInfo.cookies.cta'),
        href: '/legal/cookies',
      },
    ],
    [t],
  )

  return (
    <main className="w-full bg-100 pb-0">
      <div className="flex flex-col gap-6 pt-5 pb-10 md:gap-8 md:pt-10 md:pb-16">
        <Container>
          <Breadcrumbs
            items={[
              { label: t('common.home'), href: '/' },
              { label: t('legal.hub.breadcrumb'), href: '/legal' },
              { label: t('chamMilesTerms.breadcrumb') },
            ]}
          />
        </Container>

        <PageMediaHero
          image={HERO_IMAGE}
          imageAlt={t('chamMilesTerms.hero.imageAlt')}
          title={t('chamMilesTerms.title')}
          subtitle={t('chamMilesTerms.hero.subtitle')}
          height="compact"
          overlayWidth="wide"
          titleSize="compact"
        />

        <ChamMilesTermsBody />
      </div>

      <LegalMoreInfo title={t('legal.moreInfoTitle')} cards={moreInfoCards} />
    </main>
  )
}

export default ChamMilesTerms
