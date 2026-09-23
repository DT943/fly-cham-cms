import { Envelope } from '@phosphor-icons/react'
import {
  CMS_TEXT_HOVER_CLASS,
  getTextStyleVars,
  colorVar,
  getButtonStyle,
} from '../../styles/cmsStyle.js'
import LinkedText from './backlinks/LinkedText.jsx'
import defaultPlane from '../../assets/images/city-sights/newsletter-plane.png'

/**
 * Newsletter capture banner. Presentational (matches the source: it does not
 * submit). Defaults reproduce the static city-sights banner; the CMS overrides
 * the copy, form labels, colours, artwork and backlinks.
 */
const NewsletterSignup = ({
  title = '',
  description = '',
  label = '',
  placeholder = '',
  cta = '',
  plane,
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
  buttonBg = 'primary-1',
  buttonHoverBg,
  buttonText = '50',
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
  const titleStyleKeys = { titleColor, titleFontWeight, titleColorHover, titleFontWeightHover }
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
      bgFallback: 'primary-1',
      bgHoverFallback: 'primary-800',
      textKey: 'buttonText',
      textFallback: '50',
      weightFallback: 'medium',
    },
  )

  return (
    <section className="relative isolate overflow-hidden rounded-xl bg-linear-to-r from-primary-1 to-[#00141a] rtl:bg-linear-to-l lg:h-[159px]">
      <img
        src={planeSrc}
        alt=""
        className="pointer-events-none absolute inset-y-0 end-0 hidden h-full w-[139.5px] object-cover sm:block rtl:-scale-x-100"
      />

      <div className="relative flex flex-col gap-6 p-6 lg:h-full lg:flex-row lg:items-center lg:gap-23 lg:p-0 lg:ps-[37px] lg:pe-[213px]">
        <div className="flex flex-col gap-3.5 lg:w-[401px] lg:shrink-0">
          <h2
            className={`m-0 text-xl lg:text-2xl ${CMS_TEXT_HOVER_CLASS}`}
            style={getTextStyleVars(titleStyleKeys, 'titleColor', '50', 'semibold')}
          >
            <LinkedText text={title} {...linkProps} />
          </h2>
          <p
            className={`m-0 text-sm leading-5 ${CMS_TEXT_HOVER_CLASS}`}
            style={getTextStyleVars(descStyleKeys, 'descriptionColor', '50', 'normal')}
          >
            <LinkedText text={description} {...linkProps} />
          </p>
        </div>

        <form
          onSubmit={(event) => event.preventDefault()}
          className="flex w-full items-center gap-2.5 rounded-lg border border-solid p-2.5 lg:w-[480px] lg:shrink-0"
          style={{ backgroundColor: colorVar(inputBg), borderColor: colorVar(inputBorder) }}
        >
          <Envelope size={24} className="shrink-0" style={{ color: colorVar(iconColor) }} />
          <input
            type="email"
            aria-label={label}
            placeholder={placeholder}
            className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm focus:outline-none focus:ring-0"
            style={{ color: colorVar(inputText) }}
          />
          <button
            type="submit"
            className={`h-11 shrink-0 cursor-pointer rounded-lg border-0 px-[15px] text-base transition-colors lg:w-[123px] ${buttonStyle.className}`}
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
