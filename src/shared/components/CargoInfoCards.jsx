import { ArrowRight } from '@phosphor-icons/react'
import { CMS_TEXT_HOVER_CLASS, getTextStyleVars, colorVar } from '../../styles/cmsStyle.js'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'

// Class maps mirror flychamadmin cms2 CargoInfoCards/utils/style.js byte-for-byte.
const COLUMNS = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

const CARD_GAP = { tight: 'gap-3', default: 'gap-4', loose: 'gap-6' }

const CARD_RADIUS = {
  none: 'rounded-none',
  sm: 'rounded-[9.335px]',
  lg: 'rounded-2xl',
  xl: 'rounded-3xl',
}

const SECTION_PADDING = {
  none: '',
  tight: 'py-4 md:py-6',
  default: '',
  loose: 'py-10 md:py-16',
}

// Pinned px sizes from the Figma spec — identical in cms2.
const TITLE_SIZE = 'text-2xl leading-[normal] lg:text-[28px]'
const CARD_TITLE_SIZE = 'text-lg leading-[normal] lg:text-[22px]'
const CARD_DESCRIPTION_SIZE = 'text-sm leading-[22.452px]'
const CTA_SIZE = 'text-base leading-[normal]'
// Card hover motion standard (Figma prototype): 500ms soft ease-out, 1.041 zoom.
const IMAGE_MOTION =
  'transition-transform duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] group-hover:scale-[1.041]'

const OVERLAY_WASH = {
  backgroundImage:
    'linear-gradient(to right, #01263b 0%, rgba(1,38,59,0.82) 34%, rgba(1,38,59,0.35) 62%, transparent 82%)',
}

const cx = (...parts) => parts.filter(Boolean).join(' ')

/**
 * Cargo Service "More information to know" — a heading above a grid of
 * image-top cards (title, description, and a full-width footer link row with
 * the label at the start and an arrow at the end). CMS-driven; defaults match
 * the Figma design. Only the footer row is an anchor, so backlinks apply to
 * the title and card title/description. Not full-bleed: PageBlocks wraps it
 * in the page Container.
 */
