import { FiSearch } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'
import useHelpSearch from '../hooks/useHelpSearch.js'

const SearchConsole = () => {
  const { t } = useTranslation()
  const { query, handleQueryChange } = useHelpSearch()

  return (
    <div className="ltr:bg-[linear-gradient(to_top_right,var(--color-primary-1)_35%,var(--color-secondary-2)_100%)] rtl:bg-[linear-gradient(to_top_left,var(--color-primary-1)_35%,var(--color-secondary-2)_100%)] rounded-2xl px-4 py-5 sm:px-10 md:px-14 sm:py-8 flex flex-col gap-3 w-full">
      <label className={`${typography.itemTitle} font-semibold text-50`}>
        {t('help.search.label')}
      </label>
      <div className="flex items-center gap-3 bg-background rounded-full md:rounded-lg px-4 py-3 md:py-3.5">
        <FiSearch className="w-5 h-5 text-600 flex-shrink-0" />
        <input
          type="text"
          className={`w-full bg-transparent border-none outline-none ${typography.body} text-700 placeholder:text-600`}
          placeholder={t('help.search.placeholder')}
          value={query}
          onChange={handleQueryChange}
        />
      </div>
    </div>
  )
}

export default SearchConsole
