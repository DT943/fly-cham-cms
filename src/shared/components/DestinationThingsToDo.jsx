import { resolvePhosphorIcon } from '../../cms/adapters/phosphorIcons'
import {
  ArrowRight,
  ShoppingCart,
  PersonSimpleWalk,
  Binoculars,
  Buildings,
  GlobeHemisphereWest,
  MapPin,
  Camera,
  ForkKnife,
  Mountains,
  Storefront,
} from '@phosphor-icons/react'
import { CMS_TEXT_HOVER_CLASS, getTextStyleVars, colorVar } from '../../styles/cmsStyle.js'
import { typography } from '../../styles/typography.js'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'
import thingOnePhoto from '../../assets/images/things-to-do-in-damascus/thing-1.jpg'
import thingTwoPhoto from '../../assets/images/things-to-do-in-damascus/thing-2.jpg'
import thingThreePhoto from '../../assets/images/things-to-do-in-damascus/thing-3.jpg'
import placeholderPhoto from '../../assets/images/our-destenations/ph3.jpg'

const ICON_BY_NAME = {
  shoppingCart: ShoppingCart,
  walk: PersonSimpleWalk,
  binoculars: Binoculars,
  buildings: Buildings,
  globe: GlobeHemisphereWest,
  mapPin: MapPin,
  camera: Camera,
  food: ForkKnife,
  mountains: Mountains,
  storefront: Storefront,
}

/** Seed images keyed by card id — mirror the cms2 defaults so an un-uploaded card previews. */
const IMAGE_BY_ID = {
  souk: thingThreePhoto,
  oldCity: thingTwoPhoto,
  umayyadMosque: thingOnePhoto,
}

const COLUMNS = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

const CARD_GAP = {
  tight: 'gap-4 lg:gap-6',
  default: 'gap-6 lg:gap-9',
  loose: 'gap-8 lg:gap-12',
}

const CARD_RADIUS = {
  none: 'rounded-none',
  sm: 'rounded-xl',
  lg: 'rounded-2xl',
  full: 'rounded-3xl',
}

const SECTION_PADDING = {
  tight: 'py-4 md:py-6',
  default: 'py-6 md:py-10',
  loose: 'py-10 md:py-16',
}

const cx = (...parts) => parts.filter(Boolean).join(' ')

/**
 * Things-to-do image cards for a destination (heading + grid + CTA). Every card
 * is a full-bleed photo with a bottom wash, a badge pill (label + icon), a title
 * and an optional description. CMS-driven: colours/weights/hover, columns, gap,
 * radius and the wash are all controllable, with defaults matching the source.
 */
