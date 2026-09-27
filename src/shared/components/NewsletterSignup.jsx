import { Envelope, EnvelopeSimple } from '@phosphor-icons/react'
import Container from './Container.jsx'
import {
  CMS_TEXT_HOVER_CLASS,
  getTextStyleVars,
  colorVar,
  getButtonStyle,
} from '../../styles/cmsStyle.js'
import LinkedText from './backlinks/LinkedText.jsx'
import defaultPlane from '../../assets/images/city-sights/newsletter-plane.png'
import defaultBanner from '../../assets/images/home/newsletter-banner.webp'

const clampPercent = (value, fallback) => {
  const n = Number(value)
  return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : fallback
}

/**
 * Newsletter capture banner. Presentational (does not submit).
 * - Large: text left + white inline email bar (icon / input / Subscribe) + plane
 * - Small: dark gradient card, stacked field then full-width Subscribe (no plane)
 */
const NewsletterSignup = ({
  title = '',
  description = '',
  label = '',
  placeholder = '',
  cta = '',
  plane,
  background,
  // `gradient` (default card) | `photo` (full-width photo band, Figma 40047:34970)
  variant = 'gradient',
  overlayOpacity = 20,
  bgFocus = 36,
  titleColor = '50',
  titleFontWeight = 'semibold',
  titleColorHover,
  titleFontWeightHover,
  descriptionColor = '50',
  descriptionFontWeight = 'normal',
  descriptionColorHover,
  descriptionFontWeightHover,
  inputBg = '50',
  inputBorder = '200',
  inputText = '700',
  iconColor = 'primary-1',
  buttonBg = 'secondary',
  buttonHoverBg,
  buttonText = 'btn',
  buttonTextFontWeight = 'medium',
  buttonTextHover,
  buttonTextFontWeightHover,
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
}) => {
  const planeSrc = plane || defaultPlane
  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }
  const titleStyleKeys = {
    titleColor,
    titleFontWeight,
    titleColorHover,
    titleFontWeightHover,
  }
  const descStyleKeys = {
    descriptionColor,
    descriptionFontWeight,
    descriptionColorHover,
    descriptionFontWeightHover,
  }
  const buttonStyle = getButtonStyle(
    {
      buttonBg,
      buttonHoverBg,
      buttonText,
      buttonTextFontWeight,
      buttonTextHover,
      buttonTextFontWeightHover,
    },
    {
      bgKey: 'buttonBg',
      bgHoverKey: 'buttonHoverBg',
      bgFallback: 'secondary',
      bgHoverFallback: 'secondary-800',
      textKey: 'buttonText',
      textFallback: 'btn',
      weightFallback: 'medium',
    },
  )

  if (variant === 'photo') {
    const overlay = clampPercent(overlayOpacity, 20) / 100
    const focus = clampPercent(bgFocus, 36)
    return (
      <section className="relative isolate w-full overflow-hidden lg:h-[145px]">
        <img
          src={background || defaultBanner}
          alt=""
          className="pointer-events-none absolute inset-0 size-full object-cover"
          style={{ objectPosition: `center ${focus}%` }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ backgroundColor: `rgba(0, 0, 0, ${overlay})` }}
        />

        <Container className="relative flex h-full flex-col gap-6 py-8 lg:flex-row lg:items-center lg:gap-[134px] lg:py-0">
          <div className="flex flex-col gap-4 lg:w-[563px] lg:shrink-0">
            {title ? (
              <h2
                className={`m-0 text-xl lg:text-2xl ${CMS_TEXT_HOVER_CLASS}`}
                style={getTextStyleVars(titleStyleKeys, 'titleColor', '50', 'semibold')}
              >
                <LinkedText text={title} {...linkProps} />
              </h2>
            ) : null}
            {description ? (
              <p
                className={`m-0 text-sm ${CMS_TEXT_HOVER_CLASS}`}
                style={getTextStyleVars(descStyleKeys, 'descriptionColor', '50', 'normal')}
              >
                <LinkedText text={description} {...linkProps} />
              </p>
            ) : null}
          </div>

          <form
            onSubmit={(event) => event.preventDefault()}
            className="flex w-full items-center justify-between gap-2.5 rounded-lg border border-solid p-2.5 lg:w-[449px] lg:shrink-0"
            style={{ backgroundColor: colorVar(inputBg), borderColor: colorVar(inputBorder) }}
          >
            <div className="flex min-w-0 flex-1 items-center gap-2.5">
              <EnvelopeSimple size={24} className="shrink-0" style={{ color: colorVar(iconColor) }} />
              <input
                type="email"
                aria-label={label}
                placeholder={placeholder}
                className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm placeholder:opacity-70 focus:outline-none focus:ring-0"
                style={{ color: colorVar(inputText) }}
              />
            </div>
            <button
              type="submit"
              className={`h-[35px] w-[113px] shrink-0 cursor-pointer rounded border-0 p-1 text-sm transition-colors ${buttonStyle.className}`}
              style={buttonStyle.style}
            >
              {cta}
            </button>
          </form>
        </Container>
      </section>
    )
  }

  const inputSurface = {
    backgroundColor: colorVar(inputBg),
    borderColor: colorVar(inputBorder),
  }

  return (
    <section className="relative isolate overflow-hidden rounded-xl bg-linear-to-br from-primary-1 to-[#00141a] rtl:bg-linear-to-bl lg:bg-linear-to-r lg:rtl:bg-linear-to-l lg:h-[159px]">
      <img
        src={planeSrc}
        alt=""
        className="pointer-events-none absolute inset-y-0 end-0 hidden h-full w-[139.5px] object-cover lg:block rtl:-scale-x-100"
      />

      <div className="relative flex flex-col gap-6 p-6 lg:h-full lg:flex-row lg:items-center lg:gap-23 lg:p-0 lg:ps-[37px] lg:pe-[213px]">
        <div className="flex flex-col gap-3.5 lg:w-[401px] lg:shrink-0">
          {title ? (
            <h2
              className={`m-0 text-xl lg:text-2xl ${CMS_TEXT_HOVER_CLASS}`}
              style={getTextStyleVars(titleStyleKeys, 'titleColor', '50', 'semibold')}
            >
              <LinkedText text={title} {...linkProps} />
            </h2>
          ) : null}
          {description ? (
            <p
              className={`m-0 text-sm leading-5 ${CMS_TEXT_HOVER_CLASS}`}
              style={getTextStyleVars(descStyleKeys, 'descriptionColor', '50', 'normal')}
            >
              <LinkedText text={description} {...linkProps} />
            </p>
          ) : null}
        </div>

        <form
          onSubmit={(event) => event.preventDefault()}
          className="flex w-full flex-col gap-3 lg:w-[480px] lg:shrink-0 lg:flex-row lg:items-center lg:gap-2.5 lg:rounded-lg lg:border lg:border-solid lg:p-2.5 lg:[background-color:var(--nl-ibg)] lg:[border-color:var(--nl-ibd)]"
          style={{
            '--nl-ibg': inputSurface.backgroundColor,
            '--nl-ibd': inputSurface.borderColor,
          }}
        >
          <div
            className="flex w-full items-center gap-2.5 rounded-lg border border-solid p-2.5 lg:min-w-0 lg:flex-1 lg:border-0 lg:bg-transparent lg:p-0"
            style={inputSurface}
          >
            <Envelope size={24} className="shrink-0" style={{ color: colorVar(iconColor) }} />
            <input
              type="email"
              aria-label={label}
              placeholder={placeholder}
              className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm placeholder:opacity-70 focus:outline-none focus:ring-0"
              style={{ color: colorVar(inputText) }}
            />
          </div>
          <button
            type="submit"
            className={`h-11 w-full shrink-0 cursor-pointer rounded-lg border-0 px-[15px] text-base transition-colors lg:w-[123px] ${buttonStyle.className}`}
            style={buttonStyle.style}
          >
            {cta}
          </button>
        </form>
      </div>
    </section>
  )
}

export default NewsletterSignup
