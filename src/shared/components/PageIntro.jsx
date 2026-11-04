import { CMS_TEXT_HOVER_CLASS, getTextStyleVars, colorVar } from '../../styles/cmsStyle.js'
import { typography } from '../../styles/typography.js'
import { LOGO_CONTENT_INSET_CLASS } from '../layout/logoContentInset.js'
import LinkedText from './backlinks/LinkedText.jsx'

const SECTION_PADDING = {
  tight: 'py-4 md:py-6',
  default: '',
  loose: 'py-10 md:py-16',
}

const TEXT_ALIGN = {
  left: 'text-start',
  center: 'text-center',
  right: 'text-end',
}

const cx = (...parts) => parts.filter(Boolean).join(' ')

/**
 * Page intro paragraph. Defaults match the Media Center welcome copy
 * (`typography.body`, text-800).
 */
const PageIntro = ({
  lead = '',
  body = '',
  imageUrl = '',
  imageAlt = '',
  sectionPadding = 'default',
  leadSize = 'default',
  textAlign = 'left',
  showSectionBg = false,
  sectionBg = '100',
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
  ...textStyle
}) => {
  if (!lead && !body && !imageUrl) return null

  const alignClass = TEXT_ALIGN[textAlign] || TEXT_ALIGN.left
  // Match breadcrumbs + route-map overlays (search/card) to the drawn logo mark.
  const leadIsPageTitle = leadSize === 'lg'

  const inner = (
    <div
      className={cx(
        'flex flex-col gap-6',
        // Page-title intros (e.g. route-map) share the logo optical inset with
        // breadcrumbs and the map search/card overlays.
        leadIsPageTitle ? LOGO_CONTENT_INSET_CLASS : '',
      )}
    >
      {lead || body ? (
        <div
          className={cx(
            'flex flex-col',
            leadIsPageTitle ? 'gap-2 md:gap-3' : 'gap-3',
            alignClass,
          )}
        >
          {lead ? (
            leadIsPageTitle ? (
              <h1
                className={cx(
                  'm-0 whitespace-pre-line font-bold',
                  typography.pageTitle,
                  CMS_TEXT_HOVER_CLASS,
                )}
                style={getTextStyleVars(textStyle, 'leadColor', 'secondary-2', 'bold')}
              >
                <LinkedText
                  text={lead}
                  links={links}
                  enabled={showLinks}
                  linkColor={linkColor}
                  linkHoverColor={linkHoverColor}
                  linkFontWeight={linkFontWeight}
                  linkUnderline={linkUnderline}
                  linkItalic={linkItalic}
                />
              </h1>
            ) : (
              <p
                className={cx(
                  'm-0 whitespace-pre-line text-base leading-[normal] md:text-lg',
                  CMS_TEXT_HOVER_CLASS,
                )}
                style={getTextStyleVars(textStyle, 'leadColor', '700', 'semibold')}
              >
                <LinkedText
                  text={lead}
                  links={links}
                  enabled={showLinks}
                  linkColor={linkColor}
                  linkHoverColor={linkHoverColor}
                  linkFontWeight={linkFontWeight}
                  linkUnderline={linkUnderline}
                  linkItalic={linkItalic}
                />
              </p>
            )
          ) : null}
          {body ? (
            <p
              className={cx(
                'm-0 whitespace-pre-line font-normal leading-relaxed',
                leadIsPageTitle
                  ? 'max-w-3xl text-base text-700 md:text-lg'
                  : typography.body,
                CMS_TEXT_HOVER_CLASS,
              )}
              style={getTextStyleVars(
                textStyle,
                'bodyColor',
                leadIsPageTitle ? '700' : '800',
                'normal',
              )}
            >
              <LinkedText
                text={body}
                links={links}
                enabled={showLinks}
                linkColor={linkColor}
                linkHoverColor={linkHoverColor}
                linkFontWeight={linkFontWeight}
                linkUnderline={linkUnderline}
                linkItalic={linkItalic}
              />
            </p>
          ) : null}
        </div>
      ) : null}
      {imageUrl ? (
        <img
          loading="lazy"
          decoding="async"
          src={imageUrl}
          alt={imageAlt || ''}
          className="h-[240px] w-full rounded-[24px] object-cover md:h-[504px]"
        />
      ) : null}
    </div>
  )

  const sectionClass = cx(
    SECTION_PADDING[sectionPadding] || '',
    showSectionBg ? 'rounded-2xl px-4 md:px-6' : '',
  )

  if (!sectionClass) return inner
  return (
    <div className={sectionClass} style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}>
      {inner}
    </div>
  )
}

export default PageIntro
