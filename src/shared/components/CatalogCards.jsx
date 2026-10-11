import {
  CMS_TEXT_HOVER_CLASS,
  colorVar,
  getTextStyleVars,
} from '../../styles/cmsStyle.js'
import { resolvePhosphorIcon } from '../../cms/adapters/phosphorIcons.js'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'

const COLUMNS_CLASS = {
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-3',
}
const SECTION_PADDING = {
  none: '',
  tight: 'py-4 md:py-6',
  default: '',
  loose: 'py-10 md:py-16',
}
const TITLE_SIZE = 'text-2xl leading-[normal] md:text-[28px]'
const SUBTITLE_SIZE = 'text-base leading-[normal]'
const CARD_TITLE_SIZE = 'text-xl leading-[normal]'
const BODY_SIZE = 'text-base leading-[normal]'
const LINK_SIZE = 'text-base leading-[19px]'

function LearnMore({ item, style }) {
  if (style.showLink === false || !item.cta || !item.href) return null
  const Icon = style.showLinkIcon !== false && item.icon ? resolvePhosphorIcon(item.icon) : null
  return (
    <LocalizedLink href={item.href} className={`inline-flex items-center gap-1.5 no-underline ${LINK_SIZE}`}>
      {Icon ? (
        <span
          className="flex size-[34px] shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: colorVar(style.arrowBadgeBg || 'primary-1') }}
        >
          <Icon size={16} weight="bold" aria-hidden className="rtl:-scale-x-100" style={{ color: colorVar(style.arrowColor || '50') }} />
        </span>
      ) : null}
      <span className={CMS_TEXT_HOVER_CLASS} style={getTextStyleVars(style, 'learnMoreColor', 'primary-1', 'semibold')}>
        {item.cta}
      </span>
    </LocalizedLink>
  )
}

/** Centered header, rounded photos, and captions underneath (Figma 40392:21112). */
const CatalogCards = ({
  title = '',
  subtitle = '',
  items = [],
  columns = '3',
  sectionPadding = 'none',
  showSectionBg = false,
  sectionBg = '100',
  showHeader = true,
  showSubtitle = true,
  headerAlign = 'center',
  showImageBadge = false,
  badgeBg = 'secondary',
  badgeIconColor = '50',
  showLink = false,
  showLinkIcon = true,
  arrowBadgeBg = 'primary-1',
  arrowColor = '50',
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
  ...textStyle
}) => {
  const list = Array.isArray(items) ? items : []
  if (!title && !subtitle && !list.length) return null
  const style = { ...textStyle, showLink, showLinkIcon, arrowBadgeBg, arrowColor, showLinks, linkColor, linkHoverColor, linkFontWeight, linkUnderline, linkItalic, showImageBadge, badgeBg, badgeIconColor }
  const linkProps = { links, enabled: showLinks, linkColor, linkHoverColor, linkFontWeight, linkUnderline, linkItalic }
  const columnsClass = COLUMNS_CLASS[String(columns)] || COLUMNS_CLASS[3]
  const paddingClass = SECTION_PADDING[sectionPadding] ?? ''
  const headerClass = headerAlign === 'start' ? 'items-start text-start' : 'items-center text-center'
  const paint = (value, fallback) => (typeof value === 'string' && (value.startsWith('#') || value.startsWith('rgb')) ? value : colorVar(value || fallback))

  return (
    <section className={`w-full ${paddingClass}`.trim()} style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}>
      <div className="flex flex-col gap-6">
        {showHeader && (title || subtitle) ? (
          <div className={`flex flex-col gap-3 ${headerClass}`}>
            {title ? (
              <h2 className={`m-0 ${TITLE_SIZE} ${CMS_TEXT_HOVER_CLASS}`} style={getTextStyleVars(style, 'titleColor', '700', 'semibold')}>
                <LinkedText text={title} {...linkProps} />
              </h2>
            ) : null}
            {showSubtitle && subtitle ? (
              <p className={`m-0 max-w-[780px] ${SUBTITLE_SIZE} ${CMS_TEXT_HOVER_CLASS}`} style={getTextStyleVars(style, 'subtitleColor', '700', 'normal')}>
                <LinkedText text={subtitle} {...linkProps} />
              </p>
            ) : null}
          </div>
        ) : null}
        {list.length ? (
          <div className={`grid items-start gap-4 ${columnsClass}`}>
            {list.map((item, index) => {
              const BadgeIcon = showImageBadge && item.badgeIcon ? resolvePhosphorIcon(item.badgeIcon) : null
              return (
              <article key={item.id || index} className="flex min-w-0 flex-col items-center gap-6 text-center">
                {item.imageUrl ? (
                  <div className="relative h-[220px] w-full overflow-hidden rounded-3xl md:h-[292px]">
                    <img src={item.imageUrl} alt={item.imageAlt || ''} className="size-full object-cover" />
                    {BadgeIcon ? (
                      <span
                        className="absolute left-1/2 top-1/2 flex size-[34px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
                        style={{ backgroundColor: paint(badgeBg, 'secondary') }}
                      >
                        <BadgeIcon size={18} weight="bold" aria-hidden style={{ color: paint(badgeIconColor, '50') }} />
                      </span>
                    ) : null}
                  </div>
                ) : null}
                <div className="flex w-full flex-col items-center gap-2.5">
                  {item.title ? (
                    <h3 className={`m-0 w-full ${CARD_TITLE_SIZE} ${CMS_TEXT_HOVER_CLASS}`} style={getTextStyleVars(style, 'cardTitleColor', '700', 'semibold')}>
                      <LinkedText text={item.title} {...linkProps} />
                    </h3>
                  ) : null}
                  {item.description ? (
                    <p className={`m-0 w-full ${BODY_SIZE} ${CMS_TEXT_HOVER_CLASS}`} style={getTextStyleVars(style, 'cardDescriptionColor', '600', 'normal')}>
                      <LinkedText text={item.description} {...linkProps} />
                    </p>
                  ) : null}
                  <LearnMore item={item} style={style} />
                </div>
              </article>
              )
            })}
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default CatalogCards
