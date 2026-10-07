import { CaretRight } from '@phosphor-icons/react'
import Container from './Container.jsx'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'
import { typography } from '../../styles/typography.js'
import { CMS_TEXT_HOVER_CLASS, getTextStyleVars, colorVar } from '../../styles/cmsStyle.js'
import { resolvePhosphorIcon } from '../../cms/adapters/phosphorIcons.js'

/** Source icon circle tint — no theme token matches it; empty `iconBg` = this literal. */
const DEFAULT_ICON_BG_HEX = '#E8F1F4'

// Source grid: `grid-cols-1 md:grid-cols-3` (the "3" entry). Mirrors cms2 COLUMNS_CLASS.
const COLUMNS = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
}

const cx = (...parts) => parts.filter(Boolean).join(' ')

const serviceIcon = (name) => (name ? resolvePhosphorIcon(name) : resolvePhosphorIcon('Seat'))

/**
 * CMS-driven "Add extra services" — a header plus horizontal service link cards
 * (icon circle + title/description + caret). Mirrors the static home section
 * (pages/home/components/HomeExtraServices.jsx); every style key defaults to the
 * source token. Whole cards are links → backlinks only on the header prose.
 * Registered `fullBleed` — it renders its own section + Container.
 */
const HomeExtraServices = ({
  title = '',
  subtitle = '',
  items = [],
  showHeader = true,
  showSubtitle = true,
  columns = '3',
  showSectionBg = true,
  sectionBg = '100',
  cardBg = '50',
  cardBorderColor = '200',
  iconBg = '',
  iconColor = 'primary-1',
  caretColor = 'primary-1',
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
  ...textStyle
}) => {
  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }
  const headerVisible = showHeader && (title || (showSubtitle && subtitle))
  if (!headerVisible && !items.length) return null

  const circleBg = iconBg ? colorVar(iconBg) : DEFAULT_ICON_BG_HEX

  return (
    <section
      className="w-full min-w-0"
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      <Container className="flex min-w-0 flex-col gap-5 md:gap-7">
        {headerVisible ? (
          <div className="flex max-w-2xl flex-col gap-1.5 md:gap-2">
            {title ? (
              <h2
                className={cx('m-0', typography.sectionTitle, 'lg:text-[32px]', CMS_TEXT_HOVER_CLASS)}
                style={getTextStyleVars(textStyle, 'titleColor', '700', 'semibold')}
              >
                <LinkedText text={title} {...linkProps} />
              </h2>
            ) : null}
            {showSubtitle && subtitle ? (
              <p
                className={cx('m-0', typography.sectionDescription, CMS_TEXT_HOVER_CLASS)}
                style={getTextStyleVars(textStyle, 'subtitleColor', '600', 'normal')}
              >
                <LinkedText text={subtitle} {...linkProps} />
              </p>
            ) : null}
          </div>
        ) : null}

        {items.length ? (
          <div className={cx('grid gap-4 md:gap-5', COLUMNS[String(columns)] || COLUMNS[3])}>
            {items.map((item, index) => {
              const Icon = serviceIcon(item.icon)
              return (
                <LocalizedLink
                  key={item.id || index}
                  href={item.href || '#'}
                  className="flex min-w-0 items-start gap-3 rounded-2xl border border-solid p-4 no-underline sm:gap-4 sm:p-5"
                  style={{
                    backgroundColor: colorVar(cardBg),
                    borderColor: colorVar(cardBorderColor),
                  }}
                >
                  <span
                    className="grid size-12 shrink-0 place-items-center rounded-full"
                    style={{ backgroundColor: circleBg, color: colorVar(iconColor) }}
                  >
                    <Icon size={22} weight="regular" />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <span
                      className={cx(typography.itemTitle, CMS_TEXT_HOVER_CLASS)}
                      style={getTextStyleVars(textStyle, 'cardTitleColor', '700', 'semibold')}
                    >
                      {item.title}
                    </span>
                    <span
                      className={cx('leading-snug', typography.caption, CMS_TEXT_HOVER_CLASS)}
                      style={getTextStyleVars(textStyle, 'cardDescriptionColor', '600', 'normal')}
                    >
                      {item.description}
                    </span>
                  </span>
                  <CaretRight
                    size={18}
                    weight="bold"
                    className="mt-1 shrink-0 self-center rtl:-scale-x-100"
                    style={{ color: colorVar(caretColor) }}
                    aria-hidden
                  />
                </LocalizedLink>
              )
            })}
          </div>
        ) : null}
      </Container>
    </section>
  )
}

export default HomeExtraServices
