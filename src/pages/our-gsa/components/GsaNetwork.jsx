import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'
import { gsaLocations } from '../utils/gsaLocations.js'
import useGsaSelection from '../hooks/useGsaSelection.js'
import GsaCountryFilter from './GsaCountryFilter.jsx'
import GsaMap from './GsaMap.jsx'
import GsaOfficeCard from './GsaOfficeCard.jsx'

const GsaNetwork = () => {
  const { t } = useTranslation()
  const { countryId, setCountryId, locationIds, officeId, setOfficeId } =
    useGsaSelection()

  return (
    <section className="flex flex-col gap-4 md:gap-6">
      <div className="flex flex-col gap-3 md:gap-4">
        <h2 className={`${typography.sectionTitle} font-semibold text-700 m-0`}>
          {t('gsa.network.title')}
        </h2>
        <GsaCountryFilter
          activeId={countryId}
          onSelect={setCountryId}
          label={t('gsa.network.countriesLabel')}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] gap-4 md:gap-6 items-start">
        <GsaMap
          locationIds={locationIds}
          selectedId={officeId}
          onSelect={setOfficeId}
        />
        <div className="flex flex-col gap-4 w-full">
          {locationIds.map((id) => (
            <GsaOfficeCard
              key={id}
              locationId={id}
              office={gsaLocations[id]}
              isSelected={id === officeId}
              onSelect={setOfficeId}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default GsaNetwork
