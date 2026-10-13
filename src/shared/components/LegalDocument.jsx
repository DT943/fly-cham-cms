import { useMemo } from 'react'
import { typography } from '../../styles/typography.js'
import { CMS_TEXT_HOVER_CLASS, colorVar, getTextStyleVars } from '../../styles/cmsStyle.js'
import LinkedText from './backlinks/LinkedText.jsx'
import { linkClass } from './legalDocument/linkify.jsx'
import { LegalBullets, LegalKeyPoint, LegalParagraph } from './legalDocument/LegalDocumentBlocks.jsx'
import LegalDocumentNav from './legalDocument/LegalDocumentNav.jsx'
import LegalDocumentSection from './legalDocument/LegalDocumentSection.jsx'
import LegalDocumentContact from './legalDocument/LegalDocumentContact.jsx'

const COLUMN_GAP = {
  default: 'gap-6',
  relaxed: 'gap-7',
}

const PADDING = {
  none: '',
  tight: 'py-4 md:py-6',
  default: '',
  loose: 'py-10 md:py-16',
}

const cx = (...parts) => parts.filter(Boolean).join(' ')

/** Sidebar shows the heading without a leading "A." / "1." counter. */
const sidebarLabel = (title) =>
  title.replace(/^\s*(?:[A-Za-z]|\d{1,3})\s*[.)]\s+/, '').trim() || title

/**
 * Reusable legal document body for Terms, Privacy, Booking Terms, and Cookies.
 * `layout=sidebar` is nav + cards; `layout=sheet` is the bordered Cookies article.
 */
