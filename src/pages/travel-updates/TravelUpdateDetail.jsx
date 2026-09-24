import { Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../../shared/components/Breadcrumbs.jsx'
import Container from '../../shared/components/Container.jsx'
import useCurrentLanguage from '../../shared/hooks/useCurrentLanguage.js'
import useLocalizedRoute from '../../shared/routing/hooks/useLocalizedRoute.js'
import { withLanguage } from '../../i18n/languages.js'
import TravelUpdateDetailContent from './components/TravelUpdateDetailContent.jsx'
import TravelUpdateDetailHeader from './components/TravelUpdateDetailHeader.jsx'
import TravelUpdateDetailSidebar from './components/TravelUpdateDetailSidebar.jsx'
import {
  getTravelUpdateDetail,
  getTravelUpdateSlug,
} from './utils/travelUpdates.js'

/**
 * Dynamic Travel Update detail — `/travel-updates/{slug}`.
 */
const TravelUpdateDetail = () => {
  const { t } = useTranslation()
  const { pagePath } = useLocalizedRoute()
  const language = useCurrentLanguage()
  const slug = getTravelUpdateSlug(pagePath)
  const update = getTravelUpdateDetail(slug)

  if (!update) {
    return <Navigate to={withLanguage('/travel-updates', language)} replace />
  }

  const copy = `travelUpdates.detail.${update.id}`
  const breadcrumbs = [
    { label: t('common.home'), href: '/' },
    { label: t('travelUpdates.breadcrumb'), href: '/travel-updates' },
    { label: t(`${copy}.title`) },
  ]

  const badge = t('travelUpdates.detail.shared.badge', {
    type: t(`travelUpdates.detail.shared.badgeTypes.${update.badge}`),
    date: t(`travelUpdates.dates.${update.dateKey}`),
  })

  return (
    <main className="w-full min-w-0 bg-100 pb-12 md:pb-16">
      <Container className="min-w-0 pb-4 pt-5 md:pb-6 md:pt-10">
        <Breadcrumbs items={breadcrumbs} />
      </Container>

      <Container className="flex min-w-0 flex-col gap-8 pt-2 md:gap-10 md:pt-4">
        <TravelUpdateDetailHeader
          badge={badge}
          title={t(`${copy}.title`)}
          subtitle={t(`${copy}.subtitle`)}
        />

        <div className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)] lg:gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(17rem,22rem)]">
          <TravelUpdateDetailContent update={update} />
          <TravelUpdateDetailSidebar update={update} />
        </div>
      </Container>
    </main>
  )
}

export default TravelUpdateDetail
