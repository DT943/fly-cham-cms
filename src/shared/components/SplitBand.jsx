import { ArrowRightIcon } from '@phosphor-icons/react'
import {
  CMS_TEXT_HOVER_CLASS,
  colorVar,
  getTextStyleVars,
} from '../../styles/cmsStyle.js'
import { resolvePhosphorIcon } from '../../cms/adapters/phosphorIcons.js'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'

const PANEL_BG = {
  primary: 'var(--color-primary-1)',
  navy: '#01263B',
}

const cx = (...parts) => parts.filter(Boolean).join(' ')

/**
 * Full-bleed split: a colored text panel beside a photo. `imageSide` "right"
 * puts the panel on the left (Economy meals). "left" puts the photo on the left.
 */
const SplitBand = ({
  title = '',
  description = '',
  imageUrl = '',
  imageAlt = '',
  buttonLabel = '',
  buttonHref = '',
  buttonIcon = 'ArrowRight',
  imageSide = 'right',
  panelTone = 'primary',
  showButton = true,
  showButtonIcon = true,
  links = [],
  showLinks = true,
  ...style
}) => {
  if (!title && !description && !imageUrl) return null
  const imageFirst = imageSide === 'left'
  const Icon = showButtonIcon !== false ? resolvePhosphorIcon(buttonIcon) || ArrowRightIcon : null
  const showCta = showButton !== false && Boolean(buttonLabel)
  const linkProps = { links, enabled: showLinks }
  const gutter = 'max(1rem, calc((100vw - min(100vw, var(--max-width-page, 1219px))) / 2))'
  const panelPad = imageFirst
    ? { paddingInlineStart: '3rem', paddingInlineEnd: gutter }
    : { paddingInlineStart: gutter, paddingInlineEnd: '4rem' }

  const button = showCta ? (
    buttonHref ? (
      <LocalizedLink
        href={buttonHref}
        className="inline-flex h-[52px] items-center gap-2 rounded-md px-6 text-sm no-underline"
        style={{
          backgroundColor: colorVar(style.buttonBg || 'secondary'),
          ...getTextStyleVars(style, 'buttonColor', '700', 'semibold'),
        }}
      >
        {buttonLabel}
        {Icon ? <Icon size={16} weight="bold" aria-hidden className="rtl:-scale-x-100" /> : null}
      </LocalizedLink>
    ) : (
      <span
        className="inline-flex h-[52px] items-center gap-2 rounded-md px-6 text-sm"
        style={{
          backgroundColor: colorVar(style.buttonBg || 'secondary'),
          ...getTextStyleVars(style, 'buttonColor', '700', 'semibold'),
        }}
      >
        {buttonLabel}
        {Icon ? <Icon size={16} weight="bold" aria-hidden className="rtl:-scale-x-100" /> : null}
      </span>
    )
  ) : null

  return (
    <section
      className={cx(
        'flex w-full flex-col overflow-hidden md:min-h-[480px] md:flex-row',
        imageFirst ? 'flex-col-reverse md:flex-row-reverse' : '',
      )}
    >
      <div
        className="flex w-full flex-col justify-center gap-6 px-4 py-12 md:w-[45%] md:shrink-0 md:py-16"
        style={{ backgroundColor: PANEL_BG[panelTone] || PANEL_BG.primary, ...panelPad }}
      >
        {title ? (
          <h2 className={cx('m-0 text-[28px] leading-[normal] text-white md:text-[32px]', CMS_TEXT_HOVER_CLASS)} style={getTextStyleVars(style, 'titleColor', '50', 'semibold')}>
            <LinkedText text={title} {...linkProps} />
          </h2>
        ) : null}
        {description ? (
          <p className={cx('m-0 text-base leading-[26px] text-white', imageFirst ? 'max-w-[464px]' : '', CMS_TEXT_HOVER_CLASS)} style={getTextStyleVars(style, 'descriptionColor', '50', 'normal')}>
            <LinkedText text={description} {...linkProps} />
          </p>
        ) : null}
        {button}
      </div>
      {imageUrl ? (
        <div className="relative min-h-[240px] flex-1 md:min-h-[480px]">
          <img src={imageUrl} alt={imageAlt || ''} className="absolute inset-0 size-full object-cover" />
        </div>
      ) : null}
    </section>
  )
}

export default SplitBand
