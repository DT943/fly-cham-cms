import { Fragment } from 'react'
import { CMS_TEXT_HOVER_CLASS, colorVar, getTextStyleVars } from '../../styles/cmsStyle.js'
import { typography } from '../../styles/typography.js'
import { LOGO_CONTENT_INSET_CLASS } from '../layout/logoContentInset.js'
import Container from './Container.jsx'
import LinkedText from './backlinks/LinkedText.jsx'
import LocalizedLink from './LocalizedLink.jsx'

// Extra vertical rhythm when the CMS sets sectionPadding; the bar itself always
// uses a modest py so the trail is not flush against the header border.
const SECTION_PADDING = {
  none: '',
  chrome: '',
  tight: 'py-4 md:py-6',
  default: '',
  loose: 'py-10 md:py-16',
}

const cx = (...parts) => parts.filter(Boolean).join(' ')

/**
 * Page trail. Owns the page Container + logo optical inset so “Home” lines up
 * with the drawn header logo (Figma). CMS pages register this as fullBleed so
 * PageBlocks does not wrap or top-pad it again.
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

  // Keep each crumb on one line; wrap whole crumbs to the next row on narrow
  // viewports (without this, flex shrink stacks words vertically mid-label).
  const crumbClass = 'shrink-0 whitespace-nowrap'

  const nav = (
    <nav
      className={cx(
        'flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1',
        typography.caption,
      )}
      aria-label={ariaLabel}
    >
      {crumbs.map((item, index) => {
        const isFocus = index === crumbs.length - 1
        return (
          <Fragment key={`${item.label}-${index}`}>
            {index > 0 && (
              <span
                className={cx(crumbClass, 'text-600 font-medium')}
                style={{ color: colorVar(separatorColor) }}
                aria-hidden
              >
                {separator}
              </span>
            )}
            {item.href && !isFocus ? (
              <LocalizedLink
                href={item.href}
                className={cx(
                  crumbClass,
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
                  crumbClass,
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
                className={cx(
                  crumbClass,
                  typography.caption,
                  'font-semibold',
                  CMS_TEXT_HOVER_CLASS,
                )}
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

  return (
    <div
      className={cx('w-full', paddingClass)}
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      <Container
        className={cx(
          'flex min-w-0 items-center py-3 md:py-4',
          LOGO_CONTENT_INSET_CLASS,
        )}
      >
        {nav}
      </Container>
    </div>
  )
}

export default Breadcrumbs
