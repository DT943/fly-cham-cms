import {
  CMS_TEXT_HOVER_CLASS,
  getTextStyleVars,
  colorVar,
  getButtonStyle,
} from '../../styles/cmsStyle.js'
import { typography } from '../../styles/typography.js'
import Container from './Container.jsx'
import LinkedText from './backlinks/LinkedText.jsx'

/**
 * Media Center newsletter capture.
 * - Small: white card, stacked title / description / input / Subscribe
 * - Large: side-by-side — copy left, inline email bar with Subscribe on the right
 * Presentational (does not submit). The side pattern comes from the CMS.
 */
const MediaNewsletterSignup = ({
  title = '',
  description = '',
  label = '',
  placeholder = '',
  cta = '',
  pattern = '',
  sectionBg = '100',
  borderColor = '200',
  cardBg = 'background',
  inputBg = '100',
  inputText = '700',
  buttonBg = 'secondary',
  buttonHoverBg,
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
  ...textStyle
}) => {
  if (!title && !description) return null

  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }
  const buttonStyle = getButtonStyle(
    { ...textStyle, buttonBg, buttonHoverBg },
    {
      bgKey: 'buttonBg',
      bgHoverKey: 'buttonHoverBg',
      bgFallback: 'secondary',
      bgHoverFallback: 'secondary-800',
      textKey: 'buttonText',
      textFallback: 'btn',
      weightFallback: 'semibold',
    },
  )

  const titleBlock = (
    <div className="flex flex-col gap-3 lg:max-w-100 lg:shrink-0">
      {title ? (
        <h2
          className={`m-0 ${typography.sectionTitle} ${CMS_TEXT_HOVER_CLASS}`}
          style={getTextStyleVars(textStyle, 'titleColor', '800', 'semibold')}
        >
          <LinkedText text={title} {...linkProps} />
        </h2>
      ) : null}
      {description ? (
        <p
          className={`m-0 leading-relaxed ${typography.sectionDescription} ${CMS_TEXT_HOVER_CLASS}`}
          style={getTextStyleVars(textStyle, 'descriptionColor', '700', 'normal')}
        >
          <LinkedText text={description} {...linkProps} />
        </p>
      ) : null}
    </div>
  )

  const stackedForm = (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="flex w-full flex-col gap-3"
    >
      <input
        type="email"
        aria-label={label}
        placeholder={placeholder}
        className={`h-12 w-full rounded-lg border-0 px-4 placeholder:text-600 focus:outline-none focus:ring-0 md:h-14 md:text-base ${typography.body}`}
        style={{
          backgroundColor: colorVar(inputBg),
          color: colorVar(inputText),
        }}
      />
      <button
        type="submit"
        className={`flex h-12 w-full cursor-pointer items-center justify-center rounded-lg border-0 px-6 md:h-14 md:w-auto md:self-start md:px-8 ${typography.button} ${buttonStyle.className}`}
        style={buttonStyle.style}
      >
        {cta}
      </button>
    </form>
  )

  const inlineForm = (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="flex w-full min-w-0 flex-1 items-center gap-3 overflow-hidden rounded-lg px-4 py-2 md:px-5 md:py-2 lg:max-w-148"
      style={{ backgroundColor: colorVar(cardBg) }}
    >
      <input
        type="email"
        aria-label={label}
        placeholder={placeholder}
        className={`min-w-0 flex-1 border-0 bg-transparent p-0 placeholder:text-600 focus:outline-none focus:ring-0 md:text-base ${typography.body}`}
        style={{ color: colorVar(inputText) }}
      />
      <button
        type="submit"
        className={`h-10 shrink-0 cursor-pointer rounded-lg border-0 px-6 md:h-12 md:px-8 lg:min-w-35 ${typography.button} ${buttonStyle.className}`}
        style={buttonStyle.style}
      >
        {cta}
      </button>
    </form>
  )

  return (
    <section
      className="relative mt-10 w-full overflow-hidden border border-e-0"
      style={{
        backgroundColor: colorVar(sectionBg),
        borderColor: colorVar(borderColor),
      }}
    >
      {pattern ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 inset-s-0 z-0 w-28 overflow-hidden sm:w-36 md:w-44 lg:w-52"
        >
          <img src={pattern} alt="" className="size-full object-cover object-left" />
        </div>
      ) : null}

      <Container className="relative z-10 py-8 md:py-10">
        <div
          className="flex w-full flex-col gap-6 rounded-xl p-6  md:gap-8 md:p-8 lg:hidden"
          style={{ backgroundColor: colorVar(cardBg) }}
        >
          {titleBlock}
          {stackedForm}
        </div>

        <div className="hidden lg:flex lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          {titleBlock}
          {inlineForm}
        </div>
      </Container>
    </section>
  )
}

export default MediaNewsletterSignup
