import { CMS_TEXT_HOVER_CLASS, getTextStyleVars, colorVar } from '../../styles/cmsStyle.js'
import { resolvePhosphorIcon } from '../../cms/adapters/phosphorIcons.js'
import LinkedText from './backlinks/LinkedText.jsx'

// Keep these class maps byte-identical with the cms2 BaggageAllowance block.
const COLUMNS_CLASS = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
}
const CARD_GAP_CLASS = { tight: 'gap-3', default: 'gap-4', loose: 'gap-6' }
const CARD_RADIUS_CLASS = {
  none: 'rounded-none',
  sm: 'rounded-lg',
  lg: 'rounded-2xl',
  xl: 'rounded-3xl',
}
const SECTION_PADDING = {
  none: '',
  tight: 'py-4 md:py-6',
  default: 'py-6 md:py-10',
  loose: 'py-10 md:py-16',
}

// Pinned px sizes from Figma 40281:34849.
const TITLE_SIZE = 'text-2xl leading-[1.3] md:text-[28px] md:leading-[37px]'
const DESCRIPTION_SIZE = 'text-base leading-[27px]'
const CARD_TITLE_SIZE = 'text-base leading-[normal]'
const LABEL_SIZE = 'text-sm leading-[normal] capitalize'
const VALUE_SIZE = 'text-2xl leading-[normal]'
const CARD_DESCRIPTION_SIZE = 'text-sm leading-[1.4]'

const cx = (...parts) => parts.filter(Boolean).join(' ')

/**
 * CMS-driven Baggage guide (Figma 40281:34849): 28px title + description, then
 * allowance cards per travel class — header row, icon + value stats, divider,
 * note. Mirrors the cms2 BaggageAllowance block.
 */
const BaggageAllowance = ({
  title = '',
  description = '',
  cards = [],
  showHeader = true,
  showDescription = true,
  columns = '3',
  cardGap = 'default',
  cardRadius = 'lg',
  sectionPadding = 'none',
  showSectionBg = false,
  sectionBg = '100',
  cardBg = 'background',
  cardHeaderBg = 'background',
  headerBorderColor = '100',
  dividerColor = '100',
  showDivider = true,
  iconColor = 'primary-1',
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
  ...textStyle
}) => {
  if (!cards.length && !title && !description) return null

  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }
  const showTitle = showHeader && title
  const showCopy = showHeader && showDescription && description
  const radiusClass = CARD_RADIUS_CLASS[cardRadius] ?? CARD_RADIUS_CLASS.lg

  return (
    <section
      className={cx('w-full min-w-0', SECTION_PADDING[sectionPadding] ?? '')}
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      <div className="flex min-w-0 flex-col gap-6 md:gap-[30px]">
        {showTitle || showCopy ? (
          <div className="flex flex-col gap-3">
            {showTitle ? (
              <h2
                className={cx('m-0', TITLE_SIZE, CMS_TEXT_HOVER_CLASS)}
                style={getTextStyleVars(textStyle, 'titleColor', '700', 'semibold')}
              >
                <LinkedText text={title} {...linkProps} />
              </h2>
            ) : null}
            {showCopy ? (
              <p
                className={cx('m-0', DESCRIPTION_SIZE, CMS_TEXT_HOVER_CLASS)}
                style={getTextStyleVars(textStyle, 'descriptionColor', '700', 'normal')}
              >
                <LinkedText text={description} {...linkProps} />
              </p>
            ) : null}
          </div>
        ) : null}

        {cards.length ? (
          <div
            className={cx(
              'grid min-w-0',
              COLUMNS_CLASS[columns] ?? COLUMNS_CLASS[3],
              CARD_GAP_CLASS[cardGap] ?? CARD_GAP_CLASS.default,
            )}
          >
            {cards.map((card, index) => {
              const stats = card.stats || []
              return (
                <article
                  key={card.id ? `${card.id}-${index}` : index}
                  className={cx('flex min-w-0 flex-col overflow-hidden', radiusClass)}
                  style={{ backgroundColor: colorVar(cardBg) }}
                >
                  {card.title ? (
                    <div
                      className="flex items-center border-0 border-b border-solid p-5"
                      style={{
                        backgroundColor: colorVar(cardHeaderBg),
                        borderColor: colorVar(headerBorderColor),
                      }}
                    >
                      <h3
                        className={cx('m-0', CARD_TITLE_SIZE, CMS_TEXT_HOVER_CLASS)}
                        style={getTextStyleVars(textStyle, 'cardTitleColor', '700', 'semibold')}
                      >
                        <LinkedText text={card.title} {...linkProps} />
                      </h3>
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col gap-5 p-6">
                    {stats.length ? (
                      <div className="flex gap-4">
                        {stats.map((stat, statIndex) => {
                          const Icon = stat.icon ? resolvePhosphorIcon(stat.icon) : null
                          return (
                            <div key={statIndex} className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                              {stat.label ? (
                                <p
                                  className={cx('m-0', LABEL_SIZE, CMS_TEXT_HOVER_CLASS)}
                                  style={getTextStyleVars(textStyle, 'labelColor', '700', 'medium')}
                                >
                                  {stat.label}
                                </p>
                              ) : null}
                              <div className="flex items-center gap-1">
                                {Icon ? (
                                  <Icon
                                    size={32}
                                    aria-hidden
                                    className="shrink-0"
                                    style={{ color: colorVar(iconColor) }}
                                  />
                                ) : null}
                                {stat.value ? (
                                  <p
                                    className={cx('m-0 whitespace-nowrap', VALUE_SIZE, CMS_TEXT_HOVER_CLASS)}
                                    style={getTextStyleVars(textStyle, 'valueColor', 'primary-1', 'bold')}
                                  >
                                    {stat.value}
                                  </p>
                                ) : null}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : null}
                    {showDivider && stats.length && card.description ? (
                      <div
                        aria-hidden
                        className="h-px w-full shrink-0"
                        style={{ backgroundColor: colorVar(dividerColor) }}
                      />
                    ) : null}
                    {card.description ? (
                      <p
                        className={cx('m-0', CARD_DESCRIPTION_SIZE, CMS_TEXT_HOVER_CLASS)}
                        style={getTextStyleVars(textStyle, 'cardDescriptionColor', '700', 'normal')}
                      >
                        <LinkedText text={card.description} {...linkProps} />
                      </p>
                    ) : null}
                  </div>
                </article>
              )
            })}
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default BaggageAllowance
