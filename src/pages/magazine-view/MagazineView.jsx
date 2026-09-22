import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../../shared/components/Breadcrumbs.jsx'
import Container from '../../shared/components/Container.jsx'
import { typography } from '../../styles/typography.js'
import MagazineFlipBook from './components/MagazineFlipBook.jsx'

const MagazineView = () => {
  const { t } = useTranslation()

  const breadcrumbs = [
    { label: t('common.home'), href: '/' },
    { label: t('mediaCenter.breadcrumb'), href: '/media-center' },
    { label: t('magazineView.breadcrumb') },
  ]

  return (
    <main className="bg-100 w-full pb-12 md:pb-16">
      <Container className="min-w-0 pt-5 pb-4 md:pt-10 md:pb-6">
        <Breadcrumbs items={breadcrumbs} />
      </Container>

      <Container className="flex flex-col gap-6 pt-2 md:gap-8 md:pt-4">
        <header className="flex flex-col gap-2 md:gap-3">
          <h1 className={`m-0 font-semibold text-primary-1 ${typography.pageTitle}`}>
            {t('magazineView.title')}
          </h1>
          <p className={`m-0 max-w-3xl font-normal leading-relaxed text-700 ${typography.sectionDescription}`}>
            {t('magazineView.description')}
          </p>
        </header>

        <MagazineFlipBook />
      </Container>
    </main>
  )
}

export default MagazineView
