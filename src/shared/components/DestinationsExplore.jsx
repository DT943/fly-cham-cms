import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { typography } from '../../styles/typography.js'
import {
  colorVar,
  getButtonStyle,
  getTextStyleVars,
  CMS_TEXT_HOVER_CLASS,
} from '../../styles/cmsStyle.js'
import LinkedText from './backlinks/LinkedText.jsx'
import DestinationCard from '../../pages/our-destinations/components/DestinationCard.jsx'
import FeaturedDestination from '../../pages/our-destinations/components/FeaturedDestination.jsx'
import DestinationsPagination from '../../pages/our-destinations/components/DestinationsPagination.jsx'

const cx = (...parts) => parts.filter(Boolean).join(' ')

const SECTION_PADDING_CLASS = {
  tight: 'py-4 md:py-6',
  default: '',
  loose: 'py-10 md:py-16',
}

const GRID_CLASS = 'lg:grid-cols-2 xl:grid-cols-3'

// Cards per grid page when pagination is on — the source design's 3 × 4 grid.
const DEFAULT_PAGE_SIZE = 12

const resolvePageSize = (value) => {
  const n = parseInt(value, 10)
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_PAGE_SIZE
}

// `ofLabel` is the word before the page count. Older blocks stored it with a
// hard-coded count ("of 25"); the count is dropped so the real total shows.
const ofWord = (label) => String(label || '').replace(/\s*\d+\s*$/, '').trim()

/**
 * Grid pagination. Off (or everything fits on one page) → all cards, one page.
 * `page` is clamped so a shrinking card list or a bigger page size never
 * leaves the grid on an empty page.
 */
const paginateCards = (cards, { enabled, pageSize, page }) => {
  const list = Array.isArray(cards) ? cards : []
  const paginate = Boolean(enabled) && list.length > pageSize
  const totalPages = paginate ? Math.ceil(list.length / pageSize) : 1
  const currentPage = Math.min(Math.max(Number(page) || 1, 1), totalPages)
  const visible = paginate
    ? list.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : list
  return { paginate, totalPages, currentPage, visible }
}

const linkStyle = (style) => ({
  linkColor: style.linkColor,
  linkHoverColor: style.linkHoverColor,
  linkFontWeight: style.linkFontWeight,
  linkUnderline: style.linkUnderline,
  linkItalic: style.linkItalic,
})

/**
 * CMS-driven "Explore destinations" block — a featured destination card beside
 * a grid of destination cards, with pagination. Reuses the same child
 * components as the static /our-destinations page; every style key falls
 * through to the source look when unset. Mirrors flychamadmin cms2's renderer.
 */
