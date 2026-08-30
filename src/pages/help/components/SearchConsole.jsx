import { useEffect, useRef } from 'react'
import { FiSearch } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'
import useHelpSearch from '../hooks/useHelpSearch.js'
import SearchSuggestionsMenu from './SearchSuggestionsMenu.jsx'

const SearchConsole = () => {
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
    closeMenu,
  } = useHelpSearch()

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
        {t('help.search.label')}
      </label>
      <div ref={containerRef} className="relative w-full">
        <div className="flex items-center gap-3 bg-background rounded-full md:rounded-lg ps-4 pe-1.5 py-1.5 md:py-1.5">
          <FiSearch className="w-5 h-5 text-600 shrink-0" />
          <input
            type="text"
            className={`w-full bg-transparent border-none outline-none ${typography.body} text-700 placeholder:text-600`}
            placeholder={t('help.search.placeholder')}
            value={query}
            onChange={handleQueryChange}
            onFocus={handleFocus}
          />
          <button
            type="button"
            className={`${typography.button} shrink-0 font-semibold text-700 bg-secondary hover:bg-secondary-800 border-none rounded-lg px-6 py-2 cursor-pointer transition-colors`}
          >
            {t('help.search.submit')}
          </button>
        </div>
        {isMenuOpen && (
          <SearchSuggestionsMenu
            items={suggestions}
            getLabel={(item) => item[language] || item.en}
            onSelect={(item) => handleSelect(item[language] || item.en)}
          />
        )}
      </div>
    </div>
  )
}

export default SearchConsole
