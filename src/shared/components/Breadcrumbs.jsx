import { Fragment } from 'react'
import { CMS_TEXT_HOVER_CLASS, colorVar, getTextStyleVars } from '../../styles/cmsStyle.js'
import { typography } from '../../styles/typography.js'
import LinkedText from './backlinks/LinkedText.jsx'
import LocalizedLink from './LocalizedLink.jsx'

const SECTION_PADDING = {
  none: '',
  chrome: 'pt-5 md:pt-10 pb-4 md:pb-6',
  tight: 'py-4 md:py-6',
  default: 'py-6 md:py-10',
  loose: 'py-10 md:py-16',
}

const cx = (...parts) => parts.filter(Boolean).join(' ')

/**
 * Page trail. Static call sites pass `items` only and keep the original
 * caption / 600 / primary-1 look. CMS pages also send style + backlinks.
 */
const Breadcrumbs = ({
  items = [],
  separator = '/',
  ariaLabel = 'Breadcrumb',
  sectionPadding = 'none',
  showSectionBg = false,
  sectionBg = '100',
  separatorColor = '600',
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
  ...textStyle
}) => {
  const crumbs = Array.isArray(items) ? items.filter((item) => item?.label) : []
  if (!crumbs.length) return null

  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }

  const nav = (
    <nav className={cx('flex items-center gap-2', typography.caption)} aria-label={ariaLabel}>
      {crumbs.map((item, index) => (
        <Fragment key={`${item.label}-${index}`}>
          {index > 0 && (
            <span
              className="text-600 font-medium"
              style={{ color: colorVar(separatorColor) }}
            >
              {separator}
            </span>
          )}
          {item.href ? (
            <LocalizedLink
              href={item.href}
              className={cx(
                typography.caption,
                'text-600 font-medium hover:underline',
                CMS_TEXT_HOVER_CLASS,
              )}
              style={getTextStyleVars(textStyle, 'crumbColor', '600', 'medium')}
            >
              {item.label}
            </LocalizedLink>
          ) : (
            <span
              className={cx(typography.caption, 'text-primary-1 font-semibold', CMS_TEXT_HOVER_CLASS)}
              style={getTextStyleVars(textStyle, 'currentColor', 'primary-1', 'semibold')}
            >
              <LinkedText text={item.label} {...linkProps} />
            </span>
          )}
        </Fragment>
      ))}
    </nav>
  )

  const paddingClass = SECTION_PADDING[sectionPadding] || ''
  if (!paddingClass && !showSectionBg) return nav

  return (
    <div
      className={cx(
        paddingClass,
        'flex min-w-0 items-center justify-between gap-2 sm:gap-4',
      )}
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      {nav}
    </div>
  )
}

export default Breadcrumbs
