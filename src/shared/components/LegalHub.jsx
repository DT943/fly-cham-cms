import { resolvePhosphorIcon } from '../../cms/adapters/phosphorIcons'
import {
  ArrowRight,
  Shield,
  Cookie,
  AirplaneTilt,
  Scroll,
  Scales,
  FileText,
  Lock,
  Globe,
} from '@phosphor-icons/react'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'
import { typography } from '../../styles/typography.js'
import {
  colorVar,
  CMS_TEXT_HOVER_CLASS,
  getTextStyleVars,
} from '../../styles/cmsStyle.js'

const ICON_MAP = {
  shield: Shield,
  cookie: Cookie,
  'airplane-tilt': AirplaneTilt,
  scroll: Scroll,
  scales: Scales,
  file: FileText,
  lock: Lock,
  globe: Globe,
}

function resolveIcon(name) {
  return ICON_MAP[name] || resolvePhosphorIcon(name)
}

/**
 * Legal hub: page title, subtitle, and 2-up directory cards.
 * Defaults match static `/legal` (Legal.jsx + LegalHubCard).
 */
const LegalHub = ({
  title = '',
  subtitle = '',
  items = [],
  links = [],
  showLinks = true,
  showHeader = true,
  showTitle = true,
  showSubtitle = true,
  showCards = true,
  showSectionBg = false,
  sectionBg = '100',
  ...textStyle
}) => {
  const visibleTitle = showHeader && showTitle && title
  const visibleSubtitle = showHeader && showSubtitle && subtitle
  const visibleHeader = visibleTitle || visibleSubtitle
  const visibleCards = showCards !== false && items.length > 0

  if (!visibleHeader && !visibleCards) return null

  const linkProps = {
    links,
    enabled: showLinks,
    linkColor: textStyle.linkColor,
    linkHoverColor: textStyle.linkHoverColor,
    linkFontWeight: textStyle.linkFontWeight,
    linkUnderline: textStyle.linkUnderline,
    linkItalic: textStyle.linkItalic,
  }

  return (
    <section
      className="flex flex-col gap-8 md:gap-10"
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      {visibleHeader ? (
        <div className="flex flex-col gap-4">
          {visibleTitle ? (
            <h1
              className={`m-0 font-bold leading-tight ${typography.pageTitle} lg:text-[64px] ${CMS_TEXT_HOVER_CLASS}`}
              style={getTextStyleVars(textStyle, 'titleColor', 'primary-1', 'bold')}
            >
              <LinkedText text={title} {...linkProps} />
            </h1>
          ) : null}
          {visibleSubtitle ? (
            <p
              className={`m-0 max-w-[900px] font-normal leading-relaxed text-700 ${typography.sectionDescription} ${CMS_TEXT_HOVER_CLASS}`}
              style={getTextStyleVars(textStyle, 'subtitleColor', '700', 'normal')}
            >
              <LinkedText text={subtitle} {...linkProps} />
            </p>
          ) : null}
        </div>
      ) : null}

      {visibleCards ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {items.map((item, index) => {
            const Icon = resolveIcon(item.icon)
            return (
              <LocalizedLink
                key={item.id || `${item.href}-${index}`}
                href={item.href || '#'}
                className="group flex h-full flex-col gap-6 rounded-2xl border border-200 bg-50 p-6 no-underline sm:p-8"
                style={
                  textStyle.cardBg
                    ? { backgroundColor: colorVar(textStyle.cardBg) }
                    : undefined
                }
              >
                <span
                  className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-100"
                  style={
                    textStyle.iconTileBg
                      ? { backgroundColor: colorVar(textStyle.iconTileBg) }
                      : undefined
                  }
                >
                  <Icon
                    size={40}
                    weight="regular"
                    className="text-main"
                    style={
                      textStyle.iconColor
                        ? { color: colorVar(textStyle.iconColor) }
                        : undefined
                    }
                  />
                </span>

                <div className="flex flex-1 flex-col gap-3">
                  <h2
                    className={`m-0 font-semibold text-primary-1 ${typography.itemTitle} ${CMS_TEXT_HOVER_CLASS}`}
                    style={getTextStyleVars(
                      textStyle,
                      'cardTitleColor',
                      'primary-1',
                      'semibold',
                    )}
                  >
                    {item.title}
                  </h2>
                  <p
                    className={`m-0 font-normal leading-relaxed text-700 ${typography.body} ${CMS_TEXT_HOVER_CLASS}`}
                    style={getTextStyleVars(
                      textStyle,
                      'cardDescriptionColor',
                      '700',
                      'normal',
                    )}
                  >
                    {item.description}
                  </p>
                </div>

                <span
                  className={`inline-flex items-center gap-2 font-semibold text-primary-1 ${typography.caption} group-hover:gap-3 ${CMS_TEXT_HOVER_CLASS}`}
                  style={getTextStyleVars(textStyle, 'ctaColor', 'primary-1', 'semibold')}
                >
                  {item.cta}
                  <ArrowRight
                    size={20}
                    weight="bold"
                    className="transition-all rtl:-scale-x-100"
                  />
                </span>
              </LocalizedLink>
            )
          })}
        </div>
      ) : null}
    </section>
  )
}

export default LegalHub
