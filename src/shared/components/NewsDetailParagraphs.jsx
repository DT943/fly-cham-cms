import {
  CMS_TEXT_HOVER_CLASS,
  getTextStyleVars,
} from '../../styles/cmsStyle.js'
import { typography } from '../../styles/typography.js'
import LinkedText from './backlinks/LinkedText.jsx'

/**
 * News article body paragraphs with optional bold lead-in.
 */
const NewsDetailParagraphs = ({
  paragraphs = [],
  className = '',
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
  ...textStyle
}) => {
  const items = Array.isArray(paragraphs) ? paragraphs : []
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

  return (
    <div className={`flex flex-col gap-4 md:gap-5 ${className}`.trim()}>
      {items.map((paragraph, index) => (
        <p
          key={paragraph.id || index}
          className={`m-0 font-normal leading-relaxed ${typography.body} ${CMS_TEXT_HOVER_CLASS}`}
          style={getTextStyleVars(textStyle, 'bodyColor', '700', 'normal')}
        >
          {paragraph.bold ? (
            <span
              className={`font-semibold ${CMS_TEXT_HOVER_CLASS}`}
              style={getTextStyleVars(textStyle, 'boldColor', '800', 'semibold')}
            >
              <LinkedText text={paragraph.bold} {...linkProps} />
            </span>
          ) : null}
          <LinkedText text={paragraph.text || ''} {...linkProps} />
        </p>
      ))}
    </div>
  )
}

export default NewsDetailParagraphs
