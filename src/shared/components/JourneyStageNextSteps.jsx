import {
  Airplane,
  AirplaneLanding,
  AirplaneTakeoff,
  ArrowRight,
  Headset,
  Question,
  SuitcaseRolling,
  Info,
  Lifebuoy,
} from '@phosphor-icons/react'
import { CMS_TEXT_HOVER_CLASS, getTextStyleVars, colorVar } from '../../styles/cmsStyle.js'
import { typography } from '../../styles/typography.js'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'

const ICON_MAP = {
  airplane: Airplane,
  airplaneTakeoff: AirplaneTakeoff,
  airplaneLanding: AirplaneLanding,
  headset: Headset,
  question: Question,
  suitcase: SuitcaseRolling,
  info: Info,
  lifebuoy: Lifebuoy,
}

function resolveIcon(name) {
  return ICON_MAP[name] || AirplaneTakeoff
}

const COLUMNS = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
}

const CARD_GAP = {
  tight: 'gap-3',
  default: 'gap-4 md:gap-5',
  loose: 'gap-6 md:gap-8',
}

const SECTION_PADDING = {
  tight: 'py-4 md:py-6',
  default: 'py-6 md:py-10',
  loose: 'py-10 md:py-16',
}

const cx = (...parts) => parts.filter(Boolean).join(' ')

/**
 * Next-step cards at the end of a travel-experience stage page (icon + title,
 * description, CTA pill). CMS-driven: colours/weights/hover, columns, gap and
 * the section background are all controllable, with defaults matching the
 * source design. Icon names ('airplaneTakeoff', 'headset', …) resolve to
 * Phosphor components inside this file.
 */
const JourneyStageNextSteps = ({
  items = [],
  columns = '2',
  cardGap = 'default',
  sectionPadding = 'default',
  showSectionBg = false,
  sectionBg = '100',
  cardBg = 'background',
  cardBorderColor = '200',
  iconColor = '700',
  arrowBadgeBg = 'primary-1',
  arrowColor = '50',
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

  const inner = (
    <section className={cx('grid', COLUMNS[String(columns)] || COLUMNS[2], CARD_GAP[cardGap] || CARD_GAP.default)}>
      {items.map((item, index) => {
        const Icon = resolveIcon(item.icon)
        return (
          <article
            key={item.id || index}
            className="flex flex-col justify-between gap-6 rounded-2xl border p-5 md:p-6"
            style={{
              backgroundColor: colorVar(cardBg),
              borderColor: colorVar(cardBorderColor),
            }}
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                {Icon ? (
                  <Icon
                    size={22}
                    weight="regular"
                    className="shrink-0"
                    style={{ color: colorVar(iconColor) }}
                  />
                ) : null}
                <h2
                  className={cx(typography.itemTitle, 'm-0', CMS_TEXT_HOVER_CLASS)}
                  style={getTextStyleVars(textStyle, 'cardTitleColor', '700', 'semibold')}
                >
                  <LinkedText text={item.title} {...linkProps} />
                </h2>
              </div>
              <p
                className={cx(typography.itemDescription, 'm-0 leading-relaxed', CMS_TEXT_HOVER_CLASS)}
                style={getTextStyleVars(textStyle, 'cardDescriptionColor', '800', 'normal')}
              >
                <LinkedText text={item.description} {...linkProps} />
              </p>
            </div>
            <LocalizedLink
              href={item.href || '#'}
              className={cx(
                'inline-flex w-fit items-center gap-2.5 text-sm no-underline',
                CMS_TEXT_HOVER_CLASS,
              )}
              style={getTextStyleVars(textStyle, 'learnMoreColor', 'primary-1', 'semibold')}
            >
              <span
                className="flex size-[34px] shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: colorVar(arrowBadgeBg) }}
              >
                <ArrowRight
                  size={16}
                  weight="bold"
                  className="rtl:-scale-x-100"
                  style={{ color: colorVar(arrowColor) }}
                />
              </span>
              {item.cta || ''}
            </LocalizedLink>
          </article>
        )
      })}
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

export default JourneyStageNextSteps
