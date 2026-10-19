import { ArrowRight, Cookie, Phone, Question, ShieldCheck } from '@phosphor-icons/react'
import LocalizedLink from './LocalizedLink.jsx'
import Container from './Container.jsx'
import { typography } from '../../styles/typography.js'
import { CMS_TEXT_HOVER_CLASS, colorMix, getTextStyleVars } from '../../styles/cmsStyle.js'
import LinkedText from './backlinks/LinkedText.jsx'

const ICONS = {
  shield: ShieldCheck,
  cookie: Cookie,
  question: Question,
  phone: Phone,
}

/**
 * Full-bleed "Get more information" band shared by legal document pages.
 * Each card is a whole-card link: teal start accent, icon, title, description,
 * and an end-aligned text CTA with arrow.
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
          {cards.map((card, index) => {
            const Icon = ICONS[card.icon] || ICONS.shield
            return (
              <LocalizedLink
                key={card.id || `${card.href}-${index}`}
                href={card.href || '#'}
                aria-label={card.cta ? `${card.title} — ${card.cta}` : undefined}
                className="group flex gap-4 overflow-hidden rounded-2xl border-s-4 border-solid border-s-primary-1 bg-50 p-5 no-underline md:gap-5 md:p-6"
              >
                <span className="flex size-10 shrink-0 items-center justify-center text-primary-1 md:size-12">
                  <Icon size={28} aria-hidden />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
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
                  {card.cta ? (
                    <span
                      className={`mt-auto inline-flex items-center gap-1.5 self-end pt-2 font-semibold text-primary-1 ${typography.caption} ${CMS_TEXT_HOVER_CLASS}`}
                      style={getTextStyleVars(textStyle, 'ctaColor', 'primary-1', 'semibold')}
                    >
                      {card.cta}
                      <ArrowRight
                        size={14}
                        weight="bold"
                        className="transition-transform duration-300 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                        aria-hidden
                      />
                    </span>
                  ) : (
                    <span
                      aria-hidden
                      className="mt-auto flex size-8 shrink-0 items-center justify-center self-end rounded-full bg-primary-1 text-50 transition-transform duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
                    >
                      <ArrowRight size={16} weight="bold" className="rtl:-scale-x-100" />
                    </span>
                  )}
                </div>
              </LocalizedLink>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

export default LegalMoreInfo
