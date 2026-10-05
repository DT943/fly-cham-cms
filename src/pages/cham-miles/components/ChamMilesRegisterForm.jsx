import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CaretDown, Eye, EyeSlash } from '@phosphor-icons/react'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'
import { typography } from '../../../styles/typography.js'

const fieldShell =
  'flex min-h-12 w-full items-center rounded-lg border border-200 bg-50 px-3.5 text-800 outline-none transition-colors placeholder:text-500 focus:border-primary-1 focus:ring-0'

const FormInput = ({
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  autoComplete,
  className = '',
  trailing,
}) => (
  <div className={`flex min-h-12 w-full items-center gap-2 rounded-lg border border-200 bg-50 px-3.5 ${className}`}>
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

const FormSelect = ({ id, value, onChange, options, placeholder, className = '', 'aria-label': ariaLabel }) => (
  <div className={`relative min-w-0 ${className}`}>
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

const RegisterForm = ({ onSwitchToLogin }) => {
  const { t, i18n } = useTranslation()
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

  const titleOptions = useMemo(
    () => [
      { value: 'mr', label: t('chamMiles.form.titles.mr') },
      { value: 'mrs', label: t('chamMiles.form.titles.mrs') },
      { value: 'ms', label: t('chamMiles.form.titles.ms') },
      { value: 'miss', label: t('chamMiles.form.titles.miss') },
    ],
    [t, i18n.language],
  )

  const countryOptions = useMemo(
    () => [
      { value: '+963', label: t('chamMiles.form.countryCodes.sy') },
      { value: '+971', label: t('chamMiles.form.countryCodes.ae') },
      { value: '+966', label: t('chamMiles.form.countryCodes.sa') },
      { value: '+961', label: t('chamMiles.form.countryCodes.lb') },
      { value: '+962', label: t('chamMiles.form.countryCodes.jo') },
      { value: '+20', label: t('chamMiles.form.countryCodes.eg') },
    ],
    [t, i18n.language],
  )

  const dayOptions = useMemo(
    () => Array.from({ length: 31 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) })),
    [],
  )

  const monthOptions = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const value = String(i + 1)
        return { value, label: t(`chamMiles.form.months.${value}`) }
      }),
    [t, i18n.language],
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
      <div className="mb-5 flex flex-col gap-1.5 sm:mb-6">
        <h1 className={`m-0 font-semibold text-primary-1 ${typography.sectionTitle}`}>
          {t('chamMiles.form.title')}
        </h1>
        <p className={`m-0 font-normal text-600 ${typography.caption}`}>
          {t('chamMiles.form.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.5 sm:gap-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[7.5rem_1fr_1fr] sm:gap-3">
          <FormSelect
            id="cham-miles-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            options={titleOptions}
            placeholder={t('chamMiles.form.titlePlaceholder')}
            aria-label={t('chamMiles.form.titlePlaceholder')}
          />
          <FormInput
            id="cham-miles-first-name"
            placeholder={t('chamMiles.form.firstName')}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            autoComplete="given-name"
          />
          <FormInput
            id="cham-miles-last-name"
            placeholder={t('chamMiles.form.lastName')}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            autoComplete="family-name"
          />
        </div>

        <FormInput
          id="cham-miles-email"
          type="email"
          placeholder={t('chamMiles.form.email')}
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
            placeholder={t('chamMiles.form.countryCode')}
            aria-label={t('chamMiles.form.countryCode')}
          />
          <FormInput
            id="cham-miles-phone"
            type="tel"
            placeholder={t('chamMiles.form.phone')}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel-national"
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className={`font-medium text-700 ${typography.caption}`}>
            {t('chamMiles.form.dateOfBirth')}
          </span>
          <div className="grid grid-cols-3 gap-3">
            <FormSelect
              id="cham-miles-day"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              options={dayOptions}
              placeholder={t('chamMiles.form.day')}
              aria-label={t('chamMiles.form.day')}
            />
            <FormSelect
              id="cham-miles-month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              options={monthOptions}
              placeholder={t('chamMiles.form.month')}
              aria-label={t('chamMiles.form.month')}
            />
            <FormSelect
              id="cham-miles-year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              options={yearOptions}
              placeholder={t('chamMiles.form.year')}
              aria-label={t('chamMiles.form.year')}
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
              {t('chamMiles.form.agreeTermsPrefix')}{' '}
              <LocalizedLink
                href="/legal/terms-and-conditions"
                className="font-medium text-primary-1 no-underline hover:underline"
              >
                {t('chamMiles.form.terms')}
              </LocalizedLink>{' '}
              {t('chamMiles.form.agreeTermsAnd')}{' '}
              <LocalizedLink
                href="/legal/privacy-policy"
                className="font-medium text-primary-1 no-underline hover:underline"
              >
                {t('chamMiles.form.privacy')}
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
            <span className={`text-700 ${typography.caption}`}>
              {t('chamMiles.form.agreeMarketing')}
            </span>
          </label>
        </div>

        <button
          type="submit"
          className={`mt-2 w-full cursor-pointer rounded-lg border-0 bg-[#D0D0D0] px-6 py-3.5 font-semibold text-700 transition-colors hover:bg-[#C4C4C4] ${typography.button}`}
        >
          {t('chamMiles.form.continue')}
        </button>
      </form>

      <p className={`mt-5 mb-0 text-center text-700 ${typography.caption}`}>
        {t('chamMiles.form.hasAccount')}{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="cursor-pointer border-0 bg-transparent p-0 font-semibold text-primary-1 underline-offset-2 hover:underline"
        >
          {t('chamMiles.form.loginLink')}
        </button>
      </p>
    </>
  )
}

const LoginForm = ({ onSwitchToRegister }) => {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <>
      <div className="mb-5 flex flex-col gap-1.5 sm:mb-6">
        <h1 className={`m-0 font-semibold text-primary-1 ${typography.sectionTitle}`}>
          {t('chamMiles.login.title')}
        </h1>
        <p className={`m-0 font-normal text-600 ${typography.caption}`}>
          {t('chamMiles.login.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.5 sm:gap-4">
        <FormInput
          id="cham-miles-login-email"
          type="email"
          placeholder={t('chamMiles.login.email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <FormInput
          id="cham-miles-login-password"
          type={showPassword ? 'text' : 'password'}
          placeholder={t('chamMiles.login.password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          trailing={
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="shrink-0 border-0 bg-transparent p-0 text-600 hover:text-primary-1"
              aria-label={
                showPassword ? t('chamMiles.login.hidePassword') : t('chamMiles.login.showPassword')
              }
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
            <span className={`text-700 ${typography.caption}`}>
              {t('chamMiles.login.rememberMe')}
            </span>
          </label>
          <button
            type="button"
            className={`shrink-0 cursor-pointer border-0 bg-transparent p-0 font-medium text-primary-1 underline-offset-2 hover:underline ${typography.caption}`}
          >
            {t('chamMiles.login.forgotPassword')}
          </button>
        </div>

        <button
          type="submit"
          className={`mt-2 w-full cursor-pointer rounded-lg border-0 bg-primary-1 px-6 py-3.5 font-semibold text-50 transition-colors hover:bg-primary-700 ${typography.button}`}
        >
          {t('chamMiles.login.submit')}
        </button>
      </form>

      <p className={`mt-5 mb-0 text-center text-700 ${typography.caption}`}>
        {t('chamMiles.login.noAccount')}{' '}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="cursor-pointer border-0 bg-transparent p-0 font-semibold text-primary-1 underline-offset-2 hover:underline"
        >
          {t('chamMiles.login.createAccount')}
        </button>
      </p>
    </>
  )
}

/**
 * Cham Miles auth card — toggles between create-account and sign-in.
 */
const ChamMilesRegisterForm = () => {
  const [mode, setMode] = useState('register')

  return (
    <div className="w-full max-w-xl rounded-2xl bg-[#E8E8E8] p-5  sm:p-7 md:p-8">
      {mode === 'register' ? (
        <RegisterForm onSwitchToLogin={() => setMode('login')} />
      ) : (
        <LoginForm onSwitchToRegister={() => setMode('register')} />
      )}
    </div>
  )
}

export default ChamMilesRegisterForm
