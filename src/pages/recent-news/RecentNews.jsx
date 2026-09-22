import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../../shared/components/Breadcrumbs.jsx'
import Container from '../../shared/components/Container.jsx'
import MediaNewsletterSignup from '../media-center/components/MediaNewsletterSignup.jsx'
import RecentNewsFilters from './components/RecentNewsFilters.jsx'
import RecentNewsHeader from './components/RecentNewsHeader.jsx'
import RecentNewsListing from './components/RecentNewsListing.jsx'

const RecentNews = () => {
  const { t } = useTranslation()
  const [activeTopic, setActiveTopic] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  const breadcrumbs = [
    { label: t('common.home'), href: '/' },
    { label: t('mediaCenter.breadcrumb'), href: '/media-center' },
    { label: t('recentNews.breadcrumb') },
  ]

  const handleTopicChange = (topic) => {
    setActiveTopic(topic)
    setCurrentPage(1)
  }

  return (
    <main className="bg-100 w-full pb-12 md:pb-16">
      <Container className="pt-5 md:pt-10 pb-4 md:pb-6 min-w-0">
        <Breadcrumbs items={breadcrumbs} />
      </Container>

      <Container className="flex flex-col gap-10 pt-6 md:gap-14 md:pt-8">
        <div className="flex flex-col gap-6 md:gap-8">
          <RecentNewsHeader />
          <RecentNewsFilters activeTopic={activeTopic} onTopicChange={handleTopicChange} />
        </div>

        <RecentNewsListing
          activeTopic={activeTopic}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </Container>

      <MediaNewsletterSignup layout="fullBleed" />
    </main>
  )
}

export default RecentNews
