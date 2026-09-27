import { useTranslation } from 'react-i18next'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'
import { typography } from '../../../styles/typography.js'

/**
 * Right sidebar — hub statuses + useful resource links.
 */
const TravelUpdateDetailSidebar = ({ update }) => {
  const { t } = useTranslation()
  const copy = `travelUpdates.detail.${update.id}`

  return (
    <aside className="flex h-fit flex-col gap-6 rounded-2xl border border-200 bg-50 p-5 sm:p-6">
      {update.hubs?.length ? (
        <div className="flex flex-col gap-4">
          <h2 className={`m-0 font-semibold text-800 ${typography.itemTitle}`}>
            {t('travelUpdates.detail.shared.hubStatus')}
          </h2>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {update.hubs.map((hub) => (
              <li
                key={hub.id}
                className={`flex items-start justify-between gap-3 ${typography.body}`}
              >
                <span className="font-medium text-800">
                  {t(`${copy}.hubs.${hub.id}.name`)}
                </span>
                <span
                  className={`shrink-0 text-end font-semibold uppercase tracking-wide ${typography.caption} ${
                    hub.tone === 'normal' ? 'text-primary-1' : 'text-secondary-800'
                  }`}
                >
                  {t(`${copy}.hubs.${hub.id}.status`)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {update.hubs?.length && update.resources?.length ? (
        <div aria-hidden className="h-px w-full bg-200" />
      ) : null}

      {update.resources?.length ? (
        <div className="flex flex-col gap-4">
          <h2 className={`m-0 font-semibold text-800 ${typography.itemTitle}`}>
            {t('travelUpdates.detail.shared.resources')}
          </h2>
          <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
            {update.resources.map((resource) => (
              <li key={resource.id}>
                <LocalizedLink
                  href={resource.href}
                  className={`font-medium text-primary-1 underline underline-offset-2 hover:opacity-80 ${typography.body}`}
                >
                  {t(`travelUpdates.detail.shared.resourceLinks.${resource.id}`)}
                </LocalizedLink>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </aside>
  )
}

export default TravelUpdateDetailSidebar
