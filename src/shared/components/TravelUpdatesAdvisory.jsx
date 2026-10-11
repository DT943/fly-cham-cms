import { ArrowRight, CheckCircle } from '@phosphor-icons/react'
import { CMS_TEXT_HOVER_CLASS, getTextStyleVars, colorVar } from '../../styles/cmsStyle.js'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'

/** Figma date-badge fill — default whenever the CMS `badgeBg` token is empty. */
const DEFAULT_BADGE_BG = 'rgba(83,147,200,0.15)'

const SECTION_PADDING = {
  none: '',
  tight: 'py-4 md:py-6',
  default: '',
  loose: 'py-10 md:py-16',
}

// Keep in sync with the cms2 panel (explicit sizes, valid in Tailwind v3 + v4).
const TITLE_SIZE = 'text-2xl md:text-[28px]'
const HEADING_SIZE = 'text-xl md:text-2xl'

const cx = (...parts) => parts.filter(Boolean).join(' ')

const InlineLink = ({ label, href, textStyle }) => {
  if (!label) return null
  return (
    <LocalizedLink
      href={href || '#'}
      className={cx('no-underline hover:underline', CMS_TEXT_HOVER_CLASS)}
      style={getTextStyleVars(textStyle, 'ctaColor', 'primary-1', 'medium')}
    >
      {label}
    </LocalizedLink>
  )
}

/**
 * CMS-driven "Latest Advisories" block (Travel Updates) — section header + a
 * white advisory card: date badge, heading, description, a CheckCircle
 * checklist (bold label + text + optional inline link, with optional dot
 * sub-bullets) and a circle-arrow Learn More link. Mirrors the cms2
 * TravelUpdatesAdvisory panel; not full-bleed (PageBlocks wraps it in the page
 * Container).
 */
