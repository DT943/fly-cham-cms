import {
  CMS_TEXT_HOVER_CLASS,
  colorVar,
  getButtonStyle,
  getTextStyleVars,
} from '../../styles/cmsStyle.js'
import { resolvePhosphorIcon } from '../../cms/adapters/phosphorIcons.js'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'
import useBaggageQuery from '../hooks/useBaggageQuery.js'

// Keep byte-identical with the cms2 BaggageAllowanceBreakdown block.
const SECTION_PADDING = {
  none: '',
  tight: 'py-4 md:py-6',
  default: 'py-6 md:py-10',
  loose: 'py-10 md:py-16',
}
// Pinned px sizes from Figma 40814:23304 (desktop) / 40814:23814 (mobile).
const SECTION_TITLE_SIZE = 'text-base leading-[normal] md:text-2xl'
const COLUMN_TITLE_SIZE = 'text-lg leading-7 md:text-[22px]'
const VALUE_SIZE = 'text-base leading-7 md:text-lg'
const LABEL_SIZE = 'text-sm leading-7 md:text-base'
const BODY_SIZE = 'text-xs leading-7 md:text-sm'
const META_SIZE = 'text-xs leading-7'
const PROMO_TITLE_SIZE = 'text-xl leading-7 md:text-2xl'
const PROMO_BODY_SIZE = 'text-sm leading-7 md:text-base'
const SHADOW = 'drop-shadow-[-5px_12px_15px_rgba(0,0,0,0.1)]'
/** Figma panel fill — default while the CMS `panelBg` token is empty. */
const DEFAULT_PANEL_BG = 'rgba(229,229,227,0.5)'

const BUTTON_OPTS = {
  bgKey: 'buttonBg',
  bgFallback: 'secondary',
  bgHoverFallback: 'secondary-800',
  textKey: 'buttonText',
  textFallback: '700',
  weightFallback: 'semibold',
}

const cx = (...parts) => parts.filter(Boolean).join(' ')

function DimArrow({ length, color, className = '' }) {
  return (
    <svg
      aria-hidden
      width={length}
      height="8"
      viewBox={`0 0 ${length} 8`}
      className={cx('absolute overflow-visible', className)}
    >
      <g fill="none" stroke={color} strokeWidth="1" strokeLinecap="round">
        <line x1="0.5" y1="4" x2={length - 0.5} y2="4" />
        <polyline points="4,1 0.5,4 4,7" />
        <polyline points={`${length - 4},1 ${length - 0.5},4 ${length - 4},7`} />
      </g>
    </svg>
  )
}

function BagIllustration({ column, s }) {
  const arrow = colorVar(s.arrowColor)
  const meta = getTextStyleVars(s, 'metaColor', '700', 'normal')
  const showDims = s.showDimensions !== false
  return (
    <div className="relative mx-auto h-[337px] w-[240px] shrink-0 md:mx-0">
      <img
        src={column.imageUrl}
        alt={column.imageAlt || ''}
        className={cx('absolute start-0 top-4 h-[266px] w-[160px] object-contain object-bottom', SHADOW)}
      />
      {column.weightBadge ? (
        <span
          className={cx('absolute start-[132px] top-0 flex min-w-[99px] items-center justify-center rounded-xl p-2.5 text-base leading-7', CMS_TEXT_HOVER_CLASS)}
          style={{
            ...getTextStyleVars(s, 'badgeText', 'foreground', 'semibold'),
            backgroundColor: colorVar(s.badgeBg),
          }}
        >
          {column.weightBadge}
          {column.weightUnit ? <span className="ms-1 font-normal">{column.weightUnit}</span> : null}
        </span>
      ) : null}
      {column.countBadge ? (
        <span
          className={cx('absolute start-[132px] top-[59px] flex size-[38px] items-center justify-center rounded-full text-base leading-7', CMS_TEXT_HOVER_CLASS)}
          style={{
            ...getTextStyleVars(s, 'numberColor', 'primary-1', 'bold'),
            backgroundColor: colorVar(s.countBg),
          }}
        >
          {column.countBadge}
        </span>
      ) : null}
      {showDims && column.dimHeight ? (
        <>
          <DimArrow length={175} color={arrow} className="start-[85px] top-[188px] rotate-90" />
          <span className={cx('absolute start-[178px] top-[178px] -rotate-90 whitespace-nowrap', META_SIZE)} style={meta}>
            {column.dimHeight}
          </span>
        </>
      ) : null}
      {showDims && column.dimWidth ? (
        <>
          <DimArrow length={100} color={arrow} className="start-[15px] top-[285px]" />
          <span className={cx('absolute start-[43px] top-[293px] whitespace-nowrap', META_SIZE)} style={meta}>
            {column.dimWidth}
          </span>
        </>
      ) : null}
      {showDims && column.dimDepth ? (
        <>
          <DimArrow length={34} color={arrow} className="start-[127px] top-[289px] -rotate-[27deg]" />
          <span className={cx('absolute start-[136px] top-[292px] -rotate-[27deg] whitespace-nowrap', META_SIZE)} style={meta}>
            {column.dimDepth}
          </span>
        </>
      ) : null}
    </div>
  )
}

