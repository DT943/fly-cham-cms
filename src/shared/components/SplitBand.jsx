import { ArrowRightIcon } from '@phosphor-icons/react'
import {
  CMS_TEXT_HOVER_CLASS,
  getButtonStyle,
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
  const panelPad = {
    '--band-ps': imageFirst ? '3rem' : gutter,
    '--band-pe': imageFirst ? gutter : '4rem',
  }

  const buttonStyle = getButtonStyle(style, {
    bgKey: 'buttonBg',
    bgFallback: 'secondary',
    bgHoverFallback: 'secondary-800',
    textKey: 'buttonColor',
    textFallback: '700',
    weightFallback: 'semibold',
  })
  const buttonClass =
    'flex h-[52px] w-full items-center justify-between rounded-md px-6 text-sm no-underline'

  const button = showCta ? (
    buttonHref ? (
      <LocalizedLink href={buttonHref} className={`${buttonClass} ${buttonStyle.className}`} style={buttonStyle.style}>
        {buttonLabel}
        {Icon ? <Icon size={16} weight="bold" aria-hidden className="rtl:-scale-x-100" /> : null}
      </LocalizedLink>
    ) : (
      <span className={`${buttonClass} ${buttonStyle.className}`} style={buttonStyle.style}>
        {buttonLabel}
        {Icon ? <Icon size={16} weight="bold" aria-hidden className="rtl:-scale-x-100" /> : null}
      </span>
    )
  ) : null

  return (
    <section
      className={cx(
        'flex w-full flex-col-reverse overflow-hidden md:min-h-[480px]',
        imageFirst ? 'md:flex-row-reverse' : 'md:flex-row',
      )}
    >
      <div
        className="flex w-full flex-col justify-center gap-3 px-4 py-5 md:w-[45%] md:shrink-0 md:gap-6 md:py-16 md:[padding-inline-end:var(--band-pe)] md:[padding-inline-start:var(--band-ps)]"
        style={{ backgroundColor: PANEL_BG[panelTone] || PANEL_BG.primary, ...panelPad }}
      >
        {title ? (
          <h2 className={cx('m-0 text-xl leading-snug text-white md:text-[28px] md:leading-[normal] lg:text-[32px]', CMS_TEXT_HOVER_CLASS)} style={getTextStyleVars(style, 'titleColor', '50', 'semibold')}>
            <LinkedText text={title} {...linkProps} />
          </h2>
        ) : null}
        {description ? (
          <p className={cx('m-0 text-sm leading-6 text-white md:text-base md:leading-[26px]', CMS_TEXT_HOVER_CLASS)} style={getTextStyleVars(style, 'descriptionColor', '50', 'normal')}>
            <LinkedText text={description} {...linkProps} />
          </p>
        ) : null}
        {button}
      </div>
      {imageUrl ? (
        <div className="relative h-[200px] w-full shrink-0 md:h-auto md:min-h-[480px] md:flex-1">
          <img src={imageUrl} alt={imageAlt || ''} className="absolute inset-0 size-full object-cover" />
        </div>
      ) : null}
    </section>
  )
}

export default SplitBand
