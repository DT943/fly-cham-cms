import { CMS_TEXT_HOVER_CLASS, getTextStyleVars, colorVar } from '../../styles/cmsStyle.js'
import { typography } from '../../styles/typography.js'
import LinkedText from './backlinks/LinkedText.jsx'

const SECTION_PADDING = {
  tight: 'py-4 md:py-6',
  default: 'py-6 md:py-10',
  loose: 'py-10 md:py-16',
}

const cx = (...parts) => parts.filter(Boolean).join(' ')

/**
 * Title + stacked paragraphs. Defaults match Our Fleet "Explore our fleet".
 */
const FleetExplore = ({
  title = '',
  items = [],
  sectionPadding = 'default',
  showSectionBg = false,
  sectionBg = '100',
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
  if (!title && !paragraphs.length) return null

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
    <section className="flex flex-col gap-4">
      {title ? (
        <h2
          className={cx('m-0 font-semibold', typography.sectionTitle, CMS_TEXT_HOVER_CLASS)}
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
              className={cx('m-0 font-normal leading-relaxed', typography.body, CMS_TEXT_HOVER_CLASS)}
              style={getTextStyleVars(textStyle, 'bodyColor', '700', 'normal')}
            >
              <LinkedText text={item.body} {...linkProps} />
            </p>
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
