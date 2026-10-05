import { CaretRight } from '@phosphor-icons/react'
import { CMS_TEXT_HOVER_CLASS, getTextStyleVars, colorVar } from '../../styles/cmsStyle.js'
import { resolvePhosphorIcon } from '../../cms/adapters/phosphorIcons.js'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'

const SECTION_PADDING = {
  none: '',
  tight: 'py-4 md:py-6',
  default: 'py-6 md:py-10',
  loose: 'py-10 md:py-16',
}

const cx = (...parts) => parts.filter(Boolean).join(' ')

/**
 * CMS-driven Quick Access (Figma 39658:410): 28px title + four white link
 * cards (102px, p-20, gap 16) with a 40px round icon holder, primary label and
 * 16px chevron. Below lg: 2-col grid, icon above the short label.
 * Mirrors the cms2 BusinessQuickAccess block.
 */
const BusinessQuickAccess = ({
  title = '',
  items = [],
  sectionPadding = 'none',
  showSectionBg = false,
  sectionBg = '100',
  cardBg = '50',
  iconBg = '100',
  iconColor = 'primary-1',
  chevronColor = 'primary-1',
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
  ...textStyle
}) => {
  if (!items.length && !title) return null

  const labelStyle = getTextStyleVars(textStyle, 'labelColor', 'primary-1', 'semibold')
  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }

  return (
    <section
      className={cx('w-full min-w-0', SECTION_PADDING[sectionPadding] ?? '')}
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      <div className="flex min-w-0 flex-col gap-4 md:gap-6">
        {title ? (
          <h2
            className={cx('m-0 text-2xl leading-[normal] md:text-[28px]', CMS_TEXT_HOVER_CLASS)}
            style={getTextStyleVars(textStyle, 'titleColor', '700', 'semibold')}
          >
            <LinkedText text={title} {...linkProps} />
          </h2>
        ) : null}

        {items.length ? (
          <div className="grid min-w-0 grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {items.map((item, index) => {
              const Icon = resolvePhosphorIcon(item.icon)
              return (
                <LocalizedLink
                  key={item.id ? `${item.id}-${index}` : index}
                  href={item.href || '#'}
                  className="flex min-w-0 flex-col gap-3 rounded-[8px] p-4 no-underline sm:p-5 lg:min-h-[102px] lg:flex-row lg:items-center lg:gap-4 lg:p-5"
                  style={{ backgroundColor: colorVar(cardBg) }}
                >
                  <span
                    className="flex size-10 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: colorVar(iconBg), color: colorVar(iconColor) }}
                  >
                    {Icon ? <Icon size={24} /> : null}
                  </span>
                  <span
                    className={cx('text-sm leading-[normal] sm:text-base lg:hidden', CMS_TEXT_HOVER_CLASS)}
                    style={labelStyle}
                  >
                    {item.shortLabel || item.label}
                  </span>
                  <span
                    className={cx(
                      'hidden min-w-0 flex-1 text-base leading-[normal] lg:inline',
                      CMS_TEXT_HOVER_CLASS,
                    )}
                    style={labelStyle}
                  >
                    {item.label}
                  </span>
                  <CaretRight
                    size={16}
                    className="hidden shrink-0 lg:block rtl:-scale-x-100"
                    style={{ color: colorVar(chevronColor) }}
                  />
                </LocalizedLink>
              )
            })}
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default BusinessQuickAccess
