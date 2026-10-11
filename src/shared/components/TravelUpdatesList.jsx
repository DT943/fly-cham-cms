import { useState } from 'react'
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { CMS_TEXT_HOVER_CLASS, getTextStyleVars, colorVar } from '../../styles/cmsStyle.js'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'

const SECTION_PADDING = {
  none: '',
  tight: 'py-4 md:py-6',
  default: '',
  loose: 'py-10 md:py-16',
}

const cx = (...parts) => parts.filter(Boolean).join(' ')

const resolvePageSize = (value) => {
  const n = parseInt(value, 10)
  return Number.isFinite(n) && n > 0 ? n : 4
}

/**
 * CMS-driven Travel Updates feed (Figma list card + pagination): white cards
 * (date badge, title, description, optional Learn More when `href` is set)
 * stacked 24px apart, paginated client-side once the item count exceeds
 * `pageSize`. Not full-bleed — PageBlocks wraps it in the page Container.
 * Defaults mirror the cms2 DEFAULT_TRAVEL_UPDATES_LIST_STYLE tokens.
 */
const TravelUpdatesList = ({
  learnMoreLabel = '',
  items = [],
  pageSize = '4',
  showPagination = true,
  sectionPadding = 'default',
  showSectionBg = false,
  sectionBg = '100',
  cardBg = '50',
  badgeBg = '100',
  learnMoreBg = 'primary-1',
  learnMoreArrowColor = 'white',
  activePageBg = 'primary-1',
  activePageColor = 'white',
  pageBg = 'white',
  pageColor = 'primary-1',
  arrowBg = 'primary-1',
  arrowColor = 'white',
  arrowDisabledBg = '400',
  accentTitleColor = 'primary-1',
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
  ...textStyle
}) => {
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState(1)
  // Latest News pill hover: label turns white unless a distinct hover color is set.
  const lmStyle = {
    ...textStyle,
    learnMoreColorHover:
      textStyle.learnMoreColorHover && textStyle.learnMoreColorHover !== textStyle.learnMoreColor
        ? textStyle.learnMoreColorHover
        : '50',
  }
  const accentStyle = {
    ...textStyle,
    cardTitleColor: accentTitleColor,
    cardTitleColorHover: accentTitleColor,
  }

  if (!items.length) return null

  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }

  const size = resolvePageSize(pageSize)
  const paginate = showPagination !== false && items.length > size
  const totalPages = paginate ? Math.ceil(items.length / size) : 1
  const page = Math.min(Math.max(currentPage, 1), totalPages)
  const visible = paginate ? items.slice((page - 1) * size, page * size) : items
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)
  const prevDisabled = page <= 1
  const nextDisabled = page >= totalPages

  const arrowStyle = (disabled) => ({
    backgroundColor: colorVar(disabled ? arrowDisabledBg : arrowBg),
    color: colorVar(arrowColor),
    opacity: disabled ? 0.3 : 1,
  })

  const inner = (
    <div className="flex min-w-0 flex-col">
      <div className="flex flex-col gap-6">
        {visible.map((item, index) => (
          <article
            key={item.id ? `${item.id}-${index}` : index}
            className="flex flex-col gap-4 rounded-[12px] p-5 sm:p-8"
            style={{ backgroundColor: colorVar(cardBg) }}
          >
            {item.date ? (
              <span
                className={cx(
                  'w-fit rounded-[4px] p-[10px] text-sm uppercase leading-[normal]',
                  CMS_TEXT_HOVER_CLASS,
                )}
                style={{
                  backgroundColor: colorVar(badgeBg),
                  ...getTextStyleVars(textStyle, 'badgeText', '600', 'semibold'),
                }}
              >
                {item.date}
              </span>
            ) : null}

            {item.title ? (
              <h3
                className={cx('m-0 text-xl leading-[normal] md:text-2xl', CMS_TEXT_HOVER_CLASS)}
                style={getTextStyleVars(
                  item.accentTitle ? accentStyle : textStyle,
                  'cardTitleColor',
                  '700',
                  'semibold',
                )}
              >
                <LinkedText text={item.title} {...linkProps} />
              </h3>
            ) : null}

            {item.description ? (
              <p
                className={cx('m-0 text-[15px] leading-[1.5]', CMS_TEXT_HOVER_CLASS)}
                style={getTextStyleVars(textStyle, 'cardDescriptionColor', '700', 'normal')}
              >
                <LinkedText text={item.description} {...linkProps} />
              </p>
            ) : null}

            {item.href ? (
              <LocalizedLink href={item.href} className="group/lm relative inline-flex h-[34px] w-fit items-center overflow-hidden rounded-full no-underline">
                <span
                  aria-hidden
                  className="absolute inset-y-0 start-0 w-[34px] rounded-full transition-[width] duration-300 ease-out group-hover/lm:w-full"
                  style={{ backgroundColor: colorVar(learnMoreBg) }}
                />
                <span className="relative z-10 flex size-[34px] shrink-0 items-center justify-center">
                  <ArrowRight
                    size={16}
                    className="rtl:-scale-x-100"
                    style={{ color: colorVar(learnMoreArrowColor) }}
                  />
                </span>
                {learnMoreLabel ? (
                  <span
                    className={cx('cms-lm-label relative z-10 pe-3 ps-2.5 text-sm leading-[normal] transition-[color,font-weight] duration-300', CMS_TEXT_HOVER_CLASS)}
                    style={getTextStyleVars(lmStyle, 'learnMoreColor', 'primary-1', 'semibold')}
                  >
                    {learnMoreLabel}
                  </span>
                ) : null}
              </LocalizedLink>
            ) : null}
          </article>
        ))}
      </div>

      {paginate ? (
        <div className="pt-6">
          <nav aria-label="Pagination" className="flex items-center justify-center gap-5">
            <button
              type="button"
              aria-label={t('travelUpdates.pagination.previous')}
              disabled={prevDisabled}
              onClick={() => setCurrentPage(page - 1)}
              className={cx(
                'flex size-9 shrink-0 items-center justify-center rounded-full border-0 p-0',
                prevDisabled ? 'cursor-default' : 'cursor-pointer',
              )}
              style={arrowStyle(prevDisabled)}
            >
              <ArrowLeft size={16} className="rtl:-scale-x-100" />
            </button>

            <div className="flex items-center gap-2">
              {pages.map((p) => {
                const isActive = p === page
                return (
                  <button
                    key={p}
                    type="button"
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => setCurrentPage(p)}
                    className={cx(
                      'flex size-8 shrink-0 items-center justify-center rounded-[28px] border-0 p-0 text-sm font-medium leading-[normal]',
                      isActive ? 'cursor-default' : 'cursor-pointer',
                    )}
                    style={{
                      backgroundColor: colorVar(isActive ? activePageBg : pageBg),
                      color: colorVar(isActive ? activePageColor : pageColor),
                    }}
                  >
                    {p}
                  </button>
                )
              })}
            </div>

            <button
              type="button"
              aria-label={t('travelUpdates.pagination.next')}
              disabled={nextDisabled}
              onClick={() => setCurrentPage(page + 1)}
              className={cx(
                'flex size-9 shrink-0 items-center justify-center rounded-full border-0 p-0',
                nextDisabled ? 'cursor-default' : 'cursor-pointer',
              )}
              style={arrowStyle(nextDisabled)}
            >
              <ArrowRight size={16} className="rtl:-scale-x-100" />
            </button>
          </nav>
        </div>
      ) : null}
    </div>
  )

  const sectionClass = cx(
    SECTION_PADDING[sectionPadding] ?? SECTION_PADDING.default,
    showSectionBg ? 'rounded-2xl px-4 md:px-6' : '',
  )

  if (!sectionClass) return inner
  return (
    <div className={sectionClass} style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}>
      {inner}
    </div>
  )
}

export default TravelUpdatesList
