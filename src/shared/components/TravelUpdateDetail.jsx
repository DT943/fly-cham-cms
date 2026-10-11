import {
  colorVar,
  getTextStyleVars,
  CMS_TEXT_HOVER_CLASS,
} from '../../styles/cmsStyle.js'
import { resolvePhosphorIcon } from '../../cms/adapters/phosphorIcons.js'
import LocalizedLink from './LocalizedLink.jsx'

const cx = (...parts) => parts.filter(Boolean).join(' ')

const SECTION_PADDING_CLASS = {
  none: '',
  tight: 'py-4 md:py-6',
  default: '',
  loose: 'py-10 md:py-16',
}

// Inline markup for guideline copy: **bold** and [label](href).
// Mirrors cms2's TravelUpdateDetail/utils/richText.jsx.
const TOKEN = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g

const parseRichText = (text = '') => {
  const parts = []
  let last = 0
  for (const match of String(text).matchAll(TOKEN)) {
    if (match.index > last) parts.push({ type: 'text', value: text.slice(last, match.index) })
    if (match[1] !== undefined) parts.push({ type: 'bold', value: match[1] })
    else parts.push({ type: 'link', value: match[2], href: match[3] })
    last = match.index + match[0].length
  }
  if (last < text.length) parts.push({ type: 'text', value: text.slice(last) })
  return parts
}

const RichText = ({ text, linkStyle }) =>
  parseRichText(text).map((part, index) => {
    if (part.type === 'bold') {
      return (
        <strong key={index} className="font-semibold">
          {part.value}
        </strong>
      )
    }
    if (part.type === 'link') {
      return (
        <LocalizedLink
          key={index}
          href={part.href}
          className="font-semibold underline underline-offset-2 hover:opacity-80"
          style={linkStyle}
        >
          {part.value}
        </LocalizedLink>
      )
    }
    return <span key={index}>{part.value}</span>
  })

const splitParagraphs = (text = '') =>
  String(text)
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

const splitLines = (text = '') =>
  String(text)
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean)

const textRole = (style, key, fallback, weight) => ({
  className: CMS_TEXT_HOVER_CLASS,
  style: getTextStyleVars(style, key, fallback, weight),
})

const Divider = ({ color }) => (
  <div aria-hidden className="h-px w-full shrink-0" style={{ backgroundColor: colorVar(color) }} />
)

