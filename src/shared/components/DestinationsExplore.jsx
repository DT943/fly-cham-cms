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
import {
  destinations as bundledDestinations,
  featuredImages as bundledFeaturedImages,
} from '../../pages/our-destinations/utils/destinations.js'

const cx = (...parts) => parts.filter(Boolean).join(' ')

// Bundled photo per destination id — the fallback when the CMS has no image,
// so the public page matches the source without a CMS asset host.
const DEFAULT_IMAGE_BY_ID = Object.fromEntries(
  bundledDestinations.map((d) => [d.id, d.image]),
)

const SECTION_PADDING_CLASS = {
  tight: 'py-4 md:py-6',
  default: 'py-6 md:py-10',
  loose: 'py-10 md:py-16',
}

const GRID_CLASS = 'sm:grid-cols-2 xl:grid-cols-3'

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
  const style = { showLinks, ...rest }

  // Card CTA: built-in hover is a 90% fade, dropped once a hover bg is chosen.
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
  const cardBtnClass = cx(cardBtn.className, !cardButtonBgHover && 'hover:opacity-90')
  // Featured CTA: built-in hover is the background at 90% (bg-primary-1/90).
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
  if (!featuredButtonBgHover) {
    featuredBtn.style['--cms-bgh'] =
      `color-mix(in oklab, ${featuredBtn.style.backgroundColor} 90%, transparent)`
  }

  const paddingClass = SECTION_PADDING_CLASS[sectionPadding] ?? SECTION_PADDING_CLASS.default
  const featuredImages = featured.images?.length ? featured.images : bundledFeaturedImages

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
              className={cx(typography.caption, 'm-0 leading-relaxed max-w-3xl', CMS_TEXT_HOVER_CLASS)}
              style={getTextStyleVars(style, 'subtitleColor', '700', 'normal')}
            >
              <LinkedText text={subtitle} links={links} enabled={showLinks} {...linkStyle(style)} />
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-col lg:flex-row gap-4 items-stretch">
        {showFeatured && (
          <FeaturedDestination
            country={featured.country}
            title={featured.title}
            heading={featured.heading}
            description={featured.description}
            cta={featured.ctaLabel}
            activities={activitiesLabel}
            href={featured.href}
            images={featuredImages}
            imageAlt={featured.imageAlt}
            buttonClassName={featuredBtn.className}
            buttonStyle={featuredBtn.style}
          />
        )}

        <div className={cx('grid grid-cols-1', GRID_CLASS, 'gap-4 flex-1 min-w-0')}>
          {cards.map((card, index) => (
            <div
              key={card.id || index}
              className="animate-[fadeUp_0.4s_ease-out_both] motion-reduce:animate-none"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <DestinationCard
                iata={card.iata}
                title={card.title}
                image={card.imageUrl || DEFAULT_IMAGE_BY_ID[card.id]}
                imageAlt={card.imageAlt}
                cta={card.ctaLabel}
                activities={activitiesLabel}
                href={card.href}
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

      {showPagination && (
        <DestinationsPagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          previousLabel={pagination.previousLabel}
          nextLabel={pagination.nextLabel}
          ofLabel={pagination.ofLabel}
        />
      )}
    </section>
  )
}

export default DestinationsExplore
