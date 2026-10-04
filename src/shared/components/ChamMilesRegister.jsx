import { Fragment, useMemo, useState } from 'react'
import { CaretDown, Eye, EyeSlash } from '@phosphor-icons/react'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'
import { typography } from '../../styles/typography.js'
import {
  CMS_TEXT_HOVER_CLASS,
  colorVar,
  getButtonStyle,
  getTextStyleVars,
} from '../../styles/cmsStyle.js'

const cx = (...parts) => parts.filter(Boolean).join(' ')

/** One option per line (CMS multiline field) → [{ value, label }]. */
const toOptions = (text) =>
  String(text || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((label, i) => ({ value: String(i + 1), label }))

/** Sign-in submit — mirrors cms2 ChamMilesRegister LOGIN_BUTTON. */
const LOGIN_BUTTON = {
  bgKey: 'buttonBg',
  bgHoverKey: 'buttonBgHover',
  bgFallback: 'primary-1',
  bgHoverFallback: 'primary-700',
  textKey: 'buttonText',
  textFallback: '50',
  weightFallback: 'semibold',
}

/** Register "Continue" — the source greys (#D0D0D0 / #C4C4C4) while unset. */
const CONTINUE_BUTTON = {
  bgKey: 'continueBg',
  bgHoverKey: 'continueBgHover',
  textKey: 'continueText',
  textFallback: '700',
  weightFallback: 'semibold',
}
const CONTINUE_BG = '#D0D0D0'
const CONTINUE_BG_HOVER = '#C4C4C4'

const fieldShell =
  'flex min-h-12 w-full items-center rounded-lg border border-(--cm-input-border) bg-(--cm-input-bg) px-3.5 text-800 outline-none transition-colors placeholder:text-500 focus:border-primary-1 focus:ring-0'

const FormInput = ({ id, type = 'text', placeholder, value, onChange, autoComplete, trailing }) => (
  <div className="flex min-h-12 w-full items-center gap-2 rounded-lg border border-(--cm-input-border) bg-(--cm-input-bg) px-3.5">
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
)

const FormSelect = ({ id, value, onChange, options, placeholder, 'aria-label': ariaLabel }) => (
  <div className="relative min-w-0">
    <select
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      aria-label={ariaLabel}
      className={`${fieldShell} cursor-pointer appearance-none pe-9 ${typography.caption} ${
        value ? 'text-800' : 'text-500'
      }`}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <CaretDown
      size={14}
      weight="bold"
      className="pointer-events-none absolute inset-e-3 top-1/2 -translate-y-1/2 text-600"
      aria-hidden
    />
  </div>
)

const CardHeader = ({ title, subtitle, textStyle }) => (
  <div className="mb-5 flex flex-col gap-1.5 sm:mb-6">
    <h1
      className={cx('m-0', typography.sectionTitle, CMS_TEXT_HOVER_CLASS)}
      style={getTextStyleVars(textStyle, 'titleColor', 'primary-1', 'semibold')}
    >
      {title}
    </h1>
    <p
      className={cx('m-0', typography.caption, CMS_TEXT_HOVER_CLASS)}
      style={getTextStyleVars(textStyle, 'subtitleColor', '600', 'normal')}
    >
      {subtitle}
    </p>
  </div>
)

const RegisterForm = ({ c, textStyle, ctaVars, ctaMediumVars, continueBtn, onSwitchToLogin }) => {
  const [title, setTitle] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [countryCode, setCountryCode] = useState('')
  const [phone, setPhone] = useState('')
  const [day, setDay] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [agreeMarketing, setAgreeMarketing] = useState(false)

  const titleOptions = useMemo(() => toOptions(c.titleOptions), [c.titleOptions])
  const countryOptions = useMemo(() => toOptions(c.countryCodeOptions), [c.countryCodeOptions])
  const monthOptions = useMemo(() => toOptions(c.monthOptions), [c.monthOptions])
  const dayOptions = useMemo(
    () => Array.from({ length: 31 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) })),
    [],
  )
  const yearOptions = useMemo(() => {
    const current = new Date().getFullYear()
    return Array.from({ length: 100 }, (_, i) => {
      const y = String(current - 16 - i)
      return { value: y, label: y }
    })
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <>
      <CardHeader title={c.formTitle} subtitle={c.formSubtitle} textStyle={textStyle} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.5 sm:gap-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[7.5rem_1fr_1fr] sm:gap-3">
          <FormSelect
            id="cham-miles-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            options={titleOptions}
            placeholder={c.titlePlaceholder}
            aria-label={c.titlePlaceholder}
          />
          <FormInput
            id="cham-miles-first-name"
            placeholder={c.firstNamePlaceholder}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            autoComplete="given-name"
          />
          <FormInput
            id="cham-miles-last-name"
            placeholder={c.lastNamePlaceholder}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            autoComplete="family-name"
          />
        </div>

        <FormInput
          id="cham-miles-email"
          type="email"
          placeholder={c.emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1.35fr_1fr]">
          <FormSelect
            id="cham-miles-country-code"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            options={countryOptions}
            placeholder={c.countryCodePlaceholder}
            aria-label={c.countryCodePlaceholder}
          />
          <FormInput
            id="cham-miles-phone"
            type="tel"
            placeholder={c.phonePlaceholder}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel-national"
          />
        </div>

        <div className="flex flex-col gap-2">
          <span
            className={cx(typography.caption, CMS_TEXT_HOVER_CLASS)}
            style={getTextStyleVars(textStyle, 'labelColor', '700', 'medium')}
          >
            {c.dobLabel}
          </span>
          <div className="grid grid-cols-3 gap-3">
            <FormSelect
              id="cham-miles-day"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              options={dayOptions}
              placeholder={c.dayPlaceholder}
              aria-label={c.dayPlaceholder}
            />
            <FormSelect
              id="cham-miles-month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              options={monthOptions}
              placeholder={c.monthPlaceholder}
              aria-label={c.monthPlaceholder}
            />
            <FormSelect
              id="cham-miles-year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              options={yearOptions}
              placeholder={c.yearPlaceholder}
              aria-label={c.yearPlaceholder}
            />
          </div>
        </div>

        <div className="mt-1 flex flex-col gap-3">
          <label className="flex cursor-pointer items-start gap-2.5 select-none">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 size-4 shrink-0 accent-primary-1"
            />
            <span className={`text-700 ${typography.caption}`}>
              {c.agreeTermsPrefix}{' '}
              <LocalizedLink
                href={c.termsHref || '#'}
                className={cx('no-underline hover:underline', CMS_TEXT_HOVER_CLASS)}
                style={ctaMediumVars}
              >
                {c.termsLabel}
              </LocalizedLink>{' '}
              {c.agreeTermsAnd}{' '}
              <LocalizedLink
                href={c.privacyHref || '#'}
                className={cx('no-underline hover:underline', CMS_TEXT_HOVER_CLASS)}
                style={ctaMediumVars}
              >
                {c.privacyLabel}
              </LocalizedLink>
              .
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-2.5 select-none">
            <input
              type="checkbox"
              checked={agreeMarketing}
              onChange={(e) => setAgreeMarketing(e.target.checked)}
              className="mt-0.5 size-4 shrink-0 accent-primary-1"
            />
            <span className={`text-700 ${typography.caption}`}>{c.agreeMarketingLabel}</span>
          </label>
        </div>

        <button
          type="submit"
          className={cx(
            'mt-2 w-full cursor-pointer rounded-lg border-0 px-6 py-3.5 transition-colors',
            typography.button,
            continueBtn.className,
          )}
          style={continueBtn.style}
        >
          {c.continueLabel}
        </button>
      </form>

      <p className={`mt-5 mb-0 text-center text-700 ${typography.caption}`}>
        {c.hasAccountText}{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className={cx(
            'cursor-pointer border-0 bg-transparent p-0 underline-offset-2 hover:underline',
            CMS_TEXT_HOVER_CLASS,
          )}
          style={ctaVars}
        >
          {c.loginLinkLabel}
        </button>
      </p>
    </>
  )
}

const LoginForm = ({ c, textStyle, ctaVars, ctaMediumVars, loginBtn, onSwitchToRegister }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  const forgotClass = cx(
    'shrink-0 cursor-pointer border-0 bg-transparent p-0 underline-offset-2 hover:underline',
    typography.caption,
    CMS_TEXT_HOVER_CLASS,
  )

  return (
    <>
      <CardHeader title={c.loginTitle} subtitle={c.loginSubtitle} textStyle={textStyle} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.5 sm:gap-4">
        <FormInput
          id="cham-miles-login-email"
          type="email"
          placeholder={c.loginEmailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <FormInput
          id="cham-miles-login-password"
          type={showPassword ? 'text' : 'password'}
          placeholder={c.loginPasswordPlaceholder}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          trailing={
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="shrink-0 border-0 bg-transparent p-0 text-600 hover:text-primary-1"
              aria-label={showPassword ? c.hidePasswordLabel : c.showPasswordLabel}
            >
              {showPassword ? <EyeSlash size={20} weight="regular" /> : <Eye size={20} weight="regular" />}
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
            <span className={`text-700 ${typography.caption}`}>{c.rememberMeLabel}</span>
          </label>
          {c.forgotHref ? (
            <LocalizedLink href={c.forgotHref} className={forgotClass} style={ctaMediumVars}>
              {c.forgotLabel}
            </LocalizedLink>
          ) : (
            <button type="button" className={forgotClass} style={ctaMediumVars}>
              {c.forgotLabel}
            </button>
          )}
        </div>

        <button
          type="submit"
          className={cx(
            'mt-2 w-full cursor-pointer rounded-lg border-0 px-6 py-3.5 transition-colors',
            typography.button,
            loginBtn.className,
          )}
          style={loginBtn.style}
        >
          {c.loginSubmitLabel}
        </button>
      </form>

      <p className={`mt-5 mb-0 text-center text-700 ${typography.caption}`}>
        {c.noAccountText}{' '}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className={cx(
            'cursor-pointer border-0 bg-transparent p-0 underline-offset-2 hover:underline',
            CMS_TEXT_HOVER_CLASS,
          )}
          style={ctaVars}
        >
          {c.createAccountLabel}
        </button>
      </p>
    </>
  )
}

/**
 * CMS-driven Cham Miles registration screen (one full-bleed block): background
 * artwork, logo top-start, welcome copy left and the create-account / sign-in
 * card right. Defaults reproduce the former static /cham-miles page exactly.
 * The forms are presentational (submit prevented). Images come only from the
 * CMS. Layout hides the site header/footer on this path.
 */
const ChamMilesRegister = ({
  bgUrl,
  bgAlt = '',
  logoUrl,
  logoAlt = '',
  logoHref = '/',
  headlineBefore = '',
  headlineBrand = '',
  headlineAfter = '',
  description = '',
  // Register card
  formTitle = '',
  formSubtitle = '',
  titlePlaceholder = '',
  titleOptions = '',
  firstNamePlaceholder = '',
  lastNamePlaceholder = '',
  emailPlaceholder = '',
  countryCodePlaceholder = '',
  countryCodeOptions = '',
  phonePlaceholder = '',
  dobLabel = '',
  dayPlaceholder = '',
  monthPlaceholder = '',
  monthOptions = '',
  yearPlaceholder = '',
  agreeTermsPrefix = '',
  termsLabel = '',
  termsHref = '/legal/terms-and-conditions',
  agreeTermsAnd = '',
  privacyLabel = '',
  privacyHref = '/legal/privacy-policy',
  agreeMarketingLabel = '',
  continueLabel = '',
  hasAccountText = '',
  loginLinkLabel = '',
  // Sign-in card
  loginTitle = '',
  loginSubtitle = '',
  loginEmailPlaceholder = '',
  loginPasswordPlaceholder = '',
  showPasswordLabel = '',
  hidePasswordLabel = '',
  rememberMeLabel = '',
  forgotLabel = '',
  forgotHref = '',
  loginSubmitLabel = '',
  noAccountText = '',
  createAccountLabel = '',
  // Style
  cardBg = '',
  inputBg = '50',
  inputBorder = '200',
  buttonBg = 'primary-1',
  buttonBgHover = 'primary-700',
  buttonText = '50',
  buttonTextFontWeight = 'semibold',
  buttonTextHover,
  buttonTextFontWeightHover,
  continueBg = '',
  continueBgHover = '',
  continueText = '700',
  continueTextFontWeight = 'semibold',
  continueTextHover,
  continueTextFontWeightHover,
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
  ...textStyle
}) => {
  const [mode, setMode] = useState('register')

  const c = {
    formTitle,
    formSubtitle,
    titlePlaceholder,
    titleOptions,
    firstNamePlaceholder,
    lastNamePlaceholder,
    emailPlaceholder,
    countryCodePlaceholder,
    countryCodeOptions,
    phonePlaceholder,
    dobLabel,
    dayPlaceholder,
    monthPlaceholder,
    monthOptions,
    yearPlaceholder,
    agreeTermsPrefix,
    termsLabel,
    termsHref,
    agreeTermsAnd,
    privacyLabel,
    privacyHref,
    agreeMarketingLabel,
    continueLabel,
    hasAccountText,
    loginLinkLabel,
    loginTitle,
    loginSubtitle,
    loginEmailPlaceholder,
    loginPasswordPlaceholder,
    showPasswordLabel,
    hidePasswordLabel,
    rememberMeLabel,
    forgotLabel,
    forgotHref,
    loginSubmitLabel,
    noAccountText,
    createAccountLabel,
  }

  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }

  const loginBtn = getButtonStyle(
    { buttonBg, buttonBgHover, buttonText, buttonTextFontWeight, buttonTextHover, buttonTextFontWeightHover },
    LOGIN_BUTTON,
  )

  const continueBtn = getButtonStyle(
    { continueBg, continueBgHover, continueText, continueTextFontWeight, continueTextHover, continueTextFontWeightHover },
    { ...CONTINUE_BUTTON, bgFallback: continueBg || undefined },
  )
  continueBtn.style = {
    ...continueBtn.style,
    backgroundColor: continueBg ? colorVar(continueBg) : CONTINUE_BG,
    '--cms-bgh': continueBgHover
      ? colorVar(continueBgHover)
      : continueBg
        ? colorVar(continueBg)
        : CONTINUE_BG_HOVER,
  }

  const ctaVars = getTextStyleVars(textStyle, 'ctaColor', 'primary-1', 'semibold')
  // Terms / privacy / "Forgot password?" keep the source's medium weight.
  const ctaMediumVars = { ...ctaVars, fontWeight: 500, '--cms-hw': 500 }

  const headlineParts = [
    headlineBefore && { key: 'before', text: headlineBefore, colorKey: 'headingColor', fallback: 'primary-1' },
    headlineBrand && { key: 'brand', text: headlineBrand, colorKey: 'highlightColor', fallback: 'secondary' },
    headlineAfter && { key: 'after', text: headlineAfter, colorKey: 'headingColor', fallback: 'primary-1' },
  ].filter(Boolean)

  const formProps = { c, textStyle, ctaVars, ctaMediumVars }

  return (
    <section className="relative min-h-dvh w-full min-w-0 overflow-x-clip">
      {bgUrl ? (
        <img
          src={bgUrl}
          alt={bgAlt || ''}
          className="absolute inset-0 size-full object-cover"
          aria-hidden={bgAlt ? undefined : true}
        />
      ) : null}

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-page flex-col py-5 ps-3 pe-4 sm:ps-5 sm:pe-8 md:py-8 md:ps-6 md:pe-10 xl:ps-2 xl:pe-0">
        {logoUrl ? (
          <LocalizedLink
            href={logoHref || '/'}
            className="inline-flex w-fit shrink-0"
            aria-label={logoAlt || undefined}
          >
            <img src={logoUrl} alt={logoAlt} className="w-auto object-contain" />
          </LocalizedLink>
        ) : null}

        <div className="grid flex-1 grid-cols-1 items-center gap-10 py-8 lg:grid-cols-2 lg:gap-8 xl:gap-12">
          <div className="relative z-10 flex max-w-md flex-col gap-1 lg:max-w-xl lg:self-start lg:pt-[12vh]">
            {headlineParts.length ? (
              <h2 className={`m-0 font-bold leading-tight ${typography.pageTitle} lg:text-[44px] xl:text-[44px]`}>
                {headlineParts.map((part, i) => (
                  <Fragment key={part.key}>
                    {i > 0 ? ' ' : null}
                    <span
                      className={CMS_TEXT_HOVER_CLASS}
                      style={getTextStyleVars(textStyle, part.colorKey, part.fallback, 'bold')}
                    >
                      {part.text}
                    </span>
                  </Fragment>
                ))}
              </h2>
            ) : null}
            {description ? (
              <p
                className={cx('m-0 leading-relaxed', typography.sectionDescription, CMS_TEXT_HOVER_CLASS)}
                style={getTextStyleVars(textStyle, 'descriptionColor', '800', 'normal')}
              >
                <LinkedText text={description} {...linkProps} />
              </p>
            ) : null}
          </div>

          <div className="relative z-10 flex w-full justify-center lg:justify-end lg:translate-x-3 xl:translate-x-6 rtl:lg:-translate-x-3 rtl:xl:-translate-x-6">
            <div
              className={cx(
                'w-full max-w-xl rounded-2xl p-5 shadow-[0_8px_32px_rgba(1,38,59,0.08)] sm:p-7 md:p-8',
                !cardBg && 'bg-[#E8E8E8]',
              )}
              style={{
                ...(cardBg ? { backgroundColor: colorVar(cardBg) } : {}),
                '--cm-input-bg': colorVar(inputBg || '50'),
                '--cm-input-border': colorVar(inputBorder || '200'),
              }}
            >
              {mode === 'register' ? (
                <RegisterForm
                  {...formProps}
                  continueBtn={continueBtn}
                  onSwitchToLogin={() => setMode('login')}
                />
              ) : (
                <LoginForm
                  {...formProps}
                  loginBtn={loginBtn}
                  onSwitchToRegister={() => setMode('register')}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ChamMilesRegister