const GuidelineCard = ({ item, style, linkStyle }) => {
  const Icon = resolvePhosphorIcon(item.icon)
  const bullets = splitLines(item.bullets)
  const title = textRole(style, 'cardTitleColor', '700', 'semibold')
  const body = textRole(style, 'cardBodyColor', '600', 'normal')

  return (
    <div
      className="flex w-full flex-col gap-3 rounded-[8px] p-4 md:p-5"
      style={{ backgroundColor: colorVar(style.guidelineBg) }}
    >
      <div className="flex items-center gap-3">
        <Icon
          size={24}
          weight="regular"
          aria-hidden
          className="shrink-0"
          style={{ color: colorVar(style.cardIconColor) }}
        />
        <h3 className={cx('m-0 text-base md:text-[18px] leading-[normal]', title.className)} style={title.style}>
          {item.title}
        </h3>
      </div>
      {item.body && (
        <p className={cx('m-0 text-sm md:text-[15px] leading-[1.6]', body.className)} style={body.style}>
          <RichText text={item.body} linkStyle={linkStyle} />
        </p>
      )}
      {bullets.length > 0 && (
        <ul className="m-0 flex list-none flex-col gap-2 p-0 ps-3">
          {bullets.map((bullet, index) => (
            <li key={index} className="flex items-start gap-2">
              <span
                aria-hidden
                className="mt-[7px] size-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: colorVar(style.bulletColor) }}
              />
              <span className={cx('min-w-0 flex-1 text-sm leading-[1.5]', body.className)} style={body.style}>
                <RichText text={bullet} linkStyle={linkStyle} />
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/**
 * CMS-driven travel update detail body (Figma "Main Content Container"):
 * an article card (overview + guideline cards) beside a sidebar card (hub
 * statuses + useful resources). Stacks below lg. Every style key falls through
 * to the Figma default. Mirrors flychamadmin cms2's TravelUpdateDetail.
 */
const TravelUpdateDetail = ({
  overviewTitle,
  overview,
  guidelinesIcon = 'Question',
  guidelinesTitle,
  guidelines = [],
  hubsTitle,
  hubs = [],
  resourcesTitle,
  resources = [],
  showGuidelines = true,
  showSidebar = true,
  showSectionBg = false,
  sectionBg = '100',
  sectionPadding = 'none',
  articleBg = 'background',
  sidebarBg = 'background',
  guidelineBg = '100',
  dividerColor = '300',
  headingIconColor = 'primary-1',
  cardIconColor = '700',
  bulletColor = 'primary-1',
  inlineLinkColor = 'primary-1',
  statusWarningColor = 'secondary',
  statusNormalColor = 'primary-1',
  ...rest
}) => {
  const style = { guidelineBg, cardIconColor, bulletColor, ...rest }
  const paragraphs = splitParagraphs(overview)
  const visibleGuidelines = showGuidelines ? guidelines : []
  const hasSidebar = showSidebar && (hubs.length > 0 || resources.length > 0)
  const HeadingIcon = resolvePhosphorIcon(guidelinesIcon)
  const linkStyle = { color: colorVar(inlineLinkColor) }

  const overviewTitleRole = textRole(style, 'titleColor', '700', 'semibold')
  const body = textRole(style, 'bodyColor', '600', 'normal')
  const heading = textRole(style, 'headingColor', 'primary-1', 'semibold')
  const sideTitle = textRole(style, 'sectionTitleColor', '700', 'bold')
  const hubName = textRole(style, 'nameColor', '600', 'semibold')
  const resource = textRole(style, 'itemColor', 'primary-1', 'medium')

  return (
    <section
      className={cx(
        'flex w-full flex-col items-start gap-6 lg:flex-row lg:gap-10',
        SECTION_PADDING_CLASS[sectionPadding] ?? '',
        showSectionBg && 'rounded-2xl px-4 md:px-6',
      )}
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      <article
        className="flex w-full min-w-0 flex-1 flex-col gap-6 rounded-2xl p-5 sm:p-8 lg:gap-8 lg:p-10"
        style={{ backgroundColor: colorVar(articleBg) }}
      >
        {(overviewTitle || paragraphs.length > 0) && (
          <div className="flex flex-col gap-4">
            {overviewTitle && (
              <h2
                className={cx('m-0 text-xl md:text-[24px] leading-[normal]', overviewTitleRole.className)}
                style={overviewTitleRole.style}
              >
                {overviewTitle}
              </h2>
            )}
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className={cx('m-0 text-[15px] md:text-base leading-[1.6]', body.className)}
                style={body.style}
              >
                <RichText text={paragraph} linkStyle={linkStyle} />
              </p>
            ))}
          </div>
        )}

        {visibleGuidelines.length > 0 && (
          <>
            <Divider color={dividerColor} />
            {guidelinesTitle && (
              <div className="flex items-center gap-3">
                <HeadingIcon
                  size={24}
                  weight="regular"
                  aria-hidden
                  className="shrink-0"
                  style={{ color: colorVar(headingIconColor) }}
                />
                <h2
                  className={cx('m-0 text-lg md:text-[22px] leading-[normal]', heading.className)}
                  style={heading.style}
                >
                  {guidelinesTitle}
                </h2>
              </div>
            )}
            {visibleGuidelines.map((item, index) => (
              <GuidelineCard key={index} item={item} style={style} linkStyle={linkStyle} />
            ))}
          </>
        )}
      </article>

      {hasSidebar && (
        <aside
          className="flex w-full shrink-0 flex-col gap-6 rounded-2xl p-6 md:p-8 lg:w-[400px]"
          style={{ backgroundColor: colorVar(sidebarBg) }}
        >
          {hubs.length > 0 && (
            <>
              {hubsTitle && (
                <h2
                  className={cx('m-0 text-lg md:text-[20px] leading-[normal]', sideTitle.className)}
                  style={sideTitle.style}
                >
                  {hubsTitle}
                </h2>
              )}
              <ul className="m-0 flex list-none flex-col gap-4 p-0">
                {hubs.map((hub, index) => (
                  <li key={index} className="flex items-center justify-between gap-3">
                    <span className={cx('text-sm leading-[normal]', hubName.className)} style={hubName.style}>
                      {hub.name}
                    </span>
                    <span
                      className="shrink-0 text-end text-[12px] font-bold uppercase leading-[normal]"
                      style={{
                        color: colorVar(hub.tone === 'normal' ? statusNormalColor : statusWarningColor),
                      }}
                    >
                      {hub.status}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {hubs.length > 0 && resources.length > 0 && <Divider color={dividerColor} />}

          {resources.length > 0 && (
            <div className="flex flex-col gap-3">
              {resourcesTitle && (
                <h3 className={cx('m-0 text-base leading-[normal]', sideTitle.className)} style={sideTitle.style}>
                  {resourcesTitle}
                </h3>
              )}
              {resources.map((item, index) => (
                <LocalizedLink
                  key={index}
                  href={item.href}
                  className={cx('w-fit text-sm leading-[normal] underline underline-offset-2', resource.className)}
                  style={resource.style}
                >
                  {item.label}
                </LocalizedLink>
              ))}
            </div>
          )}
        </aside>
      )}
    </section>
  )
}

export default TravelUpdateDetail
