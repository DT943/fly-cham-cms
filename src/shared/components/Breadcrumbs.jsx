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
 * The last crumb always uses Focus color (active page).
 */
const Breadcrumbs = ({
  items = [],
  separator = '/',
  ariaLabel = 'Breadcrumb',
  sectionPadding = 'none',
  showSectionBg = false,
  sectionBg = '100',
  separatorColor = '600',
  crumbUnderline = false,
  focusColor = 'primary-1',
  focusFontWeight,
  focusColorHover,
  focusFontWeightHover,
  currentColor,
  currentFontWeight,
  currentColorHover,
  currentFontWeightHover,
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

  const resolvedFocusColor = focusColor || currentColor || 'primary-1'
  const focusStyle = {
    focusColor: resolvedFocusColor,
    focusFontWeight: focusFontWeight || currentFontWeight || 'semibold',
    focusColorHover:
      focusColorHover || currentColorHover || resolvedFocusColor,
    focusFontWeightHover:
      focusFontWeightHover ||
      currentFontWeightHover ||
      focusFontWeight ||
      currentFontWeight ||
      'semibold',
  }

  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }

  const focusVars = getTextStyleVars(focusStyle, 'focusColor', 'primary-1', 'semibold')

  const nav = (
    <nav className={cx('flex items-center gap-2', typography.caption)} aria-label={ariaLabel}>
      {crumbs.map((item, index) => {
        const isFocus = index === crumbs.length - 1
        return (
          <Fragment key={`${item.label}-${index}`}>
            {index > 0 && (
              <span
                className="text-600 font-medium"
                style={{ color: colorVar(separatorColor) }}
              >
                {separator}
              </span>
            )}
            {item.href && !isFocus ? (
              <LocalizedLink
                href={item.href}
                className={cx(
                  typography.caption,
                  'font-medium',
                  crumbUnderline ? 'hover:underline' : '',
                  CMS_TEXT_HOVER_CLASS,
                )}
                style={getTextStyleVars(textStyle, 'crumbColor', '600', 'medium')}
              >
                {item.label}
              </LocalizedLink>
            ) : item.href && isFocus ? (
              <LocalizedLink
                href={item.href}
                className={cx(
                  typography.caption,
                  'font-semibold',
                  crumbUnderline ? 'hover:underline' : '',
                  CMS_TEXT_HOVER_CLASS,
                )}
                style={focusVars}
                aria-current="page"
              >
                {item.label}
              </LocalizedLink>
            ) : (
              <span
                className={cx(typography.caption, 'font-semibold', CMS_TEXT_HOVER_CLASS)}
                style={focusVars}
                aria-current="page"
              >
                <LinkedText text={item.label} {...linkProps} />
              </span>
            )}
          </Fragment>
        )
      })}
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
