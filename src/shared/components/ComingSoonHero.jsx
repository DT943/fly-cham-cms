import { ArrowLeft } from '@phosphor-icons/react'
import Container from './Container.jsx'
import LinkedText from './backlinks/LinkedText.jsx'
import LocalizedLink from './LocalizedLink.jsx'
import { typography } from '../../styles/typography.js'
import {
  CMS_TEXT_HOVER_CLASS,
  colorVar,
  getButtonStyle,
  getTextStyleVars,
} from '../../styles/cmsStyle.js'

/**
 * CMS "coming-soon-hero" block — the centered title, description, back-home
 * button and plane illustration from the Coming Soon page. The newsletter
 * under it is a separate block.
 */
const ComingSoonHero = ({
  imageUrl,
  imageAlt = '',
  title = '',
  description = '',
  ctaLabel = '',
  ctaHref = '/',
  backgroundColor = '100',
  showButton = true,
  showImage = true,
  buttonBg = 'primary-1',
  buttonBgHover = 'primary-800',
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
  ...textStyle
}) => {
  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }
  const button = getButtonStyle(
    { ...textStyle, buttonBg, buttonBgHover },
    {
      bgKey: 'buttonBg',
      bgFallback: 'primary-1',
      bgHoverFallback: 'primary-800',
      textKey: 'buttonText',
      textFallback: '50',
      weightFallback: 'medium',
    },
  )

  return (
    <section className="w-full" style={{ backgroundColor: colorVar(backgroundColor) }}>
      <Container className="flex flex-col items-center pt-12 text-center md:pt-20">
        {title ? (
          <h1
            className={`m-0 leading-tight ${typography.pageTitle} ${CMS_TEXT_HOVER_CLASS}`}
            style={getTextStyleVars(textStyle, 'titleColor', '700', 'semibold')}
          >
            <LinkedText text={title} {...linkProps} />
          </h1>
        ) : null}

        {description ? (
          <p
            className={`m-0 mt-4 max-w-140 whitespace-pre-line text-sm leading-relaxed md:text-base ${CMS_TEXT_HOVER_CLASS}`}
            style={getTextStyleVars(textStyle, 'descriptionColor', '700', 'normal')}
          >
            <LinkedText text={description} {...linkProps} />
          </p>
        ) : null}

        {showButton !== false && ctaLabel ? (
          <LocalizedLink
            href={ctaHref || '/'}
            className={`mt-6 inline-flex h-11 items-center gap-3 rounded-lg px-5 no-underline transition-colors md:h-12 md:px-6 ${typography.button} ${button.className}`}
            style={button.style}
          >
            <ArrowLeft size={16} weight="bold" className="rtl:-scale-x-100" aria-hidden />
            {ctaLabel}
          </LocalizedLink>
        ) : null}

        {showImage !== false && imageUrl ? (
          <img
            src={imageUrl}
            alt={imageAlt}
            className="mt-8 block h-auto w-full max-w-140 md:mt-6"
          />
        ) : null}
      </Container>
    </section>
  )
}

export default ComingSoonHero
