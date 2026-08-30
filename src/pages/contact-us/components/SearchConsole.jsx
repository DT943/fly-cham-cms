import { FiSearch } from 'react-icons/fi'
import useHelpSearch from '../hooks/useHelpSearch.js'

const SearchConsole = () => {
  const { query, handleQueryChange } = useHelpSearch()

  return (
    <div className="bg-[linear-gradient(to_top_right,#006080_35%,#00141A_100%)] rounded-2xl px-6 sm:px-10 md:px-14 py-8 flex flex-col gap-3 w-full">
      <label className="font-montserrat text-lg font-semibold text-[#fdfdfc]">
        Search Fly Cham help
      </label>
      <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-3.5">
        <FiSearch className="w-5 h-5 text-[#5f5f5c] flex-shrink-0" />
        <input
          type="text"
          className="w-full bg-transparent border-none outline-none font-montserrat text-sm text-[#3e3e3b] placeholder:text-[#5f5f5c]"
          placeholder="Search for help topics, questions or keywords"
          value={query}
          onChange={handleQueryChange}
        />
      </div>
    </div>
  )
}

export default SearchConsole
