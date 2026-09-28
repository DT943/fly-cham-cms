import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { User, Lock, Eye, EyeSlash } from '@phosphor-icons/react'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'
import { typography } from '../../styles/typography.js'
import {
  CMS_TEXT_HOVER_CLASS,
  colorMix,
  colorVar,
  getButtonStyle,
  getTextStyleVars,
} from '../../styles/cmsStyle.js'
import defaultLogo from '../../assets/images/layout/logo.png'
import defaultBackground from '../../assets/images/login-travel-agent/background.jpg'
import defaultPlane from '../../assets/images/login-travel-agent/plane.png'

const cx = (...parts) => parts.filter(Boolean).join(' ')

/** Submit button keys — mirror cms2 TravelAgentLogin LOGIN_BUTTON. */
const LOGIN_BUTTON = {
  bgKey: 'buttonBg',
  bgHoverKey: 'buttonBgHover',
  bgFallback: 'primary-1',
  bgHoverFallback: 'primary-700',
  textKey: 'buttonText',
  textFallback: '50',
  weightFallback: 'semibold',
}

const clampOpacity = (value, fallback = 75) => {
  const n = Number(value)
  if (!Number.isFinite(n)) return fallback
  return Math.min(100, Math.max(0, n))
}

const LoginField = ({
  id,
  label,
  type = 'text',
  icon: Icon,
  placeholder,
  value,
  onChange,
  autoComplete,
  trailing,
  textStyle,
  inputBg,
  inputBorder,
}) => (
  <div className="flex w-full flex-col gap-1.5">
    <label
      htmlFor={id}
      className={cx('m-0', typography.caption, CMS_TEXT_HOVER_CLASS)}
      style={getTextStyleVars(textStyle, 'labelColor', '800', 'medium')}
    >
      {label}
    </label>
    <div
      className="flex min-h-12 items-center gap-3 rounded-lg border px-3.5"
      style={{ backgroundColor: colorVar(inputBg), borderColor: colorVar(inputBorder) }}
    >
      {Icon ? <Icon size={20} weight="regular" className="shrink-0 text-600" /> : null}
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`min-w-0 flex-1 border-0 bg-transparent p-0 text-800 outline-none placeholder:text-500 focus:ring-0 ${typography.caption}`}
      />
      {trailing}
    </div>
  </div>
)

/**
 * CMS-driven standalone Travel Agent B2B login screen (one full-bleed block):
 * sky background, decorative plane layer, logo, welcome copy and the glass
 * login card. Defaults reproduce the static /login-travel-agent page exactly.
 * The form is presentational (submit prevented); show/hide password and
 * remember-me work locally. Renders its own layout area (not `main`) — the
 * site header/footer are hidden for this route by Layout.
 */
