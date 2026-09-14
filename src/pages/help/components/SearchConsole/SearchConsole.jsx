import { useEffect, useId, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { typography } from '../../../../styles/typography.js'
import {
  RADIUS,
  WEIGHT,
  SECTION_PADDING,
  PANEL_PADDING,
  GRADIENT_DIR,
  colorVar,
} from '../../../../styles/cmsStyle.js'
import useAppSearch from '../../../../shared/search/hooks/useAppSearch.js'
import SearchField from './SearchField.jsx'
import PopularTopics from './PopularTopics.jsx'
import { cx } from './cx.js'

const SearchConsole = ({
  label,
  placeholder,
  submit,
  popularLabel,
  popularItems = [],
  onQueryChange,
  showSuggestions = true,
  types,
  href,
  showChips = false,
  showLabel = true,
  showSubmit = true,
  showPopular = true,
  showSearchIcon = true,
  showSectionBg = false,
  sectionBg = '100',
  sectionPadding = 'default',
  inputBg = 'background',
  inputTextColor = '700',
  submitBg = 'secondary',
  submitTextColor = '700',
  submitFontWeight = 'semibold',
  labelColor = '50',
  labelFontWeight = 'semibold',
  chipTextColor = '50',
  chipBorderColor = '50',
  popularLabelColor = '50',
  gradientFrom = 'primary-1',
  gradientTo = 'secondary-2',
  gradientDirection = 'topRight',
  panelRadius = '2xl',
  panelPadding = 'default',
}) => {
  const { t, i18n } = useTranslation()
  const inputId = useId()
  const containerRef = useRef(null)
  const search = useAppSearch({ types, href })

  const resolvedLabel = label ?? t('help.search.label')
  const resolvedPlaceholder = placeholder ?? t('help.search.placeholder')
  const resolvedSubmit = showSubmit
    ? (submit === undefined ? t('help.search.submit') : submit)
    : null

  const selectHit = (hit) => {
    search.handleSelect(hit)
    onQueryChange?.(hit.title?.[search.language] || hit.title?.en || '')
  }

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) search.closeMenu()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [search.closeMenu])

  const dir = i18n.dir() === 'rtl' ? 'rtl' : 'ltr'
  const gradientAngle = GRADIENT_DIR[gradientDirection]?.[dir] || GRADIENT_DIR.topRight[dir]

  return (
    <section
      className={cx(
        SECTION_PADDING[sectionPadding],
        showSectionBg && 'rounded-2xl px-4 md:px-6',
      )}
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      <div
        className={cx(
          'flex w-full flex-col gap-4',
          RADIUS[panelRadius] || RADIUS['2xl'],
          PANEL_PADDING[panelPadding] || PANEL_PADDING.default,
        )}
        style={{
          backgroundImage: `linear-gradient(${gradientAngle}, ${colorVar(gradientFrom)} 35%, ${colorVar(gradientTo)} 100%)`,
        }}
      >
        {showLabel && (
          <label
            htmlFor={inputId}
            className={cx(typography.itemTitle, WEIGHT[labelFontWeight] || 'font-semibold')}
            style={{ color: colorVar(labelColor) }}
          >
            {resolvedLabel}
          </label>
        )}

        <SearchField
          inputId={inputId}
          containerRef={containerRef}
          query={search.query}
          results={search.results}
          isMenuOpen={search.isMenuOpen}
          language={search.language}
          placeholder={resolvedPlaceholder}
          submitLabel={resolvedSubmit}
          showSearchIcon={showSearchIcon}
          showSuggestions={showSuggestions}
          showChips={showChips}
          inputBg={inputBg}
          inputTextColor={inputTextColor}
          submitBg={submitBg}
          submitTextColor={submitTextColor}
          submitFontWeight={submitFontWeight}
          ariaLabel={showLabel ? undefined : resolvedLabel}
          onQueryChange={(value, event) => {
            search.handleQueryChange(event)
            onQueryChange?.(value)
          }}
          onFocus={search.handleFocus}
          onSelect={selectHit}
        />

        {showPopular && popularItems.length > 0 && (
          <PopularTopics
            label={popularLabel}
            items={popularItems}
            labelColor={popularLabelColor}
            chipTextColor={chipTextColor}
            chipBorderColor={chipBorderColor}
            onSelect={(value) => {
              search.applyQuery(value)
              onQueryChange?.(value)
            }}
          />
        )}
      </div>
    </section>
  )
}

export default SearchConsole
