import { useEffect, useState } from 'react'
import { CMS_TEXT_HOVER_CLASS, getTextStyleVars, colorVar } from '../../styles/cmsStyle.js'
import { typography } from '../../styles/typography.js'
import Dropdown from './Dropdown.jsx'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'
import useCurrentLanguage from '../hooks/useCurrentLanguage.js'

const UI = {
  en: {
    yearLabel: 'Filter issues by year',
    read: 'Read',
    new: 'New',
    issueLabel: 'Issue {{number}}',
  },
  ar: {
    yearLabel: 'تصفية الأعداد حسب السنة',
    read: 'اقرأ',
    new: 'جديد',
    issueLabel: 'العدد {{number}}',
  },
}

function formatIssueLabel(template, number) {
  return String(template || 'Issue {{number}}').replace(
    /\{\{\s*number\s*\}\}/g,
    String(number ?? ''),
  )
}

function yearsFromItems(items) {
  const years = []
  const seen = new Set()
  for (const item of items || []) {
    const year = String(item?.year || '').trim()
    if (!year || seen.has(year)) continue
    seen.add(year)
    years.push(year)
  }
  return years.sort((a, b) => Number(b) - Number(a) || String(b).localeCompare(String(a)))
}

const COLUMNS = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-4',
}

const CARD_GAP = {
  tight: 'gap-3',
  default: 'gap-4.5',
  loose: 'gap-6',
}

const CARD_RADIUS = {
  none: 'rounded-none',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
}

const SECTION_PADDING = {
  tight: 'py-4 md:py-6',
  default: 'py-6 md:py-10',
  loose: 'py-10 md:py-16',
}

const cx = (...parts) => parts.filter(Boolean).join(' ')

/**
 * Explore Marhaba — year-filtered grid of magazine issue covers. CMS-driven:
 * colours/weights/hover, columns, gap, panel background. Cards are whole-card
 * links (no nested backlinks). Title backlinks apply. Cover images come only
 * from the CMS; an empty cover URL renders no image.
 */
const ExploreMarhaba = ({
  title = '',
  items = [],
  columns = '3',
  cardGap = 'default',
  cardRadius = 'xl',
  sectionPadding = 'default',
  showYearFilter = true,
  showYearHeading = true,
  showSectionBg = false,
  sectionBg = '100',
  panelBg = '50',
  newBadgeBg = 'secondary-1',
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
  ...textStyle
}) => {
  const language = useCurrentLanguage()
  const ui = UI[language] || UI.en
  const years = yearsFromItems(items)
  const [year, setYear] = useState(years[0] || '')

  useEffect(() => {
    if (!years.length) {
      setYear('')
      return
    }
    if (!years.includes(year)) setYear(years[0])
  }, [years, year])

  if (!title && !items.length) return null

  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }
  const visible = items.filter((item) => String(item.year) === String(year))
  const radiusClass = CARD_RADIUS[cardRadius] || CARD_RADIUS.xl

  const inner = (
    <section
      className="flex flex-col gap-7 rounded-xl p-5 sm:p-8"
      style={{ backgroundColor: colorVar(panelBg) }}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        {title ? (
          <h2
            className={cx(typography.sectionTitle, 'm-0 lg:text-[28px]', CMS_TEXT_HOVER_CLASS)}
            style={getTextStyleVars(textStyle, 'titleColor', '700', 'semibold')}
          >
            <LinkedText text={title} {...linkProps} />
          </h2>
        ) : (
          <span />
        )}

        {showYearFilter && years.length ? (
          <Dropdown
            label={ui.yearLabel}
            value={year}
            onChange={setYear}
            options={years.map((option) => ({ value: option, label: String(option) }))}
            className="w-[154px] shrink-0"
          />
        ) : null}
      </div>

      <div className="flex flex-col gap-6">
        {showYearHeading && year ? (
          <h3
            className={cx(typography.itemTitle, 'm-0 lg:text-xl', CMS_TEXT_HOVER_CLASS)}
            style={getTextStyleVars(textStyle, 'cardTitleColor', 'primary-1', 'semibold')}
          >
            {year}
          </h3>
        ) : null}

        <ul
          className={cx(
            'm-0 grid list-none p-0',
            COLUMNS[String(columns)] || COLUMNS[3],
            CARD_GAP[cardGap] || CARD_GAP.default,
          )}
        >
          {visible.map((item, index) => {
            const cover = item.image
            const label = formatIssueLabel(ui.issueLabel, item.issue)
            return (
              <li key={item.id || `${item.year}-${item.issue}-${index}`}>
                <LocalizedLink
                  href={item.href || '/magazine-view'}
                  className="group flex flex-col gap-2.5 no-underline"
                  aria-label={`${label} — ${item.month}`}
                >
                  <div
                    className={cx(
                      'relative aspect-[293/347] overflow-hidden ',
                      radiusClass,
                    )}
                  >
                    {cover ? (
                      <img src={cover} alt="" className="absolute inset-0 size-full object-cover" />
                    ) : null}
                    <div className="absolute inset-0 flex items-center justify-center bg-secondary-2/20 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
                      <span className="text-2xl font-medium text-50">{ui.read}</span>
                    </div>
                    {item.isNew ? (
                      <span
                        className={cx('absolute start-0 top-3 px-2.5 py-2 text-sm', CMS_TEXT_HOVER_CLASS)}
                        style={{
                          backgroundColor: colorVar(newBadgeBg),
                          ...getTextStyleVars(textStyle, 'badgeText', '50', 'semibold'),
                        }}
                      >
                        {ui.new}
                      </span>
                    ) : null}
                  </div>
                  <div
                    className={cx('flex flex-col items-center gap-2.5 text-center', CMS_TEXT_HOVER_CLASS)}
                    style={getTextStyleVars(textStyle, 'cardDescriptionColor', '600', 'medium')}
                  >
                    <p className="m-0">{label}</p>
                    <p className="m-0">{item.month}</p>
                  </div>
                </LocalizedLink>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )

  const sectionClass = cx(
    SECTION_PADDING[sectionPadding] || '',
    showSectionBg ? 'rounded-2xl px-4 md:px-6' : '',
  )

  if (!sectionClass) return inner
  return (
    <div className={sectionClass} style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}>
      {inner}
    </div>
  )
}

export default ExploreMarhaba
