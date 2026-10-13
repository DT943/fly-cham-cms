import { ArrowRight } from '@phosphor-icons/react'
import { CMS_TEXT_HOVER_CLASS, getTextStyleVars, colorVar } from '../../styles/cmsStyle.js'
import { resolvePhosphorIcon } from '../../cms/adapters/phosphorIcons.js'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'

const SECTION_PADDING = {
  none: '',
  tight: 'py-4 md:py-6',
  default: '',
  loose: 'py-10 md:py-16',
}

const cx = (...parts) => parts.filter(Boolean).join(' ')

/**
 * CMS-driven Quick Access: 28px title + four white link cards, each with a
 * round icon holder on top, the label, and a round arrow badge at the
 * bottom-end. 2 columns below lg, 4 from lg.
 */
const BusinessQuickAccess = ({
  title = '',
  items = [],
  sectionPadding = 'none',
  showSectionBg = false,
  sectionBg = '100',
  cardBg = '50',
  iconBg = '100',
  cardIconColor = '700',
  arrowBg = 'primary-1',
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
  if (!items.length && !title) return null

  const labelStyle = getTextStyleVars(textStyle, 'cardLabelColor', '700', 'semibold')
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
                  className="group flex min-h-37 min-w-0 flex-col gap-4 rounded-2xl p-4 no-underline sm:p-5"
                  style={{ backgroundColor: colorVar(cardBg) }}
                >
                  <span
                    className="flex size-10 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: colorVar(iconBg), color: colorVar(cardIconColor) }}
                  >
                    {Icon ? <Icon size={22} /> : null}
                  </span>
                  <span
                    className={cx('text-sm leading-[normal] sm:text-base', CMS_TEXT_HOVER_CLASS)}
                    style={labelStyle}
                  >
                    {item.label || item.shortLabel}
                  </span>
                  <span
                    className="mt-auto flex size-7 shrink-0 items-center justify-center self-end rounded-full transition-transform duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
                    style={{ backgroundColor: colorVar(arrowBg), color: colorVar(arrowColor) }}
                  >
                    <ArrowRight size={16} weight="bold" className="rtl:-scale-x-100" />
                  </span>
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
