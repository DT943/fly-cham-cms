import { typography } from '../../../styles/typography.js'
import { colorMix, CMS_TEXT_HOVER_CLASS, getTextStyleVars } from '../../../styles/cmsStyle.js'
import {
  LegalBlock,
  LegalBullets,
  LegalParagraph,
  readingLabel,
} from './LegalDocumentBlocks.jsx'
import LegalDocumentContact from './LegalDocumentContact.jsx'

const TintCard = ({ title, body, note }) => (
  <div className="flex flex-col gap-3 rounded-[14px] border border-200 bg-gradient-to-b from-100 to-50 p-6">
    {title ? (
      <h3 className={`m-0 font-medium text-700 ${typography.body} leading-6`}>{title}</h3>
    ) : null}
    {body ? (
      <p className={`m-0 font-normal leading-relaxed text-700 ${typography.body}`}>{body}</p>
    ) : null}
    {note ? (
      <p className={`m-0 font-normal leading-relaxed text-700 ${typography.body}`}>{note}</p>
    ) : null}
  </div>
)

const SectionTitle = ({ children, className = '', style }) => (
  <h2
    className={`m-0 font-semibold text-700 ${typography.itemTitle} leading-6 ${className}`.trim()}
    style={style}
  >
    {children}
  </h2>
)

/**
 * One document section. `variant` selects the visual used on each legal page:
 * card (terms/privacy/booking), prose/tint/grid/preferences (cookies).
 */
const LegalDocumentSection = ({
  section = {},
  index,
  inShortLabel = '',
  style = {},
}) => {
  const variant = section.variant || 'card'
  const title = readingLabel(section.title || '')
  const body = section.body || ''
  const note = section.note || ''
  const items = section.items || []
  const blocks = section.blocks || []
  const methods = section.methods || []
  const id = section.id || `legal-section-${index + 1}`

  if (variant === 'contact-company') {
    return (
      <div id={id} className="scroll-mt-24">
        <LegalDocumentContact
          variant="company"
          title={title}
          intro={body}
          company={section.company}
          department={section.department}
          emailLabel={section.emailLabel}
          email={section.email}
          phoneLabel={section.phoneLabel}
          phone={section.phone}
        />
      </div>
    )
  }

  if (variant === 'prose') {
    return (
      <section id={id} className="flex scroll-mt-24 flex-col gap-4">
        {title ? (
          <h2 className={`m-0 font-semibold text-700 ${typography.itemTitle} leading-7`}>
            {title}
          </h2>
        ) : null}
        {body ? (
          <p className={`m-0 font-normal leading-relaxed text-700 ${typography.body}`}>{body}</p>
        ) : null}
      </section>
    )
  }

  if (variant === 'tint-stack') {
    return (
      <section id={id} className="flex scroll-mt-24 flex-col gap-4">
        {title ? (
          <h2 className={`m-0 font-semibold text-700 ${typography.itemTitle} leading-7`}>
            {title}
          </h2>
        ) : null}
        <div className="flex flex-col gap-4">
          {(section.cards || []).map((card, cardIndex) => (
            <TintCard
              key={cardIndex}
              title={card.title}
              body={card.body}
              note={card.note}
            />
          ))}
        </div>
      </section>
    )
  }

  if (variant === 'grid-tiles') {
    return (
      <section id={id} className="flex scroll-mt-24 flex-col gap-4">
        {title ? (
          <h2 className={`m-0 font-semibold text-700 ${typography.itemTitle} leading-7`}>
            {title}
          </h2>
        ) : null}
        {body ? (
          <p className={`m-0 font-normal leading-relaxed text-700 ${typography.body}`}>{body}</p>
        ) : null}
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item, itemIndex) => (
            <div key={itemIndex} className="rounded-[14px] bg-100 px-5 py-4">
              <p className={`m-0 font-normal text-700 ${typography.body}`}>{item}</p>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (variant === 'preferences') {
    return (
      <section id={id} className="flex scroll-mt-24 flex-col gap-4">
        {title ? (
          <h2 className={`m-0 font-semibold text-700 ${typography.itemTitle} leading-7`}>
            {title}
          </h2>
        ) : null}
        {body ? (
          <div
            className="rounded-[10px] border-s-4 border-secondary-900 px-6 py-5"
            style={{ backgroundColor: colorMix('secondary-900', 10) }}
          >
            <p className={`m-0 font-normal leading-relaxed text-700 ${typography.body}`}>
              {body}
            </p>
          </div>
        ) : null}
        <div className="flex flex-col gap-4">
          {methods.map((method, methodIndex) => (
            <div
              key={methodIndex}
              className="flex flex-col gap-2 rounded-[14px] bg-100 p-6"
            >
              <h3 className={`m-0 font-medium text-700 ${typography.body} leading-6`}>
                {method.title}
              </h3>
              <p className={`m-0 font-normal leading-relaxed text-700 ${typography.body}`}>
                {method.body}
              </p>
            </div>
          ))}
        </div>
        {note ? (
          <div
            className="rounded-[14px] px-5 py-5"
            style={{ backgroundColor: colorMix('main', 5) }}
          >
            <p className={`m-0 font-normal leading-relaxed text-700 ${typography.body}`}>
              {note}
            </p>
          </div>
        ) : null}
      </section>
    )
  }

  if (variant === 'tint-grid') {
    return (
      <section id={id} className="flex scroll-mt-24 flex-col gap-4">
        {title ? (
          <h2 className={`m-0 font-semibold text-700 ${typography.itemTitle} leading-7`}>
            {title}
          </h2>
        ) : null}
        {body ? (
          <p className={`m-0 font-normal leading-relaxed text-700 ${typography.body}`}>{body}</p>
        ) : null}
        <div className="grid gap-6 sm:grid-cols-2">
          {(section.cards || []).map((card, cardIndex) => (
            <TintCard key={cardIndex} title={card.title} body={card.body} />
          ))}
        </div>
      </section>
    )
  }

  // Default: LegalSectionCard (terms / privacy / booking).
  return (
    <section
      id={id}
      className="flex scroll-mt-24 flex-col gap-3 rounded-[14px] bg-50 p-6"
    >
      {title ? (
        <SectionTitle
          className={CMS_TEXT_HOVER_CLASS}
          style={getTextStyleVars(style, 'cardTitleColor', '700', 'semibold')}
        >
          {title}
        </SectionTitle>
      ) : null}
      {body ? <LegalParagraph text={body} linkifyText={false} /> : null}
      {blocks.map((block, blockIndex) => (
        <LegalBlock key={blockIndex} block={block} inShortLabel={inShortLabel} />
      ))}
      {items.length ? <LegalBullets items={items} linkifyText={false} /> : null}
    </section>
  )
}

export default LegalDocumentSection
