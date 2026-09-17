import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'
import LegalSidebar from './LegalSidebar.jsx'

const linkClass = 'font-medium text-primary-1 no-underline hover:underline break-words'

// Turn raw text into React nodes, auto-linking e-mail addresses and http(s)
// URLs. Trailing sentence punctuation is kept out of URL links.
const linkify = (text) => {
  if (!text) return text
  const regex = /(https?:\/\/[^\s]+|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g
  const nodes = []
  let lastIndex = 0
  let match
  let key = 0

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index))

    let token = match[0]
    let trailing = ''
    const isEmail = token.includes('@')
    if (!isEmail) {
      // Strip punctuation that belongs to the sentence, not the URL.
      const trimmed = token.replace(/[.,;:)\]]+$/, '')
      trailing = token.slice(trimmed.length)
      token = trimmed
    }

    const href = isEmail ? `mailto:${token}` : token
    nodes.push(
      <a
        key={key++}
        href={href}
        className={linkClass}
        {...(isEmail ? {} : { target: '_blank', rel: 'noreferrer' })}
      >
        {token}
      </a>,
    )
    if (trailing) nodes.push(trailing)
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex))
  return nodes
}

const Paragraph = ({ children }) => (
  <p className={`m-0 whitespace-pre-line font-normal leading-relaxed text-700 ${typography.caption}`}>
    {children}
  </p>
)

const Bullets = ({ items }) => (
  <ul className={`m-0 flex list-disc flex-col gap-2 ps-5 text-700 ${typography.caption} leading-relaxed`}>
    {items.map((item, index) => (
      <li key={index}>{linkify(item)}</li>
    ))}
  </ul>
)

const Block = ({ block, inShortLabel }) => {
  switch (block.type) {
    case 'subheading':
      return (
        <h3 className={`m-0 mt-1 font-semibold text-700 ${typography.body} leading-6`}>{block.text}</h3>
      )
    case 'inshort':
      return (
        <div className="rounded-[10px] border-s-4 border-primary-1 bg-secondary-1/10 px-5 py-3">
          <p className={`m-0 text-700 ${typography.caption} leading-6`}>
            <span className="font-semibold">{inShortLabel} </span>
            <span className="italic">{linkify(block.text)}</span>
          </p>
        </div>
      )
    case 'bullets':
      return <Bullets items={block.items} />
    case 'p':
    default:
      return <Paragraph>{linkify(block.text)}</Paragraph>
  }
}

// Bold the leading question in a summary key point ("Question? Answer.").
const KeyPoint = ({ text }) => {
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

const sectionId = (index) => `privacy-section-${index + 1}`

/**
 * Full privacy-notice document: intro, key-points summary, table of contents,
 * and the numbered sections (each a card with "In Short" callouts and lists).
 * Shares the cross-page legal sidebar with the Terms page.
 */
const PrivacyDocument = () => {
  const { t } = useTranslation()
  const base = 'legal.privacy'

  const intro = t(`${base}.intro`, { returnObjects: true }) || {}
  const summary = t(`${base}.summary`, { returnObjects: true }) || {}
  const toc = t(`${base}.toc`, { returnObjects: true }) || {}
  const sections = t(`${base}.sections`, { returnObjects: true }) || []
  const inShortLabel = t(`${base}.inShortLabel`)

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-6">
      <aside className="lg:w-[280px] lg:shrink-0">
        <LegalSidebar activeId="privacy" />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <p className={`m-0 font-normal text-700 ${typography.caption}`}>{t(`${base}.lastUpdated`)}</p>

        {/* Intro */}
        <div className="flex flex-col gap-3">
          {(intro.paragraphs || []).map((paragraph, index) => (
            <Paragraph key={index}>{linkify(paragraph)}</Paragraph>
          ))}
          {intro.bullets?.length ? <Bullets items={intro.bullets} /> : null}
          {intro.afterBullets ? <Paragraph>{linkify(intro.afterBullets)}</Paragraph> : null}
        </div>

        {/* Summary of key points */}
        <section className="flex flex-col gap-4 rounded-[14px] bg-50 p-6">
          <h2 className={`m-0 font-semibold text-700 ${typography.itemTitle}`}>{summary.title}</h2>
          <Paragraph>{summary.intro}</Paragraph>
          <ul className={`m-0 flex list-disc flex-col gap-3 ps-5 text-700 ${typography.caption} leading-relaxed`}>
            {(summary.points || []).map((point, index) => (
              <li key={index}>
                <KeyPoint text={point} />
              </li>
            ))}
          </ul>
        </section>

        {/* Table of contents */}
        <nav className="flex flex-col gap-4 rounded-[14px] bg-50 p-6">
          <h2 className={`m-0 font-semibold text-700 ${typography.itemTitle}`}>{toc.title}</h2>
          <ol className={`m-0 grid list-none gap-2 p-0 sm:grid-cols-2 ${typography.caption}`}>
            {(toc.items || []).map((item, index) => (
              <li key={index}>
                <a href={`#${sectionId(index)}`} className={linkClass}>
                  {item}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Numbered sections */}
        {sections.map((section, index) => (
          <section
            key={index}
            id={sectionId(index)}
            className="flex scroll-mt-24 flex-col gap-3 rounded-[14px] bg-50 p-6"
          >
            <h2 className={`m-0 font-semibold text-700 ${typography.itemTitle} leading-6`}>
              {section.title}
            </h2>
            {(section.blocks || []).map((block, blockIndex) => (
              <Block key={blockIndex} block={block} inShortLabel={inShortLabel} />
            ))}
          </section>
        ))}
      </div>
    </div>
  )
}

export default PrivacyDocument
