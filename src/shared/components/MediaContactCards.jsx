import { resolvePhosphorIcon } from '../../cms/adapters/phosphorIcons'
import { EnvelopeSimple, MegaphoneSimple } from '@phosphor-icons/react'
import { CMS_TEXT_HOVER_CLASS, getTextStyleVars, colorVar } from '../../styles/cmsStyle.js'
import { typography } from '../../styles/typography.js'
import LinkedText from './backlinks/LinkedText.jsx'

const ICONS = {
  megaphoneSimple: MegaphoneSimple,
  envelopeSimple: EnvelopeSimple,
}

const COLUMNS = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
}

const CARD_GAP = {
  tight: 'gap-3',
  default: 'gap-4 md:gap-5',
  loose: 'gap-6 md:gap-8',
}

const SECTION_PADDING = {
  tight: 'py-4 md:py-6',
  default: 'py-6 md:py-10',
  loose: 'py-10 md:py-16',
}

const cx = (...parts) => parts.filter(Boolean).join(' ')

/**
 * Media Center contact cards — icon, title, body, optional department/location,
 * and a mailto email. Email is an anchor so backlinks apply to prose only.
 */
const MediaContactCards = ({
  items = [],
  columns = '2',
  cardGap = 'default',
  sectionPadding = 'default',
  showSectionBg = false,
  sectionBg = '100',
  cardBg = 'background',
  cardBorderColor = '200',
  iconBg = '100',
  iconColor = '800',
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
  ...textStyle
}) => {
  if (!items.length) return null

  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }

  const inner = (
    <section className={cx('grid', COLUMNS[String(columns)] || COLUMNS[2], CARD_GAP[cardGap] || CARD_GAP.default)}>
      {items.map((item, index) => {
        const Icon = ICONS[item.icon] || resolvePhosphorIcon(item.icon)
        return (
          <article
            key={item.id || index}
            className="flex h-full flex-col rounded-2xl border p-6 shadow-[0px_4px_6px_rgba(33,37,41,0.05)] md:p-8"
            style={{
              backgroundColor: colorVar(cardBg),
              borderColor: colorVar(cardBorderColor),
            }}
          >
            <div className="flex items-center gap-3 md:gap-4">
              <div
                className="flex size-11 shrink-0 items-center justify-center rounded-full md:size-12"
                style={{ backgroundColor: colorVar(iconBg) }}
              >
                <Icon size={22} weight="regular" className="shrink-0" style={{ color: colorVar(iconColor) }} aria-hidden />
              </div>
              <h3
                className={cx('m-0', typography.itemTitle, CMS_TEXT_HOVER_CLASS)}
                style={getTextStyleVars(textStyle, 'cardTitleColor', '800', 'semibold')}
              >
                <LinkedText text={item.title} {...linkProps} />
              </h3>
            </div>

            <div className="mt-5 flex flex-col gap-3 md:mt-6">
              {item.description ? (
                <p
                  className={cx('m-0 leading-relaxed', typography.body, CMS_TEXT_HOVER_CLASS)}
                  style={getTextStyleVars(textStyle, 'cardDescriptionColor', '700', 'normal')}
                >
                  <LinkedText text={item.description} {...linkProps} />
                </p>
              ) : null}
              {item.department ? (
                <p
                  className={cx('m-0 leading-relaxed', typography.body, CMS_TEXT_HOVER_CLASS)}
                  style={getTextStyleVars(textStyle, 'cardDescriptionColor', '700', 'normal')}
                >
                  <LinkedText text={item.department} {...linkProps} />
                </p>
              ) : null}
              {item.location ? (
                <p
                  className={cx('m-0 leading-relaxed', typography.body, CMS_TEXT_HOVER_CLASS)}
                  style={getTextStyleVars(textStyle, 'cardDescriptionColor', '700', 'normal')}
                >
                  <LinkedText text={item.location} {...linkProps} />
                </p>
              ) : null}
            </div>

            {item.email ? (
              <div className="mt-6 border-t pt-5 md:mt-8 md:pt-6" style={{ borderColor: colorVar(cardBorderColor) }}>
                <a
                  href={`mailto:${item.email}`}
                  className={cx('underline underline-offset-2', typography.body, CMS_TEXT_HOVER_CLASS)}
                  style={getTextStyleVars(textStyle, 'learnMoreColor', 'primary-1', 'semibold')}
                >
                  {item.email}
                </a>
              </div>
            ) : null}
          </article>
        )
      })}
    </section>
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

export default MediaContactCards
