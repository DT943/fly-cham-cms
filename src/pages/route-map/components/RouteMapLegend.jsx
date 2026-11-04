import { useTranslation } from 'react-i18next'

const NETWORK = '#006080'
const NEW_ROUTE = '#baa981'

/** Bottom-right map key: network pins vs new-route pins. */
const RouteMapLegend = () => {
  const { t } = useTranslation()

  return (
    <aside
      className="pointer-events-none absolute start-3 top-3 z-[450] rounded-lg border border-solid border-200 bg-50 px-3 py-2 shadow-[0_4px_16px_rgba(1,38,59,0.12)] md:start-auto md:top-auto md:bottom-4 md:end-4"
      aria-label={t('routeMap.legend.label')}
    >
      <ul className="m-0 flex list-none flex-col gap-1.5 p-0 text-xs font-medium text-700">
        <li className="flex items-center gap-2">
          <span
            className="size-2.5 shrink-0 rounded-full"
            style={{ background: NETWORK }}
            aria-hidden
          />
          {t('routeMap.legend.network')}
        </li>
        <li className="flex items-center gap-2">
          <span
            className="size-2.5 shrink-0 rounded-full"
            style={{ background: NEW_ROUTE }}
            aria-hidden
          />
          {t('routeMap.legend.newRoutes')}
        </li>
      </ul>
    </aside>
  )
}

export default RouteMapLegend