const DestinationsExplore = ({
  title,
  subtitle,
  activitiesLabel,
  featured = {},
  cards = [],
  pagination = {},
  links = [],
  showLinks = true,
  showTitle = true,
  showSubtitle = true,
  showFeatured = true,
  showPagination = true,
  pageSize = String(DEFAULT_PAGE_SIZE),
  showSectionBg = false,
  sectionBg = '100',
  sectionPadding = 'default',
  cardRadius = 'lg',
  cardIataColor = '100',
  cardTitleColor = '100',
  cardButtonBg = 'primary-1',
  cardButtonTextColor = '100',
  cardButtonTextFontWeight = 'semibold',
  cardButtonBgHover,
  cardButtonTextColorHover,
  cardButtonTextFontWeightHover,
  cardActivitiesColor = '50',
  featuredButtonBg = 'primary-1',
  featuredButtonText = 'white',
  featuredButtonTextFontWeight = 'semibold',
  featuredButtonBgHover,
  featuredButtonTextHover,
  featuredButtonTextFontWeightHover,
  ...rest
}) => {
  const { t, i18n } = useTranslation()
  const style = { showLinks, ...rest }
  const [page, setPage] = useState(1)
  const gridRef = useRef(null)
  // The featured card is separate content; only the grid cards are paged.
  const { paginate, totalPages, currentPage, visible } = paginateCards(cards, {
    enabled: showPagination,
    pageSize: resolvePageSize(pageSize),
    page,
  })
  const ofText = `${ofWord(pagination.ofLabel) || (i18n.dir() === 'rtl' ? 'من' : 'of')} ${totalPages}`

  const goToPage = (next) => {
    setPage(next)
    // Paging from the pager below the grid: bring the grid's top back into view.
    if (gridRef.current?.getBoundingClientRect().top < 0) {
      gridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Card CTA (destination guide): the card hover reveals it. Its own fill stays put.
  const cardBtn = getButtonStyle(
    {
      cardButtonBg,
      cardButtonBgHover,
      cardButtonTextColor,
      cardButtonTextColorHover,
      cardButtonTextFontWeight,
      cardButtonTextFontWeightHover,
    },
    {
      bgKey: 'cardButtonBg',
      bgFallback: 'primary-1',
      textKey: 'cardButtonTextColor',
      textFallback: '100',
      weightFallback: 'semibold',
    },
  )
  cardBtn.style['--cms-bgh'] = cardBtn.style.backgroundColor
  const cardBtnClass = cardBtn.className
  // Featured Discover button keeps its fill; the card does not tint it on hover.
  const featuredBtn = getButtonStyle(
    {
      featuredButtonBg,
      featuredButtonBgHover,
      featuredButtonText,
      featuredButtonTextHover,
      featuredButtonTextFontWeight,
      featuredButtonTextFontWeightHover,
    },
    {
      bgKey: 'featuredButtonBg',
      bgFallback: 'primary-1',
      textKey: 'featuredButtonText',
      textFallback: 'white',
      weightFallback: 'semibold',
    },
  )
  featuredBtn.style['--cms-bgh'] = featuredBtn.style.backgroundColor

  const paddingClass = SECTION_PADDING_CLASS[sectionPadding] ?? SECTION_PADDING_CLASS.default
  const featuredImages = Array.isArray(featured.images)
    ? featured.images.filter(Boolean)
    : []

  return (
    <section
      className={cx(
        'flex flex-col gap-6',
        paddingClass,
        showSectionBg && 'rounded-2xl px-4 md:px-6',
      )}
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      {(showTitle && title) || (showSubtitle && subtitle) ? (
        <div className="flex flex-col gap-2 md:gap-3">
          {showTitle && title ? (
            <h2
              className={cx('m-0', typography.sectionTitle, CMS_TEXT_HOVER_CLASS)}
              style={getTextStyleVars(style, 'titleColor', '800', 'semibold')}
            >
              <LinkedText text={title} links={links} enabled={showLinks} {...linkStyle(style)} />
            </h2>
          ) : null}
          {showSubtitle && subtitle ? (
            <p
              className={cx(typography.caption, 'm-0 leading-relaxed', CMS_TEXT_HOVER_CLASS)}
              style={getTextStyleVars(style, 'subtitleColor', '700', 'normal')}
            >
              <LinkedText text={subtitle} links={links} enabled={showLinks} {...linkStyle(style)} />
            </p>
          ) : null}
        </div>
      ) : null}

      <div ref={gridRef} className="flex scroll-mt-24 flex-col lg:flex-row gap-4 items-stretch">
        {showFeatured && (
          <FeaturedDestination
            country={featured.country}
            title={featured.title}
            heading={featured.heading}
            description={featured.description}
            cta={featured.ctaLabel}
            activities={activitiesLabel}
            href={featured.href}
            activitiesHref={featured.activitiesHref}
            images={featuredImages}
            imageAlt={featured.imageAlt}
            buttonClassName={featuredBtn.className}
            buttonStyle={featuredBtn.style}
          />
        )}

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <h3
            className={cx('m-0 text-base font-semibold lg:hidden', CMS_TEXT_HOVER_CLASS)}
            style={getTextStyleVars(style, 'titleColor', '800', 'semibold')}
          >
            {t('destinations.explore.routes')}
          </h3>
          <div className={cx('grid grid-cols-1', GRID_CLASS, 'gap-4')}>
          {visible.map((card, index) => (
            <div
              key={card.id || index}
              className="animate-[fadeUp_0.4s_ease-out_both] motion-reduce:animate-none"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <DestinationCard
                country={card.country}
                title={card.title}
                image={card.imageUrl}
                imageAlt={card.imageAlt}
                cta={card.ctaLabel}
                activities={activitiesLabel}
                href={card.href}
                activitiesHref={card.activitiesHref}
                radius={cardRadius}
                iataColor={cardIataColor}
                titleColor={cardTitleColor}
                buttonBg={cardButtonBg}
                buttonTextColor={cardButtonTextColor}
                buttonClassName={cardBtnClass}
                buttonStyle={cardBtn.style}
                activitiesColor={cardActivitiesColor}
              />
            </div>
          ))}
          </div>
        </div>
      </div>

      {paginate && (
        <DestinationsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          previousLabel={pagination.previousLabel}
          nextLabel={pagination.nextLabel}
          ofText={ofText}
        />
      )}
    </section>
  )
}

export default DestinationsExplore
