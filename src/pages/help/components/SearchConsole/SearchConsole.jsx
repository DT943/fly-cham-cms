import { useEffect, useId, useRef } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { typography } from '../../../../styles/typography.js'
import {
  RADIUS,
  SECTION_PADDING,
  PANEL_PADDING,
  GRADIENT_DIR,
  CMS_TEXT_HOVER_CLASS,
  colorVar,
  getTextStyleVars,
} from '../../../../styles/cmsStyle.js'
import useAppSearch from '../../../../shared/search/hooks/useAppSearch.js'
import LinkedText from '../../../../shared/components/backlinks/LinkedText.jsx'
import SearchField from './SearchField.jsx'
import PopularTopics from './PopularTopics.jsx'
import { cx } from './cx.js'
import { stripLanguage } from '../../../../i18n/languages.js'
import { trackHelpSearch } from '../../../../shared/analytics/cmsEvents.js'

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
  inputTextColorHover,
  inputTextFontWeightHover,
  submitBg = 'secondary',
  submitBgHover,
  submitTextColor = '700',
  submitFontWeight = 'semibold',
  submitTextFontWeight,
  submitTextColorHover,
  submitTextFontWeightHover,
  labelColor = '50',
  labelFontWeight = 'semibold',
  labelColorHover,
  labelFontWeightHover,
  chipTextColor = '50',
  chipTextColorHover,
  chipTextFontWeightHover,
  chipBorderColor = '50',
  popularLabelColor = '50',
  popularLabelColorHover,
  popularLabelFontWeightHover,
  gradientFrom = 'primary-1',
  gradientTo = 'secondary-2',
  gradientDirection = 'topRight',
  panelRadius = '2xl',
  panelPadding = 'default',
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
}) => {
  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }
  const labelStyleKeys = {
    labelColor,
    labelFontWeight,
    labelColorHover,
    labelFontWeightHover,
  }
  const { t, i18n } = useTranslation()
  const { pathname } = useLocation()
  const helpSearch = stripLanguage(pathname).startsWith('/help')
  const inputId = useId()
  const containerRef = useRef(null)
  const search = useAppSearch({ types, href })
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const initialQuery = searchParams.get('q')
    if (initialQuery) search.applyQuery(initialQuery)
    // Pre-fill once from the URL, the same way the old search page did.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
            className={cx(typography.itemTitle, CMS_TEXT_HOVER_CLASS)}
            style={getTextStyleVars(labelStyleKeys, 'labelColor', '50', 'semibold')}
          >
            <LinkedText text={resolvedLabel} {...linkProps} />
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
          inputTextColorHover={inputTextColorHover}
          inputTextFontWeightHover={inputTextFontWeightHover}
          submitBg={submitBg}
          submitBgHover={submitBgHover}
          submitTextColor={submitTextColor}
          submitFontWeight={submitTextFontWeight ?? submitFontWeight}
          submitTextColorHover={submitTextColorHover}
          submitTextFontWeightHover={submitTextFontWeightHover}
          ariaLabel={showLabel ? undefined : resolvedLabel}
          onQueryChange={(value, event) => {
            search.handleQueryChange(event)
            onQueryChange?.(value)
          }}
          onFocus={search.handleFocus}
          onSelect={selectHit}
          onCommitSearch={(value, resultList) => {
            if (!helpSearch) return
            trackHelpSearch({
              queryLength: String(value || '').trim().length,
              hasResults: Array.isArray(resultList) && resultList.length > 0,
            })
          }}
        />

        {showPopular && popularItems.length > 0 && (
          <PopularTopics
            label={popularLabel}
            items={popularItems}
            labelColor={popularLabelColor}
            labelColorHover={popularLabelColorHover}
            labelFontWeightHover={popularLabelFontWeightHover}
            chipTextColor={chipTextColor}
            chipTextColorHover={chipTextColorHover}
            chipTextFontWeightHover={chipTextFontWeightHover}
            chipBorderColor={chipBorderColor}
            linkProps={linkProps}
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
