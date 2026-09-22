import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../../../shared/components/Breadcrumbs.jsx'
import Container from '../../../shared/components/Container.jsx'
import PageMediaHero from '../../../shared/components/PageMediaHero.jsx'
import LegalMoreInfo from './LegalMoreInfo.jsx'

/**
 * The common frame for the three legal pages (Terms, Privacy, Cookies):
 * breadcrumbs, the shared media hero, a body slot, and the
 * "Get more information" band. Only the body differs between pages.
 */
const LegalPageShell = ({
  breadcrumbLabel,
  heroImage,
  heroImageAlt,
  heroTitle,
  heroSubtitle,
  moreInfoCards,
  children,
}) => {
  const { t } = useTranslation()

  const breadcrumbs = [
    { label: t('common.home'), href: '/' },
    { label: breadcrumbLabel },
  ]

  return (
    <main className="bg-100 w-full">
      <Container className="pt-5 md:pt-10 pb-4 md:pb-6 min-w-0">
        <Breadcrumbs items={breadcrumbs} />
      </Container>

      <PageMediaHero
        image={heroImage}
        imageAlt={heroImageAlt}
        title={heroTitle}
        subtitle={heroSubtitle}
      />

      <Container className="py-10 md:py-14">{children}</Container>

      <LegalMoreInfo cards={moreInfoCards} />
    </main>
  )
}

export default LegalPageShell
