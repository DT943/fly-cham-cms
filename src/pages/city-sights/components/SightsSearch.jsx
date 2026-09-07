import { MagnifyingGlass } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'

const SightsSearch = () => {
  const { t } = useTranslation()

  return (
    <form
      role="search"
      onSubmit={(event) => event.preventDefault()}
      className="flex w-full items-center gap-3 rounded-2xl border-[1.5px] border-solid border-[#e0e0de] bg-white p-2 drop-shadow-[0_10px_15px_rgba(0,0,0,0.05)]"
    >
      <div className="flex min-w-0 flex-1 items-center gap-2 py-3 pe-1 ps-3 md:gap-3 md:pe-3 md:ps-5">
        <MagnifyingGlass size={22} className="shrink-0 text-600" />
        <input
          type="search"
          aria-label={t('citySights.search.label')}
          placeholder={t('citySights.search.placeholder')}
          className={`min-w-0 flex-1 border-0 bg-transparent p-0 ${typography.body} text-800 placeholder:text-600 focus:outline-none focus:ring-0`}
        />
      </div>
      <button
        type="submit"
        aria-label={t('citySights.search.label')}
        className="flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center rounded-lg border-0 bg-secondary transition-colors hover:bg-secondary-800 md:w-21"
      >
        <MagnifyingGlass size={22} className="text-50" />
      </button>
    </form>
  )
}

export default SightsSearch