const CargoInfoCards = ({
  title = '',
  cards = [],
  showHeader = true,
  columns = 3,
  cardGap = 'default',
  cardRadius = 'sm',
  sectionPadding = 'none',
  showSectionBg = false,
  sectionBg = '100',
  cardBg = '50',
  arrowColor = 'primary-1',
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
  ...textStyle
}) => {
  if (!cards.length) return null

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
  const radiusClass = CARD_RADIUS[cardRadius] || CARD_RADIUS.sm
  const cardIsOverlay = (card) =>
    textStyle.cardLayout === 'overlay' ||
    (textStyle.cardLayout !== 'top' && (card.id === 'request' || cards.length === 1))
  const featured = cards.find(cardIsOverlay)

  const inner = (
    <div className="flex min-w-0 flex-col gap-[17px]">
      {showHeader && title && !(featured && title.trim() === (featured.title || '').trim()) ? (
        <h2
          className={cx('m-0', TITLE_SIZE, CMS_TEXT_HOVER_CLASS)}
          style={getTextStyleVars(textStyle, 'titleColor', 'foreground', 'semibold')}
        >
          <LinkedText text={title} {...linkProps} />
        </h2>
      ) : null}

      <div className={cx('grid min-w-0', COLUMNS[colKey] || COLUMNS[3], gapClass)}>
        {cards.map((card, index) => {
          const src = card.image
          const overlay = cardIsOverlay(card)
          if (overlay) {
            const lightText = { color: '#fdfdfc' }
            return (
              <article
                key={card.id || index}
                className={cx(
                  'relative isolate min-h-[280px] overflow-hidden md:min-h-[320px]',
                  radiusClass,
                  cards.length > 1 && 'col-span-full',
                )}
                style={{
                  backgroundColor: '#01263b',
                  backgroundImage: src ? `url("${src}")` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {card.imageAlt ? <span className="sr-only">{card.imageAlt}</span> : null}
                <div
                  aria-hidden
                  className="rtl:scale-x-[-1]"
                  style={{ ...OVERLAY_WASH, position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
                />
                <div className="relative z-[1] flex min-h-[280px] w-full max-w-[560px] flex-col justify-center gap-4 px-6 py-8 md:min-h-[320px] md:gap-5 md:px-10">
                  {card.title ? (
                    <h3
                      className={cx('m-0', CARD_TITLE_SIZE, CMS_TEXT_HOVER_CLASS)}
                      style={{
                        ...getTextStyleVars(textStyle, 'cardTitleColor', '50', 'semibold'),
                        ...lightText,
                        lineHeight: 'normal',
                      }}
                    >
                      <LinkedText text={card.title} {...linkProps} />
                    </h3>
                  ) : null}
                  {card.description ? (
                    <p
                      className={cx('m-0', CARD_DESCRIPTION_SIZE, CMS_TEXT_HOVER_CLASS)}
                      style={{
                        ...getTextStyleVars(textStyle, 'cardDescriptionColor', '50', 'normal'),
                        ...lightText,
                        lineHeight: 1.5,
                      }}
                    >
                      <LinkedText text={card.description} {...linkProps} />
                    </p>
                  ) : null}
                  {card.cta ? (
                    <LocalizedLink
                      href={card.href || '#'}
                      className={cx(
                        'inline-flex h-[55px] w-fit items-center justify-center gap-2.5 self-start rounded-lg px-4 no-underline',
                        CTA_SIZE,
                      )}
                      style={{ backgroundColor: colorVar(textStyle.ctaColor || 'primary-1'), color: '#fdfdfc' }}
                    >
                      <span>{card.cta}</span>
                      <ArrowRight size={24} aria-hidden className="shrink-0 rtl:-scale-x-100" style={{ color: '#fdfdfc' }} />
                    </LocalizedLink>
                  ) : null}
                </div>
              </article>
            )
          }
          return (
            <article
              key={card.id || index}
              className={cx(
                'group flex h-full min-w-0 flex-col overflow-hidden lg:min-h-[460px]',
                radiusClass,
              )}
              style={{ backgroundColor: colorVar(cardBg) }}
            >
              {src ? (
                <div className="h-[234px] w-full shrink-0 overflow-hidden">
                  <img
                    src={src}
                    alt={card.imageAlt || ''}
                    className={cx('size-full object-cover', IMAGE_MOTION)}
                  />
                </div>
              ) : null}
              <div className="flex flex-1 flex-col gap-3 pb-6 pe-[26px] ps-[15.72px] pt-3">
                {card.title ? (
                  <h3
                    className={cx('m-0', CARD_TITLE_SIZE, CMS_TEXT_HOVER_CLASS)}
                    style={getTextStyleVars(textStyle, 'cardTitleColor', '700', 'semibold')}
                  >
                    <LinkedText text={card.title} {...linkProps} />
                  </h3>
                ) : null}
                {card.description ? (
                  <p
                    className={cx('m-0', CARD_DESCRIPTION_SIZE, CMS_TEXT_HOVER_CLASS)}
                    style={getTextStyleVars(textStyle, 'cardDescriptionColor', '700', 'normal')}
                  >
                    <LinkedText text={card.description} {...linkProps} />
                  </p>
                ) : null}
                {card.cta ? (
                  <LocalizedLink
                    href={card.href || '#'}
                    className={cx(
                      'mt-auto flex w-full items-center justify-between gap-3 pt-4 no-underline',
                      CTA_SIZE,
                    )}
                  >
                    <span
                      className={CMS_TEXT_HOVER_CLASS}
                      style={getTextStyleVars(textStyle, 'ctaColor', 'primary-1', 'semibold')}
                    >
                      {card.cta}
                    </span>
                    <ArrowRight
                      size={24}
                      aria-hidden
                      className="shrink-0 rtl:-scale-x-100"
                      style={{ color: colorVar(arrowColor) }}
                    />
                  </LocalizedLink>
                ) : null}
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )

  const sectionClass = cx(
    SECTION_PADDING[sectionPadding] || '',
    showSectionBg ? 'rounded-2xl px-4 md:px-6' : '',
  )

  if (!sectionClass) return inner
  return (
    <div
      className={sectionClass}
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      {inner}
    </div>
  )
}

export default CargoInfoCards
