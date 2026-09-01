import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'
import { gsaCountries } from '../utils/gsaLocations.js'

const GsaCountryFilter = ({ activeId, onSelect, label }) => {
  const { t } = useTranslation()
  const tabRefs = useRef({})

  useEffect(() => {
    tabRefs.current[activeId]?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    })
  }, [activeId])

  return (
    <div
      role="tablist"
      aria-label={label}
      className="flex flex-nowrap md:flex-wrap gap-2 overflow-x-auto overflow-y-hidden pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      {gsaCountries.map((country) => {
        const isActive = country.id === activeId

        return (
          <button
            key={country.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            ref={(node) => {
              tabRefs.current[country.id] = node
            }}
            onClick={() => onSelect(country.id)}
            className={`${typography.caption} m-0 cursor-pointer font-medium rounded-lg px-4 py-2 md:px-5 whitespace-nowrap shrink-0 border border-solid ${
              isActive
                ? 'bg-primary-1 text-50 border-primary-1'
                : 'bg-background text-primary-1 border-primary-1'
            }`}
          >
            <span className="md:hidden">{t(`gsa.countriesShort.${country.id}`)}</span>
            <span className="hidden md:inline">{t(`gsa.countries.${country.id}`)}</span>
          </button>
        )
      })}
    </div>
  )
}

export default GsaCountryFilter
