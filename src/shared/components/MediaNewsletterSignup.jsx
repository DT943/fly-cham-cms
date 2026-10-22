import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckCircle, CircleNotch } from '@phosphor-icons/react'
import {
  CMS_TEXT_HOVER_CLASS,
  getTextStyleVars,
  colorVar,
  getButtonStyle,
} from '../../styles/cmsStyle.js'
import { typography } from '../../styles/typography.js'
import Container from './Container.jsx'
import LinkedText from './backlinks/LinkedText.jsx'
import { MEDIA_NEWSLETTER_DEFAULT_PATTERN } from './mediaNewsletterSignupConstants.js'
import { trackNewsletterAttempt } from '../analytics/cmsEvents.js'

export { MEDIA_NEWSLETTER_DEFAULT_PATTERN }

/**
 * Media Center newsletter banner (Figma 41004:70191 — Stay Connected):
 * copy + form on the start side; cropped geometric ornament on the end.
 */
const MediaNewsletterSignup = ({
  title = '',
  description = '',
  label = '',
  placeholder = '',
  cta = '',
  pattern: _pattern = '',
  sectionBg = '100',
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
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [signedUp, setSignedUp] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const timer = useRef(null)
  const emailInput = useRef(null)

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current)
    },
    [],
  )

  if (!title && !description) return null

  const submit = (event) => {
    event.preventDefault()
    if (status !== 'idle') return
    trackNewsletterAttempt({ formLocation: 'media_newsletter', formId: 'media-newsletter-signup' })
    setStatus('loading')
    timer.current = window.setTimeout(() => {
      if (emailInput.current) {
        emailInput.current.value = ''
        emailInput.current.blur()
      }
      setEmail('')
      setSignedUp(true)
      setStatus('success')
      timer.current = window.setTimeout(() => {
        setStatus('idle')
        setFormKey((key) => key + 1)
      }, 1000)
    }, 2000)
  }

  const successNote =
    signedUp && status === 'idle' ? (
      <p className="m-0 text-sm font-medium text-[#16803C]" role="status">
        {t('common.signedUp')}
      </p>
    ) : null

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

  // Pre-cropped Figma 41004:70200 ornament (flipped) — local asset, not CMS sheet URLs.
  const patternSrc = MEDIA_NEWSLETTER_DEFAULT_PATTERN

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: colorVar(sectionBg) }}
    >
      {/* Pattern — end edge, dense toward outer corner (Figma 41004:70200) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -end-0 -top-6 z-0 hidden h-[min(100%,23rem)] w-[min(21.5rem,40%)] opacity-60 lg:block lg:w-[min(22rem,36%)]"
      >
        <img
          loading="lazy"
          decoding="async"
          src={patternSrc}
          alt=""
          width={680}
          height={766}
          className="h-full w-full max-w-none origin-center object-cover object-right object-top rotate-[0.4deg] skew-x-[4.5deg] rtl:-scale-x-100 rtl:object-left"
        />
      </div>

      <Container className="relative z-10 py-8 md:py-10 lg:py-[42px]">
        <div className="relative z-10 flex w-full max-w-xl flex-col gap-3 md:max-w-[40rem] lg:max-w-[48rem]">
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
              className={`m-0 leading-6 ${typography.sectionDescription} ${CMS_TEXT_HOVER_CLASS}`}
              style={getTextStyleVars(textStyle, 'descriptionColor', '700', 'normal')}
            >
              <LinkedText text={description} {...linkProps} />
            </p>
          ) : null}

          <form onSubmit={submit} className="mt-1 flex w-full flex-col gap-4 sm:max-w-sm">
            <input
              ref={emailInput}
              key={formKey}
              type="email"
              autoComplete="off"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-label={label}
              placeholder={placeholder}
              className={`newsletter-email h-11 w-full rounded-lg border-0 px-4 placeholder:text-600 focus:outline-none focus:ring-0 ${typography.body}`}
              style={{
                backgroundColor: colorVar(cardBg || inputBg),
                color: colorVar(inputText),
                '--cms-input-text': colorVar(inputText),
              }}
            />
            {successNote}
            {status === 'success' ? (
              <span className="inline-flex h-11 items-center" aria-hidden>
                <CheckCircle size={32} weight="fill" className="text-[#16803C]" />
              </span>
            ) : (
              <button
                type="submit"
                disabled={status === 'loading'}
                aria-busy={status === 'loading'}
                className={`flex h-11 w-fit min-w-[8.375rem] cursor-pointer items-center justify-center rounded-lg border-0 px-6 disabled:cursor-wait ${typography.button} ${buttonStyle.className}`}
                style={buttonStyle.style}
              >
                {status === 'loading' ? (
                  <CircleNotch size={20} className="animate-spin" aria-hidden />
                ) : (
                  cta
                )}
              </button>
            )}
          </form>
        </div>
      </Container>
    </section>
  )
}

export default MediaNewsletterSignup
