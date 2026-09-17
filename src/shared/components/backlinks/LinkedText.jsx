import { colorVar, CMS_TEXT_HOVER_CLASS } from '../../../styles/cmsStyle.js'
import LocalizedLink from '../LocalizedLink.jsx'
import { buildLinkedTextParts } from './core.js'

const cx = (...parts) => parts.filter(Boolean).join(' ')

const FONT_WEIGHT_VALUE = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
}

const weightValue = (token, fallback = 'semibold') =>
  FONT_WEIGHT_VALUE[token] ?? FONT_WEIGHT_VALUE[fallback] ?? 600

/**
 * Public renderer for CMS backlinks. Turns a piece of copy plus the block's
 * `links` array into text with inline links, styled from the block's backlink
 * style keys (linkColor / linkHoverColor / linkFontWeight / linkUnderline /
 * linkItalic). Mirrors the cms2 `LinkedText`, but uses LocalizedLink so internal
 * links stay in-app.
 */
const LinkedText = ({
  text,
  links,
  enabled = true,
  linkColor = 'primary-1',
  linkHoverColor,
  linkFontWeight = 'semibold',
  linkUnderline = 'always',
  linkItalic = false,
}) => {
  const parts =
    enabled && Array.isArray(links) && links.length
      ? buildLinkedTextParts(text, links)
      : [{ type: 'text', value: text }]

  const normalColor = colorVar(linkColor)
  const hoverColor = colorVar(linkHoverColor || linkColor)
  const weight = weightValue(linkFontWeight)

  const underlineClass =
    linkUnderline === 'always'
      ? 'underline underline-offset-2'
      : linkUnderline === 'hover'
        ? 'no-underline hover:underline hover:underline-offset-2'
        : 'no-underline'

  return parts.map((part, index) => {
    if (part.type !== 'link') {
      return <span key={`t-${index}`}>{part.value}</span>
    }

    const isExternal = part.linkType === 'external'

    return (
      <LocalizedLink
        key={`l-${index}-${part.href}`}
        href={part.href}
        className={cx('transition-colors', underlineClass, linkItalic && 'italic', CMS_TEXT_HOVER_CLASS)}
        style={{
          color: normalColor,
          fontWeight: weight,
          '--cms-hc': hoverColor,
          '--cms-hw': weight,
        }}
        onClick={(event) => event.stopPropagation()}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {part.value}
      </LocalizedLink>
    )
  })
}

export default LinkedText
