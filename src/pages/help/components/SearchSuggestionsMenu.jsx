import { FiSearch } from 'react-icons/fi'
import { typography } from '../../../styles/typography.js'

const SearchSuggestionsMenu = ({ items, onSelect, getLabel }) => {
  if (!items.length) return null

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
            <span>{getLabel(item)}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}

export default SearchSuggestionsMenu