function ColumnDetails({ column, s, linkProps }) {
  const t = (key, fallback, weight) => getTextStyleVars(s, key, fallback, weight)
  const items = (column.listItems || []).filter((item) => item.text)
  const LinkIcon = column.linkLabel ? resolvePhosphorIcon(column.linkIcon || 'ArrowRight') : null
  const p = (value, size, key, fallback, weight) =>
    value ? (
      <p className={cx('m-0', size, CMS_TEXT_HOVER_CLASS)} style={t(key, fallback, weight)}>
        <LinkedText text={value} {...linkProps} />
      </p>
    ) : null
  return (
    <div className="flex flex-col gap-6">
      {column.pieces || column.weightLabel || column.weightValue ? (
        <div className="flex flex-col gap-1.5">
          {p(column.pieces, VALUE_SIZE, 'valueColor', 'foreground', 'bold')}
          {p(column.weightLabel, LABEL_SIZE, 'labelColor', 'foreground', 'semibold')}
          {p(column.weightValue, BODY_SIZE, 'bodyColor', 'foreground', 'normal')}
        </div>
      ) : null}
      {column.sizeLabel || column.sizeValue ? (
        <div className="flex flex-col gap-[3px]">
          {p(column.sizeLabel, LABEL_SIZE, 'labelColor', 'foreground', 'semibold')}
          {p(column.sizeValue, BODY_SIZE, 'bodyColor', 'foreground', 'normal')}
        </div>
      ) : null}
      {column.listTitle || items.length ? (
        <div className="flex flex-col gap-1.5">
          {p(column.listTitle, VALUE_SIZE, 'valueColor', 'foreground', 'bold')}
          {items.length ? (
            <ul className="m-0 flex list-none flex-col p-0">
              {items.map((item, index) => (
                <li key={item.id ? `${item.id}-${index}` : index} className="flex items-start gap-2.5">
                  <span
                    aria-hidden
                    className="mt-[11px] size-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: colorVar(s.bulletColor) }}
                  />
                  <span className={cx(BODY_SIZE, CMS_TEXT_HOVER_CLASS)} style={t('itemColor', '800', 'normal')}>
                    <LinkedText text={item.text} {...linkProps} />
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
      {column.linkLabel ? (
        <LocalizedLink
          href={column.linkHref || '#'}
          className={cx('flex w-fit items-center gap-[5px] text-base leading-[19px] no-underline', CMS_TEXT_HOVER_CLASS)}
          style={t('ctaColor', 'primary-1', 'semibold')}
        >
          <span
            className="flex size-[34px] shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: colorVar(s.linkIconBg), color: colorVar(s.linkIconColor) }}
          >
            <LinkIcon size={18} aria-hidden className="rtl:-scale-x-100" />
          </span>
          <span>{column.linkLabel}</span>
        </LocalizedLink>
      ) : null}
    </div>
  )
}

/**
 * CMS-driven baggage allowance panel (Figma 40814:23304). Hidden until
 * Calculate (unless `onlyAfterCalculate` is off) and, when `classFilter` is
 * set, shown only for those `?class=` values. Mirrors cms2.
 */
const BaggageAllowanceBreakdown = ({
  icon = '',
  title = '',
  classFilter = '',
  columns = [],
  promoTitle = '',
  promoBody = '',
  promoButtonLabel = '',
  promoButtonHref = '',
  promoImageUrl = '',
  promoImageAlt = '',
  promoBadgeIcon = '',
  links = [],
  onlyAfterCalculate = true,
  sectionPadding = 'none',
  showSectionBg = false,
  sectionBg = '100',
  panelBg = '',
  showDividers = true,
  dividerColor = '400',
  showPromo = true,
  showDimensions = true,
  iconColor = '700',
  bulletColor = 'secondary',
  linkIconBg = 'primary-1',
  linkIconColor = '50',
  badgeBg = '200',
  countBg = 'secondary',
  arrowColor = '500',
  promoBadgeBg = 'secondary',
  promoBadgeIconColor = 'primary-1',
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
  ...textStyle
}) => {
  const query = useBaggageQuery()
  if (onlyAfterCalculate && !query.calculated) return null
  const allowed = classFilter
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
  if (allowed.length && query.class && !allowed.includes(query.class)) return null
  if (!title && !columns.length && !promoTitle) return null

  const s = {
    ...textStyle,
    showDimensions,
    bulletColor,
    linkIconBg,
    linkIconColor,
    badgeBg,
    countBg,
    arrowColor,
  }
  const linkProps = { links, enabled: showLinks, linkColor, linkHoverColor, linkFontWeight, linkUnderline, linkItalic }
  const TitleIcon = icon ? resolvePhosphorIcon(icon) : null
  const divider = showDividers !== false ? colorVar(dividerColor) : 'transparent'
  const hasPromo = showPromo !== false && (promoTitle || promoBody)
  const btn = getButtonStyle(textStyle, BUTTON_OPTS)
  const PromoBadge = resolvePhosphorIcon(promoBadgeIcon || 'Plus')

  const inner = (
    <div className="flex flex-col gap-4">
      {title ? (
        <div className="flex items-center gap-2.5">
          {TitleIcon ? (
            <TitleIcon aria-hidden className="size-5 shrink-0 md:size-7" style={{ color: colorVar(iconColor) }} />
          ) : null}
          <h2
            className={cx('m-0', SECTION_TITLE_SIZE, CMS_TEXT_HOVER_CLASS)}
            style={getTextStyleVars(textStyle, 'titleColor', '700', 'medium')}
          >
            <LinkedText text={title} {...linkProps} />
          </h2>
        </div>
      ) : null}
      <div
        className="flex flex-col gap-[30px] overflow-hidden rounded-[10px] px-4 py-6 md:px-[33px] md:py-10"
        style={{ backgroundColor: colorVar(panelBg) || DEFAULT_PANEL_BG }}
      >
        {columns.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2">
            {columns.map((column, index) => (
              <div
                key={column.id ? `${column.id}-${index}` : index}
                className={cx(
                  'grid grid-cols-1 gap-y-6 md:grid-cols-[249px_1fr] md:gap-x-6',
                  index % 2 === 1
                    ? 'mt-8 border-0 border-t border-dashed pt-8 md:mt-0 md:border-s md:border-t-0 md:ps-11 md:pt-0'
                    : 'md:pe-11',
                )}
                style={{ borderColor: divider }}
              >
                {column.title ? (
                  <h3
                    className={cx('m-0 md:col-start-1 md:row-start-1 md:mt-6', COLUMN_TITLE_SIZE, CMS_TEXT_HOVER_CLASS)}
                    style={getTextStyleVars(textStyle, 'cardTitleColor', 'secondary-2', 'normal')}
                  >
                    <LinkedText text={column.title} {...linkProps} />
                  </h3>
                ) : null}
                {column.imageUrl ? (
                  <div className="md:col-start-2 md:row-span-2 md:row-start-1">
                    <BagIllustration column={column} s={s} />
                  </div>
                ) : null}
                <div className={column.imageUrl ? 'md:col-start-1 md:row-start-2' : 'md:col-span-2'}>
                  <ColumnDetails column={column} s={s} linkProps={linkProps} />
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {hasPromo ? (
          <div
            className="flex flex-col gap-6 border-0 border-t border-dashed pt-[30px] md:flex-row-reverse md:items-center md:justify-end md:gap-[155px]"
            style={{ borderColor: divider }}
          >
            {promoImageUrl ? (
              <div className="relative h-[200px] w-[134px] shrink-0">
                <img
                  src={promoImageUrl}
                  alt={promoImageAlt || ''}
                  className={cx('h-full w-[118px] object-contain object-bottom', SHADOW)}
                />
                <span
                  aria-hidden
                  className="absolute start-[89px] top-[37px] flex size-[45px] items-center justify-center rounded-full"
                  style={{ backgroundColor: colorVar(promoBadgeBg), color: colorVar(promoBadgeIconColor) }}
                >
                  <PromoBadge size={22} weight="bold" />
                </span>
              </div>
            ) : null}
            <div className="flex flex-col gap-4 md:max-w-[711px] md:gap-6">
              {promoTitle ? (
                <h3
                  className={cx('m-0', PROMO_TITLE_SIZE, CMS_TEXT_HOVER_CLASS)}
                  style={getTextStyleVars(textStyle, 'headingColor', 'secondary-2', 'normal')}
                >
                  <LinkedText text={promoTitle} {...linkProps} />
                </h3>
              ) : null}
              {promoBody ? (
                <p
                  className={cx('m-0 whitespace-pre-line', PROMO_BODY_SIZE, CMS_TEXT_HOVER_CLASS)}
                  style={getTextStyleVars(textStyle, 'descriptionColor', 'foreground', 'normal')}
                >
                  <LinkedText text={promoBody} {...linkProps} />
                </p>
              ) : null}
              {promoButtonLabel ? (
                <LocalizedLink
                  href={promoButtonHref || '#'}
                  className={cx('flex h-[55px] w-full items-center justify-center rounded-lg px-2 py-3 text-base leading-9 no-underline transition-colors md:w-[214px]', btn.className)}
                  style={btn.style}
                >
                  {promoButtonLabel}
                </LocalizedLink>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )

  const sectionClass = SECTION_PADDING[sectionPadding] || ''
  if (!sectionClass && !showSectionBg) return inner
  return (
    <div className={sectionClass} style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}>
      {inner}
    </div>
  )
}

export default BaggageAllowanceBreakdown
