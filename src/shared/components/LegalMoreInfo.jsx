import { ArrowRight, Cookie, ShieldCheck } from '@phosphor-icons/react'
import LocalizedLink from './LocalizedLink.jsx'
import Container from './Container.jsx'
import { CMS_TEXT_HOVER_CLASS, colorMix, getTextStyleVars } from '../../styles/cmsStyle.js'
import LinkedText from './backlinks/LinkedText.jsx'
import arrowIcon from '../../assets/icons/legal/arrow-down.svg'
import cookieIcon from '../../assets/icons/legal/cookie.svg'
import shieldIcon from '../../assets/icons/legal/shield-check.svg'

const CardIcon = ({ icon }) => {
  if (icon === 'cookie') {
    return <img src={cookieIcon} alt="" width={60} height={60} />
  }
  return (
    <span className="flex size-[60px] shrink-0 items-center justify-center rounded-full bg-[#F5F5F4]">
      <img src={shieldIcon} alt="" width="32.7273" height="32.7273" />
    </span>
  )
}

/**
 * Full-bleed "Get more information" band shared by every legal document page.
 * Each card is one link. The arrow is the action; the label stays in the card title.
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
            className={`m-0 text-2xl font-semibold leading-[22px] text-[#3E3E3B] ${CMS_TEXT_HOVER_CLASS}`}
            style={getTextStyleVars(textStyle, 'titleColor', '700', 'semibold')}
          >
            {showLinks && links.length ? (
              <LinkedText text={title} {...linkProps} />
            ) : (
              title
            )}
          </h2>
        ) : null}
        <div className="grid gap-5 md:grid-cols-2">
          {cards.map((card, index) => (
            <LocalizedLink
              key={card.id || `${card.href}-${index}`}
              href={card.href || '#'}
              className="flex min-h-[240px] cursor-pointer flex-col justify-between rounded-xl bg-white p-6 no-underline"
            >
              <div className="flex w-full flex-col items-start gap-4">
                <CardIcon icon={card.icon} />
                <div className="flex w-full flex-col gap-2">
                  <h3
                    className={`m-0 text-lg font-semibold leading-6 text-[#3E3E3B] ${CMS_TEXT_HOVER_CLASS}`}
                    style={getTextStyleVars(textStyle, 'cardTitleColor', '700', 'semibold')}
                  >
                    {card.title}
                  </h3>
                  <p
                    className={`m-0 text-sm font-normal leading-[22px] text-[#3E3E3B] ${CMS_TEXT_HOVER_CLASS}`}
                    style={getTextStyleVars(
                      textStyle,
                      'cardDescriptionColor',
                      '700',
                      'normal',
                    )}
                  >
                    {card.description}
                  </p>
                </div>
              </div>
              <img
                src={arrowIcon}
                alt=""
                width={33}
                height={33}
                className="shrink-0 -rotate-90 self-end rtl:rotate-90"
              />
            </LocalizedLink>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default LegalMoreInfo