const DestinationThingsToDo = ({
  title = '',
  subtitle = '',
  cta = '',
  ctaHref = '',
  items = [],
  showHeader = true,
  showSubtitle = true,
  showCta = true,
  columns = 3,
  cardGap = 'default',
  cardRadius = 'lg',
  sectionPadding = 'default',
  showSectionBg = false,
  sectionBg = '100',
  overlayColor = 'secondary-2',
  badgeBorderColor = '50',
  buttonBg = 'secondary',
  buttonText = 'btn',
  buttonTextFontWeight = 'semibold',
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
  ...textStyle
}) => {
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
  const colKey = String(columns)
  const gapClass = CARD_GAP[cardGap] || CARD_GAP.default
  const radiusClass = CARD_RADIUS[cardRadius] || CARD_RADIUS.lg
  const overlay = colorVar(overlayColor)
  const headerVisible = showHeader && (title || (showSubtitle && subtitle))
  const ctaVisible = showCta && Boolean(cta)

  const inner = (
    <section className="flex flex-col gap-6 lg:gap-8">
      {headerVisible ? (
        <div className="flex flex-col gap-2">
          {title ? (
            <h2
              className={cx(typography.sectionTitle, 'm-0', CMS_TEXT_HOVER_CLASS)}
              style={getTextStyleVars(textStyle, 'titleColor', '700', 'semibold')}
            >
              <LinkedText text={title} {...linkProps} />
            </h2>
          ) : null}
          {showSubtitle && subtitle ? (
            <p
              className={cx(typography.sectionDescription, 'm-0 max-w-3xl', CMS_TEXT_HOVER_CLASS)}
              style={getTextStyleVars(textStyle, 'subtitleColor', '800', 'normal')}
            >
              <LinkedText text={subtitle} {...linkProps} />
            </p>
          ) : null}
        </div>
      ) : null}

      <div className={cx('grid', COLUMNS[colKey] || COLUMNS[3], gapClass)}>
        {items.map((item, index) => {
          const src = item.image || IMAGE_BY_ID[item.id] || placeholderPhoto
          const BadgeIcon = ICON_BY_NAME[item.icon] || resolvePhosphorIcon(item.icon)
          return (
            <article
              key={item.id || index}
              className={cx('group/card relative h-100 overflow-hidden', radiusClass)}
            >
              <img
                src={src}
                alt={item.imageAlt || ''}
                className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover/card:scale-105 motion-reduce:transition-none motion-reduce:group-hover/card:scale-100"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `linear-gradient(to top, ${overlay} 0%, color-mix(in srgb, ${overlay} 80%, transparent) 30%, transparent 55%)`,
                }}
              />

              <span
                className="absolute start-4 top-5 inline-flex items-center gap-2 rounded-full border border-solid px-2.5 py-1 backdrop-blur-sm"
                style={{
                  borderColor: colorVar(badgeBorderColor),
                  backgroundColor: `color-mix(in srgb, ${overlay} 10%, transparent)`,
                }}
              >
                <span
                  className={cx(typography.caption, CMS_TEXT_HOVER_CLASS)}
                  style={getTextStyleVars(textStyle, 'badgeText', '50', 'semibold')}
                >
                  <LinkedText text={item.badge} {...linkProps} />
                </span>
                <BadgeIcon
                  size={18}
                  className="shrink-0"
                  style={{ color: getTextStyleVars(textStyle, 'badgeText', '50', 'semibold').color }}
                />
              </span>

              <div className="absolute inset-x-4 bottom-5 flex flex-col gap-1">
                <h3
                  className={cx(typography.itemTitle, 'm-0', CMS_TEXT_HOVER_CLASS)}
                  style={getTextStyleVars(textStyle, 'cardTitleColor', 'secondary', 'semibold')}
                >
                  <LinkedText text={item.title} {...linkProps} />
                </h3>
                {item.description ? (
                  <p
                    className={cx(typography.itemDescription, 'm-0 leading-relaxed', CMS_TEXT_HOVER_CLASS)}
                    style={getTextStyleVars(textStyle, 'cardDescriptionColor', '50', 'normal')}
                  >
                    <LinkedText text={item.description} {...linkProps} />
                  </p>
                ) : null}
              </div>
            </article>
          )
        })}
      </div>

      {ctaVisible ? (
        <div className="flex justify-center">
          <LocalizedLink
            href={ctaHref || '#'}
            className={cx(
              typography.button,
              CMS_TEXT_HOVER_CLASS,
              'inline-flex w-fit cursor-pointer items-center justify-center gap-2 rounded-lg border-none px-6 py-3 no-underline transition-opacity duration-200 ease-out hover:opacity-90 motion-reduce:transition-none md:px-8 md:py-4',
            )}
            style={{
              backgroundColor: colorVar(buttonBg),
              ...getTextStyleVars({ buttonText, buttonTextFontWeight }, 'buttonText', 'btn', 'semibold'),
            }}
          >
            {cta}
            <ArrowRight size={16} weight="bold" className="rtl:-scale-x-100" />
          </LocalizedLink>
        </div>
      ) : null}
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

export default DestinationThingsToDo
