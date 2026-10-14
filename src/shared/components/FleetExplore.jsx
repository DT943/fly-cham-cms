import { ArrowRight } from '@phosphor-icons/react'
import { CMS_TEXT_HOVER_CLASS, getTextStyleVars, colorVar } from '../../styles/cmsStyle.js'
import { typography } from '../../styles/typography.js'
import LinkedText from './backlinks/LinkedText.jsx'
import LocalizedLink from './LocalizedLink.jsx'

const SECTION_PADDING = {
  tight: 'py-4 md:py-6',
  default: '',
  loose: 'py-10 md:py-16',
}

const CARD_GAP = {
  tight: 'gap-3 md:gap-4',
  default: 'gap-5',
  loose: 'gap-6 md:gap-8',
}

const COLUMNS = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
}

const cx = (...parts) => parts.filter(Boolean).join(' ')

const FleetCard = ({
  card,
  economyLabel,
  businessLabel,
  totalSeatsLabel,
  style,
  linkProps,
}) => {
  const href = card.href || '#'
  const imageSrc = card.image
  const isAnchorWrapped = Boolean(card.href && card.href !== '#')

  return (
    <article
      className="flex h-full flex-col gap-4 rounded-2xl border p-5"
      style={{
        backgroundColor: colorVar(style.cardBg || 'background'),
        borderColor: colorVar(style.cardBorderColor || '200'),
      }}
    >
      {card.name ? (
        <h3
          className={cx('m-0', typography.itemTitle, CMS_TEXT_HOVER_CLASS)}
          style={getTextStyleVars(style, 'cardNameColor', 'primary-1', 'bold')}
        >
          {isAnchorWrapped ? (
            card.name
          ) : (
            <LinkedText text={card.name} {...linkProps} />
          )}
        </h3>
      ) : null}

      <div
        className={cx('grid grid-cols-2 gap-2', typography.itemDescription, CMS_TEXT_HOVER_CLASS)}
        style={getTextStyleVars(style, 'cardMetaColor', '700', 'normal')}
      >
        <p className="m-0">
          <span>{economyLabel}</span> <span>{card.economy}</span>
        </p>
        <p className="m-0">
          <span>{businessLabel}</span> <span>{card.business}</span>
        </p>
      </div>

      {style.showCardImage !== false && imageSrc ? (
        <img
          src={imageSrc}
          alt={card.imageAlt || card.name || ''}
          className="my-2 h-24 w-full object-contain md:h-28"
        />
      ) : null}

      <div className="mt-auto flex items-center justify-between gap-3">
        <p
          className={cx('m-0', typography.itemTitle, CMS_TEXT_HOVER_CLASS)}
          style={getTextStyleVars(style, 'cardTotalColor', '800', 'semibold')}
        >
          <span>{totalSeatsLabel}</span> <span>{card.totalSeats}</span>
        </p>
        {style.showCardArrow !== false ? (
          <LocalizedLink
            href={href}
            aria-label={card.name || totalSeatsLabel}
            className="flex size-10 shrink-0 items-center justify-center rounded-full no-underline transition-opacity duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:opacity-90 motion-reduce:transition-none"
            style={{
              backgroundColor: colorVar(style.arrowBg || 'primary-1'),
              color: colorVar(style.arrowColor || '50'),
            }}
          >
            <ArrowRight size={20} weight="bold" aria-hidden className="rtl:-scale-x-100" />
          </LocalizedLink>
        ) : null}
      </div>
    </article>
  )
}

/**
 * Title + paragraphs + aircraft card grid. Matches static Our Fleet explore.
 */
const FleetExplore = ({
  title = '',
  items = [],
  cards = [],
  economyLabel = 'Economy',
  businessLabel = 'Business',
  totalSeatsLabel = 'Total seats',
  sectionPadding = 'default',
  showSectionBg = false,
  sectionBg = '100',
  showCards = true,
  showCardImage = true,
  showCardArrow = true,
  columns = '3',
  cardGap = 'default',
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
  ...textStyle
}) => {
  const paragraphs = Array.isArray(items) ? items.filter((it) => it?.body) : []
  const aircraft = Array.isArray(cards) ? cards.filter((card) => card?.name) : []
  if (!title && !paragraphs.length && !aircraft.length) return null

  const style = {
    ...textStyle,
    showCardImage,
    showCardArrow,
    cardBg: textStyle.cardBg,
    cardBorderColor: textStyle.cardBorderColor,
    arrowBg: textStyle.arrowBg,
    arrowColor: textStyle.arrowColor,
  }

  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }

  const inner = (
    <section className="flex flex-col gap-8 md:gap-12">
      {(title || paragraphs.length > 0) && (
        <div className="flex flex-col gap-4">
          {title ? (
            <h2
              className={cx('m-0', typography.sectionTitle, CMS_TEXT_HOVER_CLASS)}
              style={getTextStyleVars(textStyle, 'titleColor', '800', 'semibold')}
            >
              <LinkedText text={title} {...linkProps} />
            </h2>
          ) : null}
          {paragraphs.length ? (
            <div className="flex flex-col gap-4">
              {paragraphs.map((item) => (
                <p
                  key={item.id}
                  className={cx('m-0 leading-relaxed', typography.body, CMS_TEXT_HOVER_CLASS)}
                  style={getTextStyleVars(textStyle, 'bodyColor', '700', 'normal')}
                >
                  <LinkedText text={item.body} {...linkProps} />
                </p>
              ))}
            </div>
          ) : null}
        </div>
      )}

      {showCards && aircraft.length > 0 ? (
        <div className={cx('grid', COLUMNS[columns] || COLUMNS[3], CARD_GAP[cardGap] || CARD_GAP.default)}>
          {aircraft.map((card) => (
            <FleetCard
              key={card.id}
              card={card}
              economyLabel={economyLabel}
              businessLabel={businessLabel}
              totalSeatsLabel={totalSeatsLabel}
              style={style}
              linkProps={linkProps}
            />
          ))}
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

export default FleetExplore
