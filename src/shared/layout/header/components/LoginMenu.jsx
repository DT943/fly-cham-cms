import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle, Eye, EyeSlash, X } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import Container from '../../../components/Container.jsx'
import LocalizedLink from '../../../components/LocalizedLink.jsx'
import { colorVar } from '../../../../styles/cmsStyle.js'
import { headerHref } from '../headerStyle.js'

/**
 * Header log-in panel (Figma 41671:57278 desktop / mobile full-screen).
 * Copy and colours come from the header document (`login` + `style.login*`).
 */
const LoginMenu = ({ login, headerStyle, onNavigate, onClose, embedded = false }) => {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches,
  )

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)')
    const sync = () => setIsMobile(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (!isMobile || embedded) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [isMobile, embedded])

  if (!login) return null

  const hs = headerStyle || {}
  const promoFrom = colorVar(hs.loginPromoFrom || 'primary-1')
  const promoTo = colorVar(hs.loginPromoTo || 'secondary-2')
  const formBg = colorVar(hs.loginFormBg || '50')

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  const formFields = (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex w-full max-w-[318px] flex-col gap-4"
    >
      <label
        className="flex h-[50px] cursor-text flex-col justify-center gap-1 rounded-lg border border-solid px-[17px] py-[7px]"
        style={{ borderColor: colorVar(hs.loginInputBorder || '300') }}
      >
        <span
          className="text-[10px] font-normal leading-normal"
          style={{ color: colorVar(hs.loginInputLabelColor || '600') }}
        >
          {login.emailLabel}
        </span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={login.emailPlaceholder}
          aria-label={login.emailLabel}
          className="w-full min-w-0 border-0 bg-transparent p-0 text-[13px] font-normal leading-normal outline-none placeholder:opacity-60 focus:outline-none focus:ring-0"
          style={{ color: colorVar(hs.loginInputTextColor || '700') }}
        />
      </label>

      <label
        className="flex h-[50px] cursor-text items-center justify-between gap-2 rounded-lg border border-solid px-[17px] py-[7px]"
        style={{ borderColor: colorVar(hs.loginInputBorder || '300') }}
      >
        <span className="flex min-w-0 flex-1 flex-col justify-center gap-1">
          <span
            className="text-[10px] font-normal leading-normal"
            style={{ color: colorVar(hs.loginInputLabelColor || '600') }}
          >
            {login.passwordLabel}
          </span>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={login.passwordPlaceholder}
            aria-label={login.passwordLabel}
            className="w-full min-w-0 border-0 bg-transparent p-0 text-[14px] font-medium leading-normal outline-none placeholder:opacity-60 focus:outline-none focus:ring-0"
            style={{ color: colorVar(hs.loginInputTextColor || '700') }}
          />
        </span>
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="shrink-0 border-0 bg-transparent p-0"
          style={{ color: colorVar(hs.loginInputLabelColor || '600') }}
          aria-label={showPassword ? login.hidePasswordLabel : login.showPasswordLabel}
        >
          {showPassword ? (
            <EyeSlash size={16} weight="regular" />
          ) : (
            <Eye size={16} weight="regular" />
          )}
        </button>
      </label>

      <button
        type="submit"
        className="flex h-[42px] w-full cursor-pointer items-center justify-center rounded-lg border-0 text-[14px] font-semibold leading-5"
        style={{
          backgroundColor: colorVar(hs.loginSubmitBg || 'primary-1'),
          color: colorVar(hs.loginSubmitText || '50'),
        }}
      >
        {login.submitLabel}
      </button>
    </form>
  )

  const orDivider = (
    <div className="mt-4 flex w-full max-w-[318px] items-center gap-4">
      <span
        className="h-px min-w-0 flex-1"
        style={{ backgroundColor: colorVar(hs.loginDividerColor || '300') }}
        aria-hidden
      />
      <span
        className="shrink-0 text-[14px] font-normal"
        style={{ color: colorVar(hs.loginOrColor || '500') }}
      >
        {login.orLabel}
      </span>
      <span
        className="h-px min-w-0 flex-1"
        style={{ backgroundColor: colorVar(hs.loginDividerColor || '300') }}
        aria-hidden
      />
    </div>
  )

  const createAccount =
    login.createAccountLabel ? (
      <LocalizedLink
        to={headerHref(login.createAccountHref || login.href)}
        onClick={onNavigate}
        className="mt-4 flex h-[42px] w-full max-w-[318px] items-center justify-center rounded-lg border border-solid text-[14px] font-semibold leading-5 no-underline"
        style={{
          borderColor: colorVar(hs.loginCreateBorder || 'primary-1'),
          color: colorVar(hs.loginCreateText || 'primary-1'),
        }}
      >
        {login.createAccountLabel}
      </LocalizedLink>
    ) : null

  const formColumn = (
    <div
      className={`flex min-h-0 min-w-0 flex-1 flex-col items-center overflow-y-auto ${
        isMobile && !embedded
          ? 'w-full px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-16'
          : 'px-6 py-8 lg:px-9 lg:py-10'
      }`}
    >
      {login.brandLogoUrl ? (
        <img
          src={login.brandLogoUrl}
          alt=""
          className={`h-[59px] w-auto max-w-[137px] object-contain ${
            isMobile && !embedded ? 'mb-5' : 'mb-8'
          }`}
        />
      ) : null}

      {login.panelTitle && isMobile && !embedded ? (
        <h2
          className="mb-8 max-w-[318px] text-center text-[20px] font-medium leading-[1.4]"
          style={{ color: colorVar(hs.loginInputTextColor || '700') }}
        >
          {login.panelTitle}
        </h2>
      ) : null}

      {formFields}
      {orDivider}
      {createAccount}
    </div>
  )

  const promoColumn = (
    <div
      className="relative hidden min-h-[449px] w-[435px] shrink-0 flex-col justify-between overflow-hidden px-[26px] py-9 lg:flex"
      style={{
        backgroundImage: `linear-gradient(to bottom, ${promoFrom}, ${promoTo})`,
      }}
    >
      {login.panelImageUrl ? (
        <img
          src={login.panelImageUrl}
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 size-full object-cover opacity-10"
        />
      ) : null}

      <div className="relative z-[1] flex flex-col gap-5">
        {login.panelTitle ? (
          <h2
            className="m-0 text-[32px] font-semibold leading-[1.5]"
            style={{ color: colorVar(hs.loginTitleColor || '50') }}
          >
            {login.panelTitle}
          </h2>
        ) : null}
        {login.panelSubtitle ? (
          <p
            className="m-0 text-[18px] font-medium leading-[1.32]"
            style={{ color: colorVar(hs.loginSubtitleColor || '50') }}
          >
            {login.panelSubtitle}
          </p>
        ) : null}
      </div>

      {Array.isArray(login.benefits) && login.benefits.length ? (
        <ul className="relative z-[1] m-0 flex list-none flex-col gap-4 p-0">
          {login.benefits.map((item, index) =>
            item?.text ? (
              <li key={item.id || `benefit-${index}`} className="flex items-center gap-1">
                <CheckCircle
                  size={16}
                  weight="fill"
                  className="shrink-0"
                  style={{ color: colorVar(hs.loginCheckColor || 'secondary') }}
                  aria-hidden
                />
                <span
                  className="text-[14px] font-normal leading-[1.32]"
                  style={{ color: colorVar(hs.loginBenefitColor || '100') }}
                >
                  {item.text}
                </span>
              </li>
            ) : null,
          )}
        </ul>
      ) : null}
    </div>
  )

  if (isMobile && !embedded && typeof document !== 'undefined') {
    return createPortal(
      <div
        className="fixed inset-0 z-[1050] flex h-dvh w-full flex-col lg:hidden"
        style={{ backgroundColor: formBg }}
        role="dialog"
        aria-modal="true"
        aria-label={login.label || login.panelTitle}
      >
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label={t('layout.header.closeMenu')}
            className="absolute end-4 top-4 z-[1] flex size-10 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-700"
          >
            <X size={24} weight="regular" />
          </button>
        ) : null}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden" style={{ backgroundColor: formBg }}>
          {formColumn}
        </div>
      </div>,
      document.body,
    )
  }

  return (
    <div
      className={
        embedded
          ? 'w-full'
          : 'hidden w-full bg-transparent shadow-[0_4px_16px_rgba(33,37,41,0.08)] lg:block'
      }
    >
      <Container
        className={`flex justify-end py-0 ${embedded ? 'px-0 sm:px-0 md:px-0 xl:px-0' : 'pb-0 pt-0'}`}
      >
        <div
          className={`flex w-full max-w-[797px] flex-col overflow-hidden bg-50 lg:flex-row ${
            embedded ? 'rounded-xl' : 'rounded-b-xl'
          }`}
          style={{ backgroundColor: formBg }}
        >
          {promoColumn}
          {formColumn}
        </div>
      </Container>
    </div>
  )
}

export default LoginMenu
