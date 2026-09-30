import { Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../../shared/components/Breadcrumbs.jsx'
import Container from '../../shared/components/Container.jsx'
import useCurrentLanguage from '../../shared/hooks/useCurrentLanguage.js'
import useLocalizedRoute from '../../shared/routing/hooks/useLocalizedRoute.js'
import { withLanguage } from '../../i18n/languages.js'
import DynamicPage from '../dynamic-page/DynamicPage.jsx'
import TravelUpdateDetailContent from './components/TravelUpdateDetailContent.jsx'
import TravelUpdateDetailHeader from './components/TravelUpdateDetailHeader.jsx'
import TravelUpdateDetailSidebar from './components/TravelUpdateDetailSidebar.jsx'
import {
  getTravelUpdateDetail,
  getTravelUpdateSlug,
  travelUpdateCmsSlug,
} from './utils/travelUpdates.js'

/**
 * Travel Update detail — `/travel-updates/{slug}`. Renders the CMS page
 * `travel-update-<kebab slug>` (breadcrumbs + travel-update-hero +
 * travel-update-detail blocks) and falls back to the static page below while
 * an update has no CMS page yet.
 */
const TravelUpdateDetail = () => {
  const { pagePath } = useLocalizedRoute()
  const slug = getTravelUpdateSlug(pagePath)

  return (
    <DynamicPage
      key={slug}
      slug={travelUpdateCmsSlug(slug)}
      className="bg-100 w-full pb-7 md:pb-10"
      gapClass="gap-6 md:gap-[37px] [&>*:nth-child(3)]:mt-4 md:[&>*:nth-child(3)]:mt-[61px]"
      fallback={<StaticTravelUpdateDetail />}
    />
  )
}

/** Static (i18n) detail page — used for updates without a CMS page. */
const StaticTravelUpdateDetail = () => {
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
