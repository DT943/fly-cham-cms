import { FiSearch } from 'react-icons/fi'
import {
  RADIUS,
  CMS_TEXT_HOVER_CLASS,
  colorVar,
  getButtonStyle,
  getTextStyleVars,
} from '../../../../styles/cmsStyle.js'
import { typography } from '../../../../styles/typography.js'
import SearchResultsMenu from '../../../../shared/search/components/SearchResultsMenu.jsx'
import { cx } from './cx.js'

const SearchField = ({
  inputId,
  containerRef,
  query,
  results,
  isMenuOpen,
  language,
  placeholder,
  submitLabel,
  showSearchIcon,
  showSuggestions,
  showChips,
  inputBg,
  inputTextColor,
  inputTextColorHover,
  inputTextFontWeightHover,
  submitBg,
  submitBgHover,
  submitTextColor,
  submitFontWeight,
  submitTextColorHover,
  submitTextFontWeightHover,
  ariaLabel,
  onQueryChange,
  onFocus,
  onSelect,
}) => {
  const submitFirstResult = () => {
    if (results[0]) onSelect(results[0])
  }

  const inputTextStyleKeys = {
    inputTextColor,
    inputTextColorHover,
    inputTextFontWeightHover,
  }
  const submitButtonStyle = getButtonStyle(
    {
      submitBg,
      submitBgHover,
      submitTextColor,
      submitTextFontWeight: submitFontWeight,
      submitTextColorHover,
      submitTextFontWeightHover,
    },
    {
      bgKey: 'submitBg',
      bgFallback: 'secondary',
      textKey: 'submitTextColor',
      textFallback: '700',
      weightFallback: 'semibold',
    },
  )

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className={cx(
          'flex items-center gap-3 ps-4',
          RADIUS.lg,
          submitLabel ? 'pe-3 py-2.5 md:pe-1.5 md:py-1.5' : 'pe-4 py-3',
        )}
        style={{ backgroundColor: colorVar(inputBg) }}
      >
        {showSearchIcon && (
          <FiSearch className="size-5 shrink-0 text-600" aria-hidden="true" />
        )}
        <input
          id={inputId}
          type="text"
          autoComplete="off"
          aria-label={ariaLabel}
          className={cx(
            'w-full border-none bg-transparent outline-none',
            typography.body,
            'placeholder:text-600',
            CMS_TEXT_HOVER_CLASS,
          )}
          style={getTextStyleVars(inputTextStyleKeys, 'inputTextColor', '700', 'normal')}
          placeholder={placeholder}
          value={query}
          onChange={(event) => onQueryChange(event.target.value, event)}
          onFocus={showSuggestions ? onFocus : undefined}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && results[0]) {
              event.preventDefault()
              onSelect(results[0])
            }
          }}
        />
        {submitLabel && (
          <button
            type="button"
            onClick={submitFirstResult}
            className={cx(
              'hidden shrink-0 cursor-pointer border-none px-6 py-2 md:inline-flex',
              RADIUS.lg,
              typography.button,
              // Legacy look: dims on hover until a hover background is set.
              !submitBgHover && 'hover:opacity-90',
              submitButtonStyle.className,
            )}
            style={submitButtonStyle.style}
          >
            {submitLabel}
          </button>
        )}
      </div>
      {showSuggestions && isMenuOpen && (
        <SearchResultsMenu
          items={results}
          language={language}
          onSelect={onSelect}
          showChips={showChips}
        />
      )}
    </div>
  )
}

export default SearchField
