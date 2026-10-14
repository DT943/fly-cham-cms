import { typography } from '../../../styles/typography.js'
import { CMS_TEXT_HOVER_CLASS, getTextStyleVars } from '../../../styles/cmsStyle.js'
import LinkedText from '../backlinks/LinkedText.jsx'
import { linkify } from './linkify.jsx'

/** "1. WHAT INFORMATION DO WE COLLECT?" → "What information do we collect?" */
export const readingLabel = (title) => {
  const stripped =
    String(title || '').replace(/^\s*(?:[A-Za-z]|\d{1,3})\s*[.)]\s+/, '').trim() ||
    String(title || '')
  const letters = stripped.replace(/[^A-Za-z]/g, '')
  if (!letters || letters !== letters.toUpperCase()) return stripped
  const lower = stripped.toLowerCase()
  return lower.charAt(0).toUpperCase() + lower.slice(1)
}

export const LegalParagraph = ({
  text,
  linkifyText = true,
  links,
  showLinks,
  style,
  whitespace = false,
}) => {
  if (!text) return null
  const backlinkProps = {
    linkColor: style?.linkColor,
    linkHoverColor: style?.linkHoverColor,
    linkFontWeight: style?.linkFontWeight,
    linkUnderline: style?.linkUnderline,
    linkItalic: style?.linkItalic,
  }
  return (
    <p
      className={`m-0 font-normal leading-relaxed text-700 ${typography.caption} ${
        whitespace ? 'whitespace-pre-line' : 'leading-6'
      } ${CMS_TEXT_HOVER_CLASS}`}
      style={getTextStyleVars(style, 'cardDescriptionColor', '700', 'normal')}
    >
      {showLinks && links?.length ? (
        <LinkedText text={text} links={links} enabled={showLinks} {...backlinkProps} />
      ) : linkifyText ? (
        linkify(text)
      ) : (
        text
      )}
    </p>
  )
}

export const LegalBullets = ({ items = [], linkifyText = true, relaxed = false }) => {
  if (!items.length) return null
  return (
    <ul
      className={`m-0 flex list-disc flex-col ps-5 text-700 ${typography.caption} ${
        relaxed ? 'gap-2 leading-relaxed' : 'gap-1 leading-6'
      }`}
    >
      {items.map((item, index) => (
        <li key={index}>{linkifyText ? linkify(item) : item}</li>
      ))}
    </ul>
  )
}

export const LegalInShort = ({ label, text }) => {
  if (!text) return null
  return (
    <div className="rounded-[10px] border-s-4 border-primary-1 bg-secondary-1/10 px-5 py-3">
      <p className={`m-0 text-700 ${typography.caption} leading-6`}>
        {label ? <span className="font-semibold">{label} </span> : null}
        <span className="italic">{linkify(text)}</span>
      </p>
    </div>
  )
}

export const LegalKeyPoint = ({ text }) => {
  const candidates = ['?', '؟'].map((q) => text.indexOf(q)).filter((i) => i >= 0)
  if (!candidates.length) return <span>{linkify(text)}</span>
  const splitAt = Math.min(...candidates) + 1
  return (
    <span>
      <span className="font-semibold text-700">{text.slice(0, splitAt)}</span>
      {linkify(text.slice(splitAt))}
    </span>
  )
}

export const LegalBlock = ({ block, inShortLabel }) => {
  switch (block?.type) {
    case 'subheading':
      return (
        <h3 className={`m-0 mt-1 font-semibold text-700 ${typography.body} leading-6`}>
          {block.text}
        </h3>
      )
    case 'inshort':
      return <LegalInShort label={inShortLabel} text={block.text} />
    case 'bullets':
      return <LegalBullets items={block.items || []} relaxed />
    case 'p':
    default:
      return <LegalParagraph text={block?.text} whitespace />
  }
}