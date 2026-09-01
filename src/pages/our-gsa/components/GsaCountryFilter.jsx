import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'
import { gsaCountries } from '../utils/gsaLocations.js'

const GsaCountryFilter = ({ activeId, onSelect, label }) => {
  const { t } = useTranslation()

  return (
    <div
      role="tablist"
      aria-label={label}
      className="flex flex-wrap gap-2"
    >
      {gsaCountries.map((country) => {
        const isActive = country.id === activeId

        return (
          <button
            key={country.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(country.id)}
            className={`${typography.caption} m-0 cursor-pointer font-medium rounded-lg px-4 py-2 md:px-5 whitespace-nowrap border border-solid ${isActive
                ? 'bg-primary-1 text-white border-none '
                : 'bg-white text-primary-1 border-primary-1  '
              }`}
          >
            {t(`gsa.countries.${country.id}`)}
          </button>
        )
      })}
    </div>
  )
}

export default GsaCountryFilter
