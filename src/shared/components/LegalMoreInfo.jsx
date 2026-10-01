import LocalizedLink from './LocalizedLink.jsx'
import Container from './Container.jsx'
import { typography } from '../../styles/typography.js'
import { CMS_TEXT_HOVER_CLASS, colorMix, getTextStyleVars } from '../../styles/cmsStyle.js'
import LinkedText from './backlinks/LinkedText.jsx'
// Icons live in the cms-media bucket (legal/*.svg).
const LEGAL_ICONS_URL =
  'https://xbqrfakpcisqunyugrqt.supabase.co/storage/v1/object/public/cms-media/legal'

const ICONS = {
  shield: `${LEGAL_ICONS_URL}/shield-check.svg`,
  cookie: `${LEGAL_ICONS_URL}/cookie.svg`,
}

/**
 * Full-bleed "Get more information" band shared by every legal document page.
 * Cards are whole-card links, so title/description/CTA stay plain text.
 */
const LegalMoreInfo = ({
  title = '',
  cards = [],
  links = [],
  showLinks = true,
  showSectionBg = true,
  sectionBg,
  ...textStyle
}) => {
  if (!title && !cards.length) return null

  const linkProps = {
    links,
    enabled: showLinks !== false,
    linkColor: textStyle.linkColor,
    linkHoverColor: textStyle.linkHoverColor,
    linkFontWeight: textStyle.linkFontWeight,
    linkUnderline: textStyle.linkUnderline,
    linkItalic: textStyle.linkItalic,
  }

  return (
    <section
      className="w-full py-11"
      style={{
        backgroundColor: showSectionBg
          ? sectionBg
            ? undefined
            : colorMix('secondary-1', 15)
          : undefined,
        ...(showSectionBg && sectionBg
          ? { backgroundColor: `var(--color-${sectionBg})` }
          : {}),
      }}
    >
      <Container className="flex flex-col gap-6">
        {title ? (
          <h2
            className={`m-0 font-semibold text-700 ${typography.sectionTitle} ${CMS_TEXT_HOVER_CLASS}`}
            style={getTextStyleVars(textStyle, 'titleColor', '700', 'semibold')}
          >
            {showLinks && links.length ? (
              <LinkedText text={title} {...linkProps} />
            ) : (
              title
            )}
          </h2>
        ) : null}
        <div className="grid gap-4 lg:grid-cols-2">
          {cards.map((card, index) => (
            <LocalizedLink
              key={card.id || `${card.href}-${index}`}
              href={card.href || '#'}
              className="group flex overflow-hidden rounded-2xl bg-50 no-underline shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex w-[92px] shrink-0 items-center justify-center bg-main sm:w-[120px]">
                <img
                  src={ICONS[card.icon] || ICONS.shield}
                  alt=""
                  className="size-11"
                />
              </div>
              <div className="flex flex-col gap-2 px-4 py-6">
                <h3
                  className={`m-0 font-semibold text-primary-1 ${typography.itemTitle} leading-6 ${CMS_TEXT_HOVER_CLASS}`}
                  style={getTextStyleVars(textStyle, 'cardTitleColor', 'primary-1', 'semibold')}
                >
                  {card.title}
                </h3>
                <p
                  className={`m-0 font-normal leading-relaxed text-700 ${typography.caption} ${CMS_TEXT_HOVER_CLASS}`}
                  style={getTextStyleVars(
                    textStyle,
                    'cardDescriptionColor',
                    '700',
                    'normal',
                  )}
                >
                  {card.description}
                </p>
                <span
                  className={`mt-1 inline-flex items-center gap-1 font-semibold text-primary-1 ${typography.caption} group-hover:underline ${CMS_TEXT_HOVER_CLASS}`}
                  style={getTextStyleVars(textStyle, 'ctaColor', 'primary-1', 'semibold')}
                >
                  {card.cta}
                  <span aria-hidden className="rtl:-scale-x-100">
                    →
                  </span>
                </span>
              </div>
            </LocalizedLink>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default LegalMoreInfo
