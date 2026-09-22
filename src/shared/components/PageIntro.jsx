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
 * Page intro paragraph. Defaults match the Media Center welcome copy
 * (`typography.body`, text-800).
 */
const PageIntro = ({
  body = '',
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
  if (!body) return null

  const inner = (
    <p
      className={cx('m-0 font-normal leading-relaxed', typography.body, CMS_TEXT_HOVER_CLASS)}
      style={getTextStyleVars(textStyle, 'bodyColor', '800', 'normal')}
    >
      <LinkedText
        text={body}
        links={links}
        enabled={showLinks}
        linkColor={linkColor}
        linkHoverColor={linkHoverColor}
        linkFontWeight={linkFontWeight}
        linkUnderline={linkUnderline}
        linkItalic={linkItalic}
      />
    </p>
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

export default PageIntro
