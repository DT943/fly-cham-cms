import { useEffect, useRef, useState } from 'react'
import { X } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import Container from '../../../components/Container.jsx'
import LocalizedLink from '../../../components/LocalizedLink.jsx'
import useAppSearch from '../../../search/hooks/useAppSearch.js'
import { headerHref } from '../headerStyle.js'
import searchIcon from '../../../../assets/icons/search.svg'
import searchButtonIcon from '../../../../assets/icons/search-button.svg'

const RESULT_LIMIT = 6

/**
 * Header search panel (Figma 39439:37653), opened by the header's magnifying
 * glass. Empty: quick links. Focused / typed: the placeholder becomes a small
 * label over the field. Typed: matches from the site search index as rows
 * (select → navigate). Enter / the Search button opens the top match.
 * Copy and quick links come from the header document (`search`).
 */
const HeaderSearch = ({ search, onClose }) => {
  const { t } = useTranslation()
  const inputRef = useRef(null)
  const [focused, setFocused] = useState(false)
  const { query, results, language, handleQueryChange, handleSelect } = useAppSearch()
  const hasQuery = query.trim().length > 0
  const hits = results.slice(0, RESULT_LIMIT)
  // Figma Variant2/3: the label sits above the value once the field is active.
  const raised = focused || query.length > 0

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const select = (hit) => {
    handleSelect(hit)
    onClose()
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (hits[0]) select(hits[0])
  }

  return (
    <div className="bg-background">
      <Container>
        {/*
          Starts where the header logo is visibly drawn, not at the container edge:
          the logo image (241×72) has transparent space around the mark — 23.5px
          before it, 59.5px after it (the RTL start side) — scaled with the logo
          box: <lg 160×44, lg 185×72, xl 241×72 (see Header.jsx).
        */}
        <div className="flex flex-col gap-[22px] pb-10 ps-[21px] pt-7 lg:pb-[52px] lg:ps-[18px] xl:ps-6 rtl:ps-[43px] rtl:lg:ps-[46px] rtl:xl:ps-[60px]">
          <div className="flex items-center gap-4 lg:gap-12">
            <form
              role="search"
              onSubmit={handleSubmit}
              className="flex min-w-0 flex-1 items-center gap-3 lg:max-w-[1132px]"
            >
              <label className="flex h-14 min-w-0 flex-1 cursor-text flex-col justify-center gap-1 rounded-lg border border-solid border-200 px-4 lg:h-[70px]">
                {raised ? (
                  <span aria-hidden className="text-[14px] leading-[normal] text-600">
                    {search.placeholder}
                  </span>
                ) : null}
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={handleQueryChange}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  aria-label={search.placeholder}
                  placeholder={raised ? '' : search.placeholder}
                  autoComplete="off"
                  className={`w-full min-w-0 border-0 bg-transparent p-0 font-medium leading-[normal] outline-none placeholder:text-600 focus:outline-none focus:ring-0 [&::-webkit-search-cancel-button]:hidden ${
                    raised ? 'text-[16px] text-700' : 'text-[16px] lg:text-[20px]'
                  }`}
                />
              </label>
              <button
                type="submit"
                className="flex h-14 shrink-0 cursor-pointer items-center justify-center gap-2.5 rounded-lg border-0 bg-secondary px-4 text-[18px] font-semibold leading-[normal] text-700 transition-colors hover:bg-secondary-800 lg:h-[70px] lg:w-[151px]"
              >
                <span className="hidden sm:inline">{search.buttonLabel}</span>
                <img src={searchButtonIcon} alt="" aria-hidden width={18} height={18} className="block shrink-0" />
              </button>
            </form>

            <button
              type="button"
              onClick={onClose}
              aria-label={t('layout.header.closeSearch')}
              className="flex shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-700"
            >
              <X size={24} weight="regular" />
            </button>
          </div>

          {hasQuery ? (
            hits.length ? (
              <ul className="m-0 flex list-none flex-col gap-4 p-0">
                {hits.map((hit, index) => (
                  <li key={hit.id}>
                    <button
                      type="button"
                      onClick={() => select(hit)}
                      className={`flex w-full cursor-pointer items-center gap-5 rounded-none border-0 bg-transparent p-2.5 text-start transition-colors hover:bg-100 ${
                        index < hits.length - 1 ? 'border-b border-solid border-200' : ''
                      }`}
                    >
                      <span className="flex size-5 shrink-0 items-center justify-center">
                        <img src={searchIcon} alt="" aria-hidden width={18} height={18} className="block" />
                      </span>
                      <span className="min-w-0 truncate text-[16px] font-medium leading-[normal] text-700">
                        {hit.title?.[language] || hit.title?.en}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="m-0 text-[16px] leading-[normal] text-600">{search.emptyText}</p>
            )
          ) : search.quickLinks.length ? (
            <div className="flex flex-col gap-5">
              {search.quickLinksTitle ? (
                <p className="m-0 text-[16px] leading-[normal] text-600">{search.quickLinksTitle}</p>
              ) : null}
              <ul className="m-0 flex list-none flex-col gap-4 p-0">
                {search.quickLinks.map((link) => (
                  <li key={link.id}>
                    <LocalizedLink
                      to={headerHref(link.href)}
                      onClick={onClose}
                      className="text-[16px] font-medium leading-[normal] text-primary-1 no-underline hover:underline"
                    >
                      {link.label}
                    </LocalizedLink>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </Container>
    </div>
  )
}

export default HeaderSearch
