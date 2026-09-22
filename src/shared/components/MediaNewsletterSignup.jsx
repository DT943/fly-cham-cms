import { CMS_TEXT_HOVER_CLASS, getTextStyleVars, colorVar } from '../../styles/cmsStyle.js'
import { typography } from '../../styles/typography.js'
import Container from './Container.jsx'
import LinkedText from './backlinks/LinkedText.jsx'
import defaultPattern from '../../assets/images/recent-news/pattern.png'

/**
 * Full-bleed Media Center newsletter capture. Presentational (does not submit).
 * Defaults match `MediaNewsletterSignup layout="fullBleed"`.
 */
const MediaNewsletterSignup = ({
  title = '',
  description = '',
  label = '',
  placeholder = '',
  cta = '',
  pattern,
  sectionBg = '100',
  borderColor = '200',
  inputText = '700',
  buttonBg = 'secondary',
  buttonHoverBg = 'secondary-800',
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

  return (
    <section
      className="relative mt-10 w-full overflow-hidden border border-e-0"
      style={{
        backgroundColor: colorVar(sectionBg),
        borderColor: colorVar(borderColor),
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 inset-s-0 z-0 w-28 overflow-hidden sm:w-36 md:w-44 lg:w-52"
      >
        <img src={pattern || defaultPattern} alt="" className="size-full object-cover object-left" />
      </div>

      <Container className="relative z-10 flex flex-col gap-6 py-8 md:gap-8 md:py-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
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

        <form
          onSubmit={(event) => event.preventDefault()}
          className="flex w-full items-center gap-3 overflow-hidden rounded-lg bg-background px-4 py-2 md:px-5 md:py-2 lg:min-w-0 lg:flex-1 lg:max-w-148"
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
            className={`h-10 shrink-0 cursor-pointer rounded-lg border-0 px-6 lg:min-w-35 md:h-12 md:px-8 ${typography.button} ${CMS_TEXT_HOVER_CLASS}`}
            style={{
              backgroundColor: colorVar(buttonBg),
              ...getTextStyleVars(textStyle, 'buttonText', 'btn', 'semibold'),
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colorVar(buttonHoverBg)
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colorVar(buttonBg)
            }}
          >
            {cta}
          </button>
        </form>
      </Container>
    </section>
  )
}

export default MediaNewsletterSignup