const TravelAgentLogin = ({
  welcome = '',
  headline = '',
  bgUrl,
  bgAlt = '',
  planeUrl,
  planeAlt = '',
  logoUrl,
  logoHref = '/',
  formTitle = '',
  formSubtitle = '',
  usernameLabel = '',
  usernamePlaceholder = '',
  passwordLabel = '',
  passwordPlaceholder = '',
  rememberMeLabel = '',
  forgotLabel = '',
  forgotHref = '/coming-soon',
  loginLabel = '',
  noAccountText = '',
  joinLabel = '',
  joinHref = '/help/contact-us/forms',
  needHelpText = '',
  supportLabel = '',
  supportHref = '/help/contact-us',
  showPlane = true,
  cardBg = '50',
  cardBgOpacity = 75,
  inputBg = '50',
  inputBorder = '200',
  buttonBg = 'primary-1',
  buttonBgHover = 'primary-700',
  buttonText = '50',
  buttonTextFontWeight = 'semibold',
  buttonTextHover,
  buttonTextFontWeightHover,
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
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  const btn = getButtonStyle(
    {
      buttonBg,
      buttonBgHover,
      buttonText,
      buttonTextFontWeight,
      buttonTextHover,
      buttonTextFontWeightHover,
    },
    LOGIN_BUTTON,
  )
  const ctaVars = getTextStyleVars(textStyle, 'ctaColor', 'primary-1', 'semibold')
  // "Forgot password?" keeps the source's medium weight; it shares the link color.
  const forgotVars = { ...ctaVars, fontWeight: 500, '--cms-hw': 500 }

  return (
    <section className="relative min-h-dvh w-full min-w-0 overflow-x-clip">
      <img
        src={bgUrl || defaultBackground}
        alt={bgAlt || ''}
        className="absolute inset-0 size-full object-cover"
        aria-hidden={bgAlt ? undefined : true}
      />

      {showPlane ? (
        <div
          className="pointer-events-none absolute inset-x-0 top-[18%] z-1 flex justify-center px-4 sm:top-[16%] lg:inset-y-auto lg:inset-s-0 lg:inset-e-[40%] lg:top-[14%] lg:bottom-[1%] lg:items-center lg:justify-center lg:px-6 xl:inset-e-[36%] xl:top-[12%]"
          aria-hidden
        >
          <img
            src={planeUrl || defaultPlane}
            alt=""
            className="w-[min(92%,20rem)] object-contain drop-shadow-md sm:w-[min(85%,24rem)] lg:w-[min(100%,34rem)] xl:w-[min(100%,40rem)]"
          />
        </div>
      ) : null}

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-page flex-col py-5 ps-3 pe-4 sm:ps-5 sm:pe-8 md:py-8 md:ps-6 md:pe-10 xl:ps-2 xl:pe-0">
        <LocalizedLink href={logoHref || '/'} className="inline-flex w-fit shrink-0" aria-label="Fly Cham">
          <img src={logoUrl || defaultLogo} alt="Fly Cham" className="h-10 w-auto sm:h-10 md:h-10" />
        </LocalizedLink>

        <div className="grid flex-1 grid-cols-1 items-center gap-10 py-8 lg:grid-cols-2 lg:gap-8 xl:gap-12">
          <div className="relative z-10 flex max-w-md flex-col gap-1 lg:max-w-xl lg:self-start lg:pt-[12vh]">
            {welcome ? (
              <p
                className={cx(
                  'm-0 drop-shadow-[0_1px_2px_rgba(1,38,59,0.35)]',
                  typography.sectionDescription,
                  CMS_TEXT_HOVER_CLASS,
                )}
                style={getTextStyleVars(textStyle, 'eyebrowColor', '50', 'medium')}
              >
                <LinkedText text={welcome} {...linkProps} />
              </p>
            ) : null}
            {headline ? (
              <h2
                className={cx(
                  'm-0 leading-tight',
                  typography.pageTitle,
                  'lg:text-[44px] xl:text-[44px]',
                  CMS_TEXT_HOVER_CLASS,
                )}
                style={getTextStyleVars(textStyle, 'headingColor', 'primary-1', 'bold')}
              >
                <LinkedText text={headline} {...linkProps} />
              </h2>
            ) : null}
          </div>

          <div className="relative z-10 flex w-full justify-center lg:justify-end lg:translate-x-3 xl:translate-x-6 rtl:lg:-translate-x-3 rtl:xl:-translate-x-6">
            <div
              className="w-full max-w-md rounded-2xl border p-6 shadow-[0_8px_32px_rgba(1,38,59,0.12)] backdrop-blur-md sm:p-8"
              style={{
                backgroundColor: colorMix(cardBg, clampOpacity(cardBgOpacity)),
                borderColor: colorMix('50', 40),
              }}
            >
              <div className="mb-6 flex flex-col gap-1.5">
                <h1
                  className={cx('m-0', typography.sectionTitle, CMS_TEXT_HOVER_CLASS)}
                  style={getTextStyleVars(textStyle, 'titleColor', 'primary-1', 'semibold')}
                >
                  {formTitle}
                </h1>
                <p
                  className={cx('m-0', typography.caption, CMS_TEXT_HOVER_CLASS)}
                  style={getTextStyleVars(textStyle, 'subtitleColor', '600', 'normal')}
                >
                  <LinkedText text={formSubtitle} {...linkProps} />
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                <LoginField
                  id="travel-agent-username"
                  label={usernameLabel}
                  icon={User}
                  placeholder={usernamePlaceholder}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  textStyle={textStyle}
                  inputBg={inputBg}
                  inputBorder={inputBorder}
                />

                <LoginField
                  id="travel-agent-password"
                  label={passwordLabel}
                  type={showPassword ? 'text' : 'password'}
                  icon={Lock}
                  placeholder={passwordPlaceholder}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  textStyle={textStyle}
                  inputBg={inputBg}
                  inputBorder={inputBorder}
                  trailing={
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="shrink-0 border-0 bg-transparent p-0 text-600 hover:text-primary-1"
                      aria-label={
                        showPassword
                          ? t('loginTravelAgent.form.hidePassword')
                          : t('loginTravelAgent.form.showPassword')
                      }
                    >
                      {showPassword ? (
                        <EyeSlash size={20} weight="regular" />
                      ) : (
                        <Eye size={20} weight="regular" />
                      )}
                    </button>
                  }
                />

                <div className="flex items-center justify-between gap-3">
                  <label className="flex cursor-pointer items-center gap-2 select-none">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="size-4 shrink-0 accent-primary-1"
                    />
                    <span className={`text-700 ${typography.caption}`}>{rememberMeLabel}</span>
                  </label>
                  <LocalizedLink
                    href={forgotHref || '#'}
                    className={cx(
                      'shrink-0 underline-offset-2 hover:underline',
                      typography.caption,
                      CMS_TEXT_HOVER_CLASS,
                    )}
                    style={forgotVars}
                  >
                    {forgotLabel}
                  </LocalizedLink>
                </div>

                <button
                  type="submit"
                  className={cx(
                    'mt-1 w-full cursor-pointer rounded-lg border-0 px-6 py-3.5 uppercase tracking-wide transition-colors',
                    typography.button,
                    btn.className,
                  )}
                  style={btn.style}
                >
                  {loginLabel}
                </button>
              </form>

              <p className={`mt-5 mb-0 text-center text-700 ${typography.caption}`}>
                {noAccountText}{' '}
                <LocalizedLink
                  href={joinHref || '#'}
                  className={cx('no-underline hover:underline', CMS_TEXT_HOVER_CLASS)}
                  style={ctaVars}
                >
                  {joinLabel}
                </LocalizedLink>
              </p>

              <div className="mt-6 flex flex-col items-center gap-1 border-t border-200 pt-5 text-center">
                <span className={`text-600 ${typography.caption}`}>{needHelpText}</span>
                <LocalizedLink
                  href={supportHref || '#'}
                  className={cx('no-underline hover:underline', typography.caption, CMS_TEXT_HOVER_CLASS)}
                  style={ctaVars}
                >
                  {supportLabel}
                </LocalizedLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      {planeAlt ? <span className="sr-only">{planeAlt}</span> : null}
    </section>
  )
}

export default TravelAgentLogin