const TravelUpdatesAdvisory = ({
  title = '',
  subtitle = '',
  date = '',
  heading = '',
  description = '',
  items = [],
  learnMoreLabel = '',
  learnMoreHref = '',
  showHeader = true,
  showLearnMore = true,
  sectionPadding = 'none',
  cardBg = '50',
  badgeBg = '',
  checkIconColor = 'primary-1',
  bulletDotColor = 'primary-1',
  learnMoreCircleBg = 'primary-1',
  learnMoreArrowColor = '50',
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
  ...textStyle
}) => {
  const hasContent = title || heading || description || date || items.length
  if (!hasContent) return null

  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }
  const headerVisible = showHeader && (title || subtitle)
  const learnMoreVisible = showLearnMore && Boolean(learnMoreLabel)
  const bodyVars = getTextStyleVars(textStyle, 'bodyColor', '700', 'normal')
  // Latest News pill hover: label turns white unless a distinct hover color is set.
  const lmStyle = {
    ...textStyle,
    learnMoreColorHover:
      textStyle.learnMoreColorHover && textStyle.learnMoreColorHover !== textStyle.learnMoreColor
        ? textStyle.learnMoreColorHover
        : '50',
  }
  const labelVars = getTextStyleVars(textStyle, 'labelColor', '700', 'semibold')

  const inner = (
    <section className="flex min-w-0 flex-col gap-6">
      {headerVisible ? (
        <div className="flex flex-col gap-2">
          {title ? (
            <h2
              className={cx('m-0 leading-[normal]', TITLE_SIZE, CMS_TEXT_HOVER_CLASS)}
              style={getTextStyleVars(textStyle, 'titleColor', '700', 'semibold')}
            >
              <LinkedText text={title} {...linkProps} />
            </h2>
          ) : null}
          {subtitle ? (
            <p
              className={cx('m-0 text-sm leading-[normal]', CMS_TEXT_HOVER_CLASS)}
              style={getTextStyleVars(textStyle, 'subtitleColor', '600', 'normal')}
            >
              <LinkedText text={subtitle} {...linkProps} />
            </p>
          ) : null}
        </div>
      ) : null}

      <article
        className="flex flex-col gap-4 rounded-xl p-5 sm:p-8"
        style={{ backgroundColor: colorVar(cardBg) }}
      >
        {date ? (
          <span
            className={cx(
              'w-fit rounded-[4px] p-[10px] text-sm uppercase leading-[normal]',
              CMS_TEXT_HOVER_CLASS,
            )}
            style={{
              backgroundColor: colorVar(badgeBg) || DEFAULT_BADGE_BG,
              ...getTextStyleVars(textStyle, 'badgeText', 'primary-1', 'semibold'),
            }}
          >
            {date}
          </span>
        ) : null}

        {heading ? (
          <h3
            className={cx('m-0 leading-[normal]', HEADING_SIZE, CMS_TEXT_HOVER_CLASS)}
            style={getTextStyleVars(textStyle, 'headingColor', '700', 'semibold')}
          >
            <LinkedText text={heading} {...linkProps} />
          </h3>
        ) : null}

        {description ? (
          <p
            className={cx('m-0 text-sm leading-[1.5]', CMS_TEXT_HOVER_CLASS)}
            style={getTextStyleVars(textStyle, 'descriptionColor', '700', 'normal')}
          >
            <LinkedText text={description} {...linkProps} />
          </p>
        ) : null}

        {items.length ? (
          <ul className="m-0 flex list-none flex-col p-0">
            {items.map((item, index) => {
              const bullets = Array.isArray(item.bullets) ? item.bullets : []
              return (
                <li key={item.id || index} className="flex items-start gap-[10px] p-[10px]">
                  <CheckCircle
                    size={24}
                    weight="regular"
                    className="shrink-0"
                    style={{ color: colorVar(checkIconColor) }}
                    aria-hidden
                  />
                  <div className="flex min-w-0 flex-1 flex-col gap-3">
                    <p className={cx('m-0 text-sm leading-[1.5]', CMS_TEXT_HOVER_CLASS)} style={bodyVars}>
                      {item.label ? (
                        <>
                          <span className={CMS_TEXT_HOVER_CLASS} style={labelVars}>
                            {item.label}
                          </span>{' '}
                        </>
                      ) : null}
                      {item.text}
                      <InlineLink label={item.linkLabel} href={item.linkHref} textStyle={textStyle} />
                      {item.textAfter}
                    </p>
                    {bullets.map((bullet, bi) => (
                      <div key={bullet.id || bi} className="flex items-center gap-1">
                        <span
                          aria-hidden
                          className="size-1 shrink-0 rounded-full"
                          style={{ backgroundColor: colorVar(bulletDotColor) }}
                        />
                        <span className={cx('text-sm leading-[1.5]', CMS_TEXT_HOVER_CLASS)} style={bodyVars}>
                          {bullet.text}
                          <InlineLink
                            label={bullet.linkLabel}
                            href={bullet.linkHref}
                            textStyle={textStyle}
                          />
                          {bullet.textAfter}
                        </span>
                      </div>
                    ))}
                  </div>
                </li>
              )
            })}
          </ul>
        ) : null}

        {learnMoreVisible ? (
          <LocalizedLink
            href={learnMoreHref || '#'}
            className="group/lm relative inline-flex h-[34px] w-fit items-center overflow-hidden rounded-full no-underline"
          >
            <span
              aria-hidden
              className="absolute inset-y-0 start-0 w-[34px] rounded-full transition-[width] duration-300 ease-out group-hover/lm:w-full"
              style={{ backgroundColor: colorVar(learnMoreCircleBg) }}
            />
            <span className="relative z-10 flex size-[34px] shrink-0 items-center justify-center">
              <ArrowRight
                size={16}
                weight="regular"
                className="rtl:-scale-x-100"
                style={{ color: colorVar(learnMoreArrowColor) }}
              />
            </span>
            <span
              className={cx('cms-lm-label relative z-10 pe-3 ps-2.5 text-sm leading-[normal] transition-[color,font-weight] duration-300', CMS_TEXT_HOVER_CLASS)}
              style={getTextStyleVars(lmStyle, 'learnMoreColor', 'primary-1', 'semibold')}
            >
              {learnMoreLabel}
            </span>
          </LocalizedLink>
        ) : null}
      </article>
    </section>
  )

  const paddingClass = SECTION_PADDING[sectionPadding] || ''
  if (!paddingClass) return inner
  return <div className={paddingClass}>{inner}</div>
}

export default TravelUpdatesAdvisory
