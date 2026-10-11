import {
  HandHeart,
  Handshake,
  Leaf,
  ShieldPlus,
  Star,
  UsersThree,
} from '@phosphor-icons/react'
import { typography } from '../../styles/typography.js'
import { CMS_TEXT_HOVER_CLASS, colorVar, getTextStyleVars } from '../../styles/cmsStyle.js'
import LinkedText from './backlinks/LinkedText.jsx'

const ICON_BY_NAME = {
  safety: ShieldPlus,
  hospitality: Handshake,
  sustainability: Leaf,
  customerFocus: HandHeart,
  excellence: Star,
  teamwork: UsersThree,
  shieldPlus: ShieldPlus,
  handshake: Handshake,
  leaf: Leaf,
  handHeart: HandHeart,
  star: Star,
  usersThree: UsersThree,
}

const COLUMNS = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
}

const CARD_GAP = {
  tight: 'gap-2',
  default: 'gap-3',
  loose: 'gap-4 md:gap-6',
}

const SECTION_PADDING = {
  none: '',
  tight: 'py-4 md:py-6',
  default: '',
  loose: 'py-10 md:py-16',
}

const cx = (...parts) => parts.filter(Boolean).join(' ')

function resolveIcon(name) {
  const key = String(name || '').trim()
  return ICON_BY_NAME[key] || ShieldPlus
}

/**
 * Titled grid of value cards (icon, title, description). Defaults match the static About Us section.
 */
const AboutValues = ({
  title = '',
  items = [],
  showTitle = true,
  columns = '3',
  cardGap = 'default',
  sectionPadding = 'none',
  showSectionBg = false,
  sectionBg = '100',
  cardBg = '50',
  iconBg = '100',
  iconColor = '900',
  titleColor = '800',
  titleFontWeight = 'semibold',
  titleColorHover,
  titleFontWeightHover,
  cardTitleColor = 'secondary-2',
  cardTitleFontWeight = 'semibold',
  cardTitleColorHover,
  cardTitleFontWeightHover,
  cardDescriptionColor = '700',
  cardDescriptionFontWeight = 'normal',
  cardDescriptionColorHover,
  cardDescriptionFontWeightHover,
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
}) => {
  if (!items.length && !title) return null

  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }

  const titleStyleKeys = { titleColor, titleFontWeight, titleColorHover, titleFontWeightHover }
  const cardTitleStyleKeys = {
    cardTitleColor,
    cardTitleFontWeight,
    cardTitleColorHover,
    cardTitleFontWeightHover,
  }
  const cardDescriptionStyleKeys = {
    cardDescriptionColor,
    cardDescriptionFontWeight,
    cardDescriptionColorHover,
    cardDescriptionFontWeightHover,
  }

  const gridClass = COLUMNS[columns] || COLUMNS[3]
  const gapClass = CARD_GAP[cardGap] || CARD_GAP.default
  const paddingClass = SECTION_PADDING[sectionPadding] ?? SECTION_PADDING.none

  const inner = (
    <section className="flex flex-col gap-6">
      {showTitle && title ? (
        <h2
          className={cx('m-0 font-semibold text-800', typography.sectionTitle, CMS_TEXT_HOVER_CLASS)}
          style={getTextStyleVars(titleStyleKeys, 'titleColor', '800', 'semibold')}
        >
          <LinkedText text={title} {...linkProps} />
        </h2>
      ) : null}
      {items.length ? (
        <div className={cx('grid', gridClass, gapClass)}>
          {items.map((item, index) => {
            const Icon = resolveIcon(item.icon)
            return (
              <article
                key={item.id || index}
                className="flex flex-col items-center justify-center gap-2 rounded-xl px-4 py-6 text-center"
                style={{ backgroundColor: colorVar(cardBg) }}
              >
                <span
                  className="flex size-[68px] items-center justify-center rounded-full"
                  style={{ backgroundColor: colorVar(iconBg) }}
                >
                  <Icon
                    size={33}
                    weight="regular"
                    className="shrink-0"
                    style={{ color: colorVar(iconColor) }}
                    aria-hidden
                  />
                </span>
                {item.title ? (
                  <h3
                    className={cx(
                      'm-0 font-semibold text-secondary-2',
                      typography.itemTitle,
                      CMS_TEXT_HOVER_CLASS,
                    )}
                    style={getTextStyleVars(cardTitleStyleKeys, 'cardTitleColor', 'secondary-2', 'semibold')}
                  >
                    <LinkedText text={item.title} {...linkProps} />
                  </h3>
                ) : null}
                {item.description ? (
                  <p
                    className={cx(
                      'm-0 font-normal leading-normal text-700',
                      typography.caption,
                      CMS_TEXT_HOVER_CLASS,
                    )}
                    style={getTextStyleVars(
                      cardDescriptionStyleKeys,
                      'cardDescriptionColor',
                      '700',
                      'normal',
                    )}
                  >
                    <LinkedText text={item.description} {...linkProps} />
                  </p>
                ) : null}
              </article>
            )
          })}
        </div>
      ) : null}
    </section>
  )

  if (!showSectionBg && !paddingClass) return inner

  return (
    <div
      className={cx(paddingClass, showSectionBg && 'rounded-2xl px-4 md:px-6')}
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      {inner}
    </div>
  )
}

export default AboutValues
