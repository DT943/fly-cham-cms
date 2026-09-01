import { useEffect, useRef } from 'react'
import { FiSearch } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'
import useHelpSearch from '../hooks/useHelpSearch.js'
import SearchSuggestionsMenu from './SearchSuggestionsMenu.jsx'

const SearchConsole = ({
  label,
  placeholder,
  submit,
  popularLabel,
  popularItems = [],
  onQueryChange,
  showSuggestions = true,
}) => {
  const { t, i18n } = useTranslation()
  const language = (i18n.resolvedLanguage || i18n.language || 'en').split('-')[0]
  const containerRef = useRef(null)
  const {
    query,
    suggestions,
    isMenuOpen,
    handleQueryChange,
    handleFocus,
    handleSelect,
    applyQuery,
    closeMenu,
  } = useHelpSearch()

  const resolvedLabel = label ?? t('help.search.label')
  const resolvedPlaceholder = placeholder ?? t('help.search.placeholder')
  const resolvedSubmit = submit === undefined ? t('help.search.submit') : submit

  useEffect(() => {
    function handlePointerDown(event) {
      if (!containerRef.current?.contains(event.target)) closeMenu()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [closeMenu])

  return (
    <div className="ltr:bg-[linear-gradient(to_top_right,var(--color-primary-1)_35%,var(--color-secondary-2)_100%)] rtl:bg-[linear-gradient(to_top_left,var(--color-primary-1)_35%,var(--color-secondary-2)_100%)] rounded-2xl px-4 py-5 sm:px-10 md:px-14 sm:py-8 flex flex-col gap-3 w-full">
      <label className={`${typography.itemTitle} font-semibold text-50`}>
        {resolvedLabel}
      </label>
      <div ref={containerRef} className="relative w-full">
        <div className={`flex items-center gap-3 bg-background ${resolvedSubmit ? 'rounded-full md:rounded-lg pe-1.5 py-1.5' : 'rounded-lg pe-4 py-3'} ps-4`}>
          <FiSearch className="w-5 h-5 text-600 shrink-0" />
          <input
            type="text"
            className={`w-full bg-transparent border-none outline-none ${typography.body} text-700 placeholder:text-600`}
            placeholder={resolvedPlaceholder}
            value={query}
            onChange={(event) => {
              handleQueryChange(event)
              onQueryChange?.(event.target.value)
            }}
            onFocus={showSuggestions ? handleFocus : undefined}
          />
          {resolvedSubmit && (
            <button
              type="button"
              className={`${typography.button} shrink-0 font-semibold text-700 bg-secondary hover:bg-secondary-800 border-none rounded-lg px-6 py-2 cursor-pointer transition-colors`}
            >
              {resolvedSubmit}
            </button>
          )}
        </div>
        {showSuggestions && isMenuOpen && (
          <SearchSuggestionsMenu
            items={suggestions}
            getLabel={(item) => item[language] || item.en}
            onSelect={(item) => handleSelect(item[language] || item.en)}
          />
        )}
      </div>
      {popularItems.length > 0 && (
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 pt-1">
          {popularLabel && (
            <span className={`${typography.caption} text-50 font-medium whitespace-nowrap`}>
              {popularLabel}
            </span>
          )}
          <div className="flex flex-wrap items-center gap-2">
            {popularItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  const value = item.query || item.label
                  applyQuery(value)
                  onQueryChange?.(value)
                }}
                className={`${typography.caption} text-50 bg-transparent border border-50 rounded-full px-4 py-1.5 cursor-pointer whitespace-nowrap hover:bg-50/10 transition-colors`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchConsole
