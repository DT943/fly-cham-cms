import { CMS_TEXT_HOVER_CLASS, getTextStyleVars, colorVar } from '../../styles/cmsStyle.js'
import { typography } from '../../styles/typography.js'
import LinkedText from './backlinks/LinkedText.jsx'

const SECTION_PADDING = {
  tight: 'py-4 md:py-6',
  default: '',
  loose: 'py-10 md:py-16',
}

const cx = (...parts) => parts.filter(Boolean).join(' ')

/**
 * Page intro paragraph. Defaults match the Media Center welcome copy
 * (`typography.body`, text-800).
 */
const PageIntro = ({
  lead = '',
  body = '',
  imageUrl = '',
  imageAlt = '',
  sectionPadding = 'default',
  leadSize = 'default',
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
  if (!lead && !body && !imageUrl) return null

  const inner = (
    <div className="flex flex-col gap-6">
      {lead || body ? (
    <div className="flex flex-col gap-3">
      {lead ? (
        <p
          className={cx(
            'm-0 whitespace-pre-line',
            leadSize === 'lg' ? 'text-xl leading-7 md:text-2xl' : 'text-base leading-[normal] md:text-lg',
            CMS_TEXT_HOVER_CLASS,
          )}
          style={getTextStyleVars(textStyle, 'leadColor', '700', 'semibold')}
        >
          <LinkedText
            text={lead}
            links={links}
            enabled={showLinks}
            linkColor={linkColor}
            linkHoverColor={linkHoverColor}
            linkFontWeight={linkFontWeight}
            linkUnderline={linkUnderline}
            linkItalic={linkItalic}
          />
        </p>
      ) : null}
      {body ? (
        <p
          className={cx('m-0 whitespace-pre-line font-normal leading-relaxed', typography.body, CMS_TEXT_HOVER_CLASS)}
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
      ) : null}
    </div>
      ) : null}
      {imageUrl ? (
        <img src={imageUrl} alt={imageAlt || ''} className="h-[240px] w-full rounded-[24px] object-cover md:h-[504px]" />
      ) : null}
    </div>
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
