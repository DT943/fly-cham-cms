import { Chats } from '@phosphor-icons/react'
import { typography } from '../../styles/typography.js'
import {
  RADIUS,
  WEIGHT,
  SECTION_PADDING,
  colorVar,
  colorMix,
} from '../../styles/cmsStyle.js'
import LocalizedLink from './LocalizedLink.jsx'

const cx = (...parts) => parts.filter(Boolean).join(' ')

const PANEL_PADDING = {
  none: '',
  compact: 'px-4 py-4 md:px-6 md:py-5',
  default: 'px-5 py-5 md:px-8 md:py-6',
  spacious: 'px-6 py-6 md:px-10 md:py-8',
}

/**
 * Inline live-chat strip. Defaults match FAQs / Contact Us / Our Offices;
 * the CMS can override colours, padding, and visibility flags.
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
  buttonBg = 'primary-1',
  buttonText = '50',
  buttonFontWeight = 'medium',
  descriptionColor = '800',
  descriptionFontWeight = 'normal',
  panelBg = 'primary-1',
  panelBgOpacity = 10,
  panelRadius = '2xl',
  panelPadding = 'default',
  sectionBg = '100',
  showSectionBg = false,
  sectionPadding = 'default',
}) => (
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
                className={cx(
                  typography.itemTitle,
                  WEIGHT[titleFontWeight] || 'font-bold',
                  'm-0 md:hidden',
                )}
                style={{ color: colorVar(titleColor) }}
              >
                {title}
              </h2>
            )}
          </div>
          <div className="flex flex-col gap-1 min-w-0">
            {showTitle && title && (
              <h2
                className={cx(
                  typography.itemTitle,
                  WEIGHT[titleFontWeight] || 'font-semibold',
                  'm-0 hidden md:block',
                )}
                style={{ color: colorVar(titleColor) }}
              >
                {title}
              </h2>
            )}
            {showDescription && description && (
              <p
                className={cx(
                  typography.itemDescription,
                  WEIGHT[descriptionFontWeight] || 'font-normal',
                  'm-0 leading-relaxed',
                )}
                style={{ color: colorVar(descriptionColor) }}
              >
                {description}
              </p>
            )}
          </div>
        </div>
        {showButton && cta && (
          <LocalizedLink
            href={href}
            className={cx(
              typography.button,
              WEIGHT[buttonFontWeight] || 'font-medium',
              'no-underline rounded-lg px-10 py-3 w-full md:w-auto inline-flex items-center justify-center shrink-0 transition-colors',
              buttonBg === 'primary-1' && buttonText === '50'
                ? 'text-50 bg-primary-1 hover:bg-primary-800'
                : 'hover:opacity-90',
            )}
            style={
              buttonBg !== 'primary-1' || buttonText !== '50'
                ? {
                    backgroundColor: colorVar(buttonBg),
                    color: colorVar(buttonText),
                  }
                : undefined
            }
          >
            {cta}
          </LocalizedLink>
        )}
      </div>
    </div>
  </section>
)

export default LiveChatBanner
