import { FiSearch } from 'react-icons/fi'
import useHelpSearch from '../hooks/useHelpSearch.js'

const SearchConsole = () => {
  const { query, handleQueryChange } = useHelpSearch()

  return (
    <div className="bg-[linear-gradient(to_top_right,var(--color-primary-1)_35%,var(--color-secondary-2)_100%)] rounded-2xl px-6 sm:px-10 md:px-14 py-8 flex flex-col gap-3 w-full">
      <label className="text-lg font-semibold text-50">
        Search Fly Cham help
      </label>
      <div className="flex items-center gap-3 bg-background rounded-lg px-4 py-3.5">
        <FiSearch className="w-5 h-5 text-600 flex-shrink-0" />
        <input
          type="text"
          className="w-full bg-transparent border-none outline-none text-sm text-700 placeholder:text-600"
          placeholder="Search for help topics, questions or keywords"
          value={query}
          onChange={handleQueryChange}
        />
      </div>
    </div>
  )
}

export default SearchConsole
