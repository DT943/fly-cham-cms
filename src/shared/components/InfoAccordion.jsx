import { CMS_TEXT_HOVER_CLASS, getTextStyleVars, colorVar } from '../../styles/cmsStyle.js'
import { typography } from '../../styles/typography.js'
import LinkedText from './backlinks/LinkedText.jsx'

const CARD_RADIUS = {
  none: 'rounded-none',
  sm: 'rounded-xl',
  lg: 'rounded-2xl',
  full: 'rounded-3xl',
}

const SECTION_PADDING = {
  tight: 'py-4 md:py-6',
  default: '',
  loose: 'py-10 md:py-16',
}

const MARKER_CLASS = {
  dots: 'list-disc',
  letters: 'list-[upper-alpha]',
  numbers: 'list-decimal',
}

const cx = (...parts) => parts.filter(Boolean).join(' ')

const itemParts = (item) => {
  const heading =
    typeof item?.heading === 'string'
      ? item.heading.trim()
      : typeof item?.title === 'string'
        ? item.title.trim()
        : ''
  const text =
    typeof item?.text === 'string'
      ? item.text.trim()
      : typeof item?.body === 'string'
        ? item.body.trim()
        : ''
  return { heading, text }
}

/**
 * Heading plus a white card of terms. Markers are dots, letters, or numbers.
 */
const InfoAccordion = ({
  title = '',
  items = [],
  listMarker = 'dots',
  sectionPadding = 'default',
  showSectionBg = false,
  sectionBg = '100',
  cardBg = '50',
  cardRadius = 'sm',
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
  ...textStyle
}) => {
  const lines = items.map(itemParts).filter((item) => item.heading || item.text)
  if (!title && !lines.length) return null

  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }
  const radiusClass = CARD_RADIUS[cardRadius] || CARD_RADIUS.sm
  const markerClass = MARKER_CLASS[listMarker] || MARKER_CLASS.dots
  const markerPad = listMarker === 'dots' ? 'ps-5' : 'ps-7'

  const card = (
    <div className={cx('flex flex-col gap-4', SECTION_PADDING[sectionPadding] || '')}>
      {title ? (
        <h2
          className={cx('m-0 font-semibold leading-6', typography.itemTitle, CMS_TEXT_HOVER_CLASS)}
          style={getTextStyleVars(textStyle, 'titleColor', '700', 'semibold')}
        >
          <LinkedText text={title} {...linkProps} />
        </h2>
      ) : null}
      {lines.length ? (
        <div
          className={cx('px-6 py-5', radiusClass)}
          style={{ backgroundColor: colorVar(cardBg) }}
        >
          <ul
            className={cx(
              'm-0 list-outside space-y-3',
              markerClass,
              markerPad,
              typography.caption,
              'leading-relaxed',
              CMS_TEXT_HOVER_CLASS,
            )}
            style={getTextStyleVars(textStyle, 'bodyColor', '700', 'normal')}
          >
            {lines.map((line, index) => (
              <li
                key={items[index]?.id || index}
                className={
                  // Text-only rows often paste their own • / - lines; hide the
                  // CSS marker so it does not sit beside those characters.
                  line.heading
                    ? 'whitespace-pre-line marker:text-current'
                    : 'list-none whitespace-pre-line'
                }
              >
                {line.heading ? (
                  <span
                    className={cx('block font-semibold', CMS_TEXT_HOVER_CLASS)}
                    style={getTextStyleVars(textStyle, 'titleColor', '700', 'semibold')}
                  >
                    <LinkedText text={line.heading} {...linkProps} />
                  </span>
                ) : null}
                {line.text ? <LinkedText text={line.text} {...linkProps} /> : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )

  if (!showSectionBg) return card
  return (
    <div className="rounded-2xl px-4 md:px-6" style={{ backgroundColor: colorVar(sectionBg) }}>
      {card}
    </div>
  )
}

export default InfoAccordion
