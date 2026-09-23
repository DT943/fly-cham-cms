import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { User, Lock, Eye, EyeSlash } from '@phosphor-icons/react'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'
import { typography } from '../../../styles/typography.js'

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
}) => (
  <div className="flex w-full flex-col gap-1.5">
    <label htmlFor={id} className={`m-0 font-medium text-800 ${typography.caption}`}>
      {label}
    </label>
    <div className="flex min-h-12 items-center gap-3 rounded-lg border border-200 bg-50 px-3.5">
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
 * Glass login card: username/password, remember me, forgot password, CTA, partner + support links.
 */
const TravelAgentLoginForm = () => {
  const { t } = useTranslation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-50/40 bg-50/75 p-6 shadow-[0_8px_32px_rgba(1,38,59,0.12)] backdrop-blur-md sm:p-8">
      <div className="mb-6 flex flex-col gap-1.5">
        <h1 className={`m-0 font-semibold text-primary-1 ${typography.sectionTitle}`}>
          {t('loginTravelAgent.form.title')}
        </h1>
        <p className={`m-0 font-normal text-600 ${typography.caption}`}>
          {t('loginTravelAgent.form.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <LoginField
          id="travel-agent-username"
          label={t('loginTravelAgent.form.username')}
          icon={User}
          placeholder={t('loginTravelAgent.form.usernamePlaceholder')}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />

        <LoginField
          id="travel-agent-password"
          label={t('loginTravelAgent.form.password')}
          type={showPassword ? 'text' : 'password'}
          icon={Lock}
          placeholder={t('loginTravelAgent.form.passwordPlaceholder')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
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
            <span className={`text-700 ${typography.caption}`}>
              {t('loginTravelAgent.form.rememberMe')}
            </span>
          </label>
          <LocalizedLink
            href="/coming-soon"
            className={`shrink-0 font-medium text-primary-1 underline-offset-2 hover:underline ${typography.caption}`}
          >
            {t('loginTravelAgent.form.forgotPassword')}
          </LocalizedLink>
        </div>

        <button
          type="submit"
          className={`mt-1 w-full cursor-pointer rounded-lg border-0 bg-primary-1 px-6 py-3.5 font-semibold uppercase tracking-wide text-50 transition-colors hover:bg-primary-700 ${typography.button}`}
        >
          {t('loginTravelAgent.form.login')}
        </button>
      </form>

      <p className={`mt-5 mb-0 text-center text-700 ${typography.caption}`}>
        {t('loginTravelAgent.form.noAccount')}{' '}
        <LocalizedLink
          href="/help/contact-us/forms"
          className="font-semibold text-primary-1 no-underline hover:underline"
        >
          {t('loginTravelAgent.form.joinPartner')}
        </LocalizedLink>
      </p>

      <div className="mt-6 flex flex-col items-center gap-1 border-t border-200 pt-5 text-center">
        <span className={`text-600 ${typography.caption}`}>
          {t('loginTravelAgent.form.needHelp')}
        </span>
        <LocalizedLink
          href="/help/contact-us"
          className={`font-semibold text-primary-1 no-underline hover:underline ${typography.caption}`}
        >
          {t('loginTravelAgent.form.contactSupport')}
        </LocalizedLink>
      </div>
    </div>
  )
}

export default TravelAgentLoginForm
