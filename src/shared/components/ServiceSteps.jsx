import {
  CMS_TEXT_HOVER_CLASS,
  colorVar,
  getButtonStyle,
  getTextStyleVars,
} from '../../styles/cmsStyle.js'
import { resolvePhosphorIcon } from '../../cms/adapters/phosphorIcons.js'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'

// Keep these class maps byte-identical with the cms2 ServiceSteps block.
const IMAGE_RADIUS_CLASS = {
  none: 'rounded-none',
  sm: 'rounded-lg',
  lg: 'rounded-xl',
  xl: 'rounded-3xl',
}
const SECTION_PADDING = {
  none: '',
  tight: 'py-4 md:py-6',
  default: 'py-6 md:py-10',
  loose: 'py-10 md:py-16',
}

// Pinned px sizes from Figma 40365:8430.
const TITLE_SIZE = 'text-2xl leading-[1.5] lg:text-[28px]'
const BODY_SIZE = 'text-base leading-[27px]'
const NUMBER_SIZE = 'text-sm leading-[normal]'
const STEP_TITLE_SIZE = 'text-base leading-[normal]'
const STEP_DESCRIPTION_SIZE = 'text-sm leading-[1.4]'
const BUTTON_CLASS =
  'inline-flex h-[52px] w-fit items-center justify-center gap-2 self-start rounded-lg px-[14px] py-3 text-base leading-[normal] no-underline transition-colors'

/** Figma step-circle fill — default whenever the CMS `markerBg` token is empty. */
const DEFAULT_MARKER_BG = 'rgba(83,147,200,0.15)'

const BUTTON_OPTS = {
  bgKey: 'buttonBg',
  bgFallback: 'secondary',
  bgHoverFallback: 'secondary-800',
  textKey: 'buttonText',
  textFallback: '700',
  weightFallback: 'semibold',
}

const cx = (...parts) => parts.filter(Boolean).join(' ')
const stepNumber = (index) => String(index + 1).padStart(2, '0')

/**
 * CMS-driven image + text row with a numbered (or icon) steps list and a CTA
 * (Figma 40365:8430, "Medical Report Requirements"). Mirrors the cms2
 * ServiceSteps block. Only the button is an anchor → backlinks apply to the copy.
 */
const ServiceSteps = ({
  title = '',
  description = '',
  imageUrl = '',
  imageAlt = '',
  steps = [],
  buttonLabel = '',
  buttonHref = '',
  buttonIcon = '',
  imageSide = 'left',
  imageRadius = 'lg',
  showImage = true,
  sectionPadding = 'none',
  showSectionBg = false,
  sectionBg = '100',
  showDescription = true,
  showSteps = true,
  stepMarker = 'number',
  markerBg = '',
  showButton = true,
  showButtonIcon = false,
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
  ...textStyle
}) => {
  const visibleSteps = showSteps !== false ? steps : []
  if (!title && !description && !imageUrl && !visibleSteps.length) return null

  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }
  const radiusClass = IMAGE_RADIUS_CLASS[imageRadius] || IMAGE_RADIUS_CLASS.lg
  const imageFirst = imageSide !== 'right'
  const hasImage = showImage !== false && Boolean(imageUrl)
  const hasButton = showButton !== false && Boolean(buttonLabel)
  const btn = hasButton ? getButtonStyle(textStyle, BUTTON_OPTS) : null
  const ButtonIcon = showButtonIcon && buttonIcon ? resolvePhosphorIcon(buttonIcon) : null
  const markerStyle = {
    ...getTextStyleVars(textStyle, 'numberColor', 'primary-1', 'bold'),
    backgroundColor: colorVar(markerBg) || DEFAULT_MARKER_BG,
  }

  const inner = (
    <section
      className={cx(
        'flex flex-col items-center gap-8 lg:gap-[105px]',
        imageFirst ? 'lg:flex-row-reverse' : 'lg:flex-row',
      )}
    >
      <div className="flex w-full min-w-0 flex-col gap-6 lg:w-[508px] lg:shrink-0">
        {title ? (
          <h2
            className={cx('m-0', TITLE_SIZE, CMS_TEXT_HOVER_CLASS)}
            style={getTextStyleVars(textStyle, 'titleColor', '700', 'semibold')}
          >
            <LinkedText text={title} {...linkProps} />
          </h2>
        ) : null}
        {showDescription !== false && description ? (
          <p
            className={cx('m-0', BODY_SIZE, CMS_TEXT_HOVER_CLASS)}
            style={getTextStyleVars(textStyle, 'bodyColor', '700', 'normal')}
          >
            <LinkedText text={description} {...linkProps} />
          </p>
        ) : null}
        {visibleSteps.length ? (
          <ol className="m-0 flex list-none flex-col gap-6 p-0">
            {visibleSteps.map((step, index) => {
              const Icon = stepMarker === 'icon' ? resolvePhosphorIcon(step.icon || 'Check') : null
              return (
                <li key={step.id ? `${step.id}-${index}` : index} className="flex items-start gap-5">
                  <span
                    className={cx(
                      'flex size-11 shrink-0 items-center justify-center rounded-full',
                      NUMBER_SIZE,
                      CMS_TEXT_HOVER_CLASS,
                    )}
                    style={markerStyle}
                  >
                    {Icon ? <Icon size={20} aria-hidden /> : stepNumber(index)}
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    {step.title ? (
                      <h3
                        className={cx('m-0', STEP_TITLE_SIZE, CMS_TEXT_HOVER_CLASS)}
                        style={getTextStyleVars(textStyle, 'stepTitleColor', 'primary-1', 'semibold')}
                      >
                        <LinkedText text={step.title} {...linkProps} />
                      </h3>
                    ) : null}
                    {step.description ? (
                      <p
                        className={cx('m-0', STEP_DESCRIPTION_SIZE, CMS_TEXT_HOVER_CLASS)}
                        style={getTextStyleVars(textStyle, 'stepDescriptionColor', '700', 'normal')}
                      >
                        <LinkedText text={step.description} {...linkProps} />
                      </p>
                    ) : null}
                  </div>
                </li>
              )
            })}
          </ol>
        ) : null}
        {hasButton ? (
          <LocalizedLink
            href={buttonHref || '#'}
            className={cx(BUTTON_CLASS, btn.className)}
            style={btn.style}
          >
            <span>{buttonLabel}</span>
            {ButtonIcon ? (
              <ButtonIcon size={18} aria-hidden="true" className="shrink-0 rtl:-scale-x-100" />
            ) : null}
          </LocalizedLink>
        ) : null}
      </div>
      {hasImage ? (
        <div className={cx('w-full min-w-0 overflow-hidden lg:h-[400px] lg:flex-1', radiusClass)}>
          <img
            src={imageUrl}
            alt={imageAlt || ''}
            className="aspect-[607/400] w-full object-cover lg:aspect-auto lg:h-full"
          />
        </div>
      ) : null}
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

export default ServiceSteps
