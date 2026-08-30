import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'
import { officeCities } from '../utils/officeLocations.js'
import useOfficeTabs from '../hooks/useOfficeTabs.js'
import OfficeList from './OfficeList.jsx'

const cityIds = officeCities.map((city) => city.id)

const OfficeTabs = () => {
  const { t } = useTranslation()
  const { activeId, setActiveId, onTabKeyDown, tabId, panelId, setTabRef } =
    useOfficeTabs(cityIds)

  return (
    <section>
      <div
        role="tablist"
        aria-label={t('offices.tabsLabel')}
        className="flex items-center gap-6 border-b border-200"
      >
        {officeCities.map((city) => {
          const isActive = city.id === activeId

          return (
            <button
              key={city.id}
              type="button"
              role="tab"
              id={tabId(city.id)}
              aria-selected={isActive}
              aria-controls={panelId(city.id)}
              tabIndex={isActive ? 0 : -1}
              ref={setTabRef(city.id)}
              onClick={() => setActiveId(city.id)}
              onKeyDown={(event) => onTabKeyDown(event, city.id)}
              className={`${typography.itemTitle} bg-transparent border-none cursor-pointer px-0 pb-2.5 m-0 -mb-px ${
                isActive
                  ? 'font-semibold text-primary-1 border-b-[3px] border-primary-1'
                  : 'font-medium text-600'
              }`}
            >
              {t(`offices.cities.${city.id}`)}
            </button>
          )
        })}
      </div>

      {officeCities.map((city) => {
        const isActive = city.id === activeId

        return (
          <div
            key={city.id}
            role="tabpanel"
            id={panelId(city.id)}
            aria-labelledby={tabId(city.id)}
            hidden={!isActive}
            className="pt-4"
          >
            {isActive && <OfficeList locationIds={city.locationIds} />}
          </div>
        )
      })}
    </section>
  )
}

export default OfficeTabs
