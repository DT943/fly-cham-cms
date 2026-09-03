import { FiSearch } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'
import SearchResultChip from './SearchResultChip.jsx'

function chipKey(type) {
  return type === 'faq' || type === 'form' ? type : 'page'
}

const SearchResultsMenu = ({ items, language, onSelect }) => {
  const { t } = useTranslation()

  if (!items.length) {
    return (
      <div className="absolute top-full left-0 right-0 w-full z-20 mt-1.5 box-border bg-background rounded-xl shadow-[0_8px_28px_rgba(0,0,0,0.14)] px-5 py-4">
        <p className={`${typography.body} text-600 m-0`}>{t('help.search.empty')}</p>
      </div>
    )
  }

  return (
    <ul className="absolute top-full left-0 right-0 w-full z-20 mt-1.5 max-h-72 overflow-y-auto overscroll-contain list-none m-0 p-0 box-border bg-background rounded-xl shadow-[0_8px_28px_rgba(0,0,0,0.14)]">
      {items.map((item, index) => (
        <li key={item.id} className="w-full">
          {index > 0 && <div className="border-t border-200 mx-4" />}
          <button
            type="button"
            className={`flex items-center gap-3 w-full px-5 py-4 text-start bg-transparent border-none cursor-pointer hover:bg-100 ${typography.body} text-700`}
            onClick={() => onSelect(item)}
          >
            <FiSearch className="w-4 h-4 text-700 shrink-0" />
            <span className="flex-1 min-w-0 truncate">{item.title?.[language] || item.title?.en}</span>
            <SearchResultChip
              type={item.type}
              label={t(`help.search.chips.${chipKey(item.type)}`)}
            />
          </button>
        </li>
      ))}
    </ul>
  )
}

export default SearchResultsMenu