const LegalDocument = ({
  layout = 'sidebar',
  showNav = true,
  navItems = [],
  activeId = '',
  dateLine = '',
  introTitle = '',
  introBody = '',
  introParagraphs = [],
  introBullets = [],
  introAfter = '',
  summaryTitle = '',
  summaryIntro = '',
  summaryPoints = [],
  tocTitle = '',
  tocItems = [],
  inShortLabel = '',
  sections = [],
  contact,
  columnGap = 'default',
  showSectionBg = false,
  sectionBg = '100',
  sectionPadding = 'default',
  links = [],
  showLinks = true,
  ...textStyle
}) => {
  const hasIntro =
    introTitle ||
    introBody ||
    introParagraphs.length > 0 ||
    introBullets.length > 0 ||
    introAfter
  const hasSummary = Boolean(summaryTitle || summaryPoints.length)
  const hasToc = Boolean(tocTitle || tocItems.length)
  const hasContact = Boolean(
    contact &&
      (contact.title || contact.intro || contact.email || contact.phone || contact.company),
  )
  const sectionAnchors = useMemo(() => {
    const anchors = []
    if (introTitle) anchors.push({ id: 'legal-intro', label: sidebarLabel(introTitle) })
    sections.forEach((section, index) => {
      if (!section.title) return
      anchors.push({
        id: section.id || `legal-section-${index + 1}`,
        label: sidebarLabel(section.title),
      })
    })
    return anchors
  }, [introTitle, sections])
  const sidebarItems = sectionAnchors.length ? sectionAnchors : navItems
  const showSidebar = layout !== 'sheet' && showNav !== false && sidebarItems.length > 0

  if (
    !dateLine &&
    !hasIntro &&
    !hasSummary &&
    !hasToc &&
    !sections.length &&
    !hasContact &&
    !showSidebar
  ) {
    return null
  }

  const gapClass = COLUMN_GAP[columnGap] || COLUMN_GAP.default
  const linkProps = {
    links,
    enabled: showLinks !== false,
    linkColor: textStyle.linkColor,
    linkHoverColor: textStyle.linkHoverColor,
    linkFontWeight: textStyle.linkFontWeight,
    linkUnderline: textStyle.linkUnderline,
    linkItalic: textStyle.linkItalic,
  }

  const dateNode = dateLine ? (
    <p
      className={`m-0 font-normal text-700 ${typography.caption} ${CMS_TEXT_HOVER_CLASS}`}
      style={getTextStyleVars(textStyle, 'subtitleColor', '700', 'normal')}
    >
      {showLinks && links.length ? <LinkedText text={dateLine} {...linkProps} /> : dateLine}
    </p>
  ) : null

  const introNode = hasIntro ? (
    <div
      id={introTitle ? 'legal-intro' : undefined}
      className={cx('flex scroll-mt-24 flex-col', introTitle ? 'gap-4' : 'gap-3')}
    >
      {introTitle ? (
        <h2
          className={`m-0 font-semibold text-700 ${typography.sectionTitle} ${CMS_TEXT_HOVER_CLASS}`}
          style={getTextStyleVars(textStyle, 'titleColor', '700', 'semibold')}
        >
          {showLinks && links.length ? (
            <LinkedText text={introTitle} {...linkProps} />
          ) : (
            introTitle
          )}
        </h2>
      ) : null}
      {introBody ? (
        <p
          className={`m-0 whitespace-pre-line font-normal leading-relaxed text-700 ${typography.caption} ${CMS_TEXT_HOVER_CLASS}`}
          style={getTextStyleVars(textStyle, 'cardDescriptionColor', '700', 'normal')}
        >
          {showLinks && links.length ? (
            <LinkedText text={introBody} {...linkProps} />
          ) : (
            introBody
          )}
        </p>
      ) : null}
      {introParagraphs.map((paragraph, index) => (
        <LegalParagraph key={index} text={paragraph} whitespace />
      ))}
      {introBullets.length ? <LegalBullets items={introBullets} relaxed /> : null}
      {introAfter ? <LegalParagraph text={introAfter} whitespace /> : null}
    </div>
  ) : null

  const summaryNode = hasSummary ? (
    <section className="flex flex-col gap-4 rounded-[14px] bg-50 p-6">
      {summaryTitle ? (
        <h2 className={`m-0 font-semibold text-700 ${typography.itemTitle}`}>{summaryTitle}</h2>
      ) : null}
      {summaryIntro ? <LegalParagraph text={summaryIntro} linkifyText={false} /> : null}
      {summaryPoints.length ? (
        <ul
          className={`m-0 flex list-disc flex-col gap-3 ps-5 text-700 ${typography.caption} leading-relaxed`}
        >
          {summaryPoints.map((point, index) => (
            <li key={index}>
              <LegalKeyPoint text={point} />
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  ) : null

  const tocNode = hasToc ? (
    <nav className="flex flex-col gap-4 rounded-[14px] bg-50 p-6">
      {tocTitle ? (
        <h2 className={`m-0 font-semibold text-700 ${typography.itemTitle}`}>{tocTitle}</h2>
      ) : null}
      <ol className={`m-0 grid list-none gap-2 p-0 sm:grid-cols-2 ${typography.caption}`}>
        {tocItems.map((item, index) => (
          <li key={index}>
            <a href={item.href || `#${sections[index]?.id || `legal-section-${index + 1}`}`} className={linkClass}>
              {item.text || item}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  ) : null

  const sectionNodes = sections.map((section, index) => (
    <LegalDocumentSection
      key={section.id || index}
      section={section}
      index={index}
      inShortLabel={inShortLabel}
      style={textStyle}
    />
  ))

  const contactNode = hasContact ? <LegalDocumentContact {...contact} /> : null

  const stack = (
    <>
      {dateNode}
      {introNode}
      {summaryNode}
      {tocNode}
      {sectionNodes}
      {contactNode}
    </>
  )

  // Terms nests intro/cards/contact in an inner gap-6 under a gap-7 column
  // that also holds the date line.
  const column =
    layout !== 'sheet' && introTitle ? (
      <div className={cx('flex min-w-0 flex-1 flex-col', gapClass)}>
        {dateNode}
        <div className="flex flex-col gap-6">
          {introNode}
          {sectionNodes}
          {contactNode}
        </div>
      </div>
    ) : layout === 'sheet' ? (
      <div className="flex flex-col gap-10 rounded-[14px] border border-200 bg-50 px-5 py-10 md:px-8 md:py-14">
        {stack}
      </div>
    ) : (
      <div className={cx('flex min-w-0 flex-1 flex-col', gapClass)}>{stack}</div>
    )

  return (
    <div
      className={PADDING[sectionPadding] ?? PADDING.default}
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      {showSidebar ? (
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-6">
          <aside className="lg:sticky lg:top-24 lg:z-10 lg:w-[280px] lg:shrink-0 lg:self-start">
            <LegalDocumentNav items={sidebarItems} activeId={activeId} />
          </aside>
          {column}
        </div>
      ) : (
        column
      )}
    </div>
  )
}

export default LegalDocument
