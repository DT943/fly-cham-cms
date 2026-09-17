import { Chats } from '@phosphor-icons/react'
import { typography } from '../../styles/typography.js'
import {
  RADIUS,
  SECTION_PADDING,
  CMS_TEXT_HOVER_CLASS,
  colorVar,
  colorMix,
  getTextStyleVars,
} from '../../styles/cmsStyle.js'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'

const cx = (...parts) => parts.filter(Boolean).join(' ')

const PANEL_PADDING = {
  none: '',
  compact: 'px-4 py-4 md:px-6 md:py-5',
  default: 'px-5 py-5 md:px-8 md:py-6',
  spacious: 'px-6 py-6 md:px-10 md:py-8',
}

/**
 * Inline live-chat strip. Defaults match FAQs / Contact Us / Our Offices;
 * the CMS can override colours, padding, visibility flags, and per-role hover
 * (title / description / button text color + weight via the *Hover style keys).
 */
const LiveChatBanner = ({
  title,
  description,
  cta,
  href = '#',
  showIcon = true,
  iconColor = '700',
  showTitle = true,
  showButton = true,
  showDescription = true,
  titleColor = '700',
  titleFontWeight,
  titleColorHover,
  titleFontWeightHover,
  buttonBg = 'primary-1',
  buttonText = '50',
  buttonTextFontWeight = 'medium',
  buttonTextHover,
  buttonTextFontWeightHover,
  descriptionColor = '800',
  descriptionFontWeight = 'normal',
  descriptionColorHover,
  descriptionFontWeightHover,
  panelBg = 'primary-1',
  panelBgOpacity = 10,
  panelRadius = '2xl',
  panelPadding = 'default',
  sectionBg = '100',
  showSectionBg = false,
  sectionPadding = 'default',
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
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
  const titleStyleKeys = {
    titleColor,
    titleFontWeight,
    titleColorHover,
    titleFontWeightHover,
  }
  const descriptionStyleKeys = {
    descriptionColor,
    descriptionFontWeight,
    descriptionColorHover,
    descriptionFontWeightHover,
  }
  const buttonTextStyleKeys = {
    buttonText,
    buttonTextFontWeight,
    buttonTextHover,
    buttonTextFontWeightHover,
  }

  const isDefaultButtonBg = buttonBg === 'primary-1'

  return (
    <section
      className={cx(
        SECTION_PADDING[sectionPadding],
        showSectionBg && 'rounded-2xl px-4 md:px-6',
      )}
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      <div
        className={cx(
          RADIUS[panelRadius] || RADIUS['2xl'],
          PANEL_PADDING[panelPadding] || PANEL_PADDING.default,
        )}
        style={{ backgroundColor: colorMix(panelBg, panelBgOpacity) }}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-3 min-w-0">
            <div className="flex items-center gap-3 md:contents">
              {showIcon && (
                <Chats
                  size={38}
                  weight="regular"
                  className="shrink-0"
                  style={{ color: colorVar(iconColor) }}
                />
              )}
              {showTitle && title && (
                <h2
                  className={cx(typography.itemTitle, 'm-0 md:hidden', CMS_TEXT_HOVER_CLASS)}
                  style={getTextStyleVars(titleStyleKeys, 'titleColor', '700', 'bold')}
                >
                  <LinkedText text={title} {...linkProps} />
                </h2>
              )}
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              {showTitle && title && (
                <h2
                  className={cx(typography.itemTitle, 'm-0 hidden md:block', CMS_TEXT_HOVER_CLASS)}
                  style={getTextStyleVars(titleStyleKeys, 'titleColor', '700', 'semibold')}
                >
                  <LinkedText text={title} {...linkProps} />
                </h2>
              )}
              {showDescription && description && (
                <p
                  className={cx(
                    typography.itemDescription,
                    'm-0 leading-relaxed',
                    CMS_TEXT_HOVER_CLASS,
                  )}
                  style={getTextStyleVars(descriptionStyleKeys, 'descriptionColor', '800', 'normal')}
                >
                  <LinkedText text={description} {...linkProps} />
                </p>
              )}
            </div>
          </div>
          {showButton && cta && (
            <LocalizedLink
              href={href}
              className={cx(
                typography.button,
                'no-underline rounded-lg px-10 py-3 w-full md:w-auto inline-flex items-center justify-center shrink-0 transition-colors',
                isDefaultButtonBg ? 'bg-primary-1 hover:bg-primary-800' : 'hover:opacity-90',
                CMS_TEXT_HOVER_CLASS,
              )}
              style={{
                ...(isDefaultButtonBg ? {} : { backgroundColor: colorVar(buttonBg) }),
                ...getTextStyleVars(buttonTextStyleKeys, 'buttonText', '50', 'medium'),
              }}
            >
              {cta}
            </LocalizedLink>
          )}
        </div>
      </div>
    </section>
  )
}

export default LiveChatBanner
