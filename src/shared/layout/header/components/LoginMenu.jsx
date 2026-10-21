import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle, Eye, EyeSlash, X } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import Container from '../../../components/Container.jsx'
import LocalizedLink from '../../../components/LocalizedLink.jsx'
import { colorVar } from '../../../../styles/cmsStyle.js'
import { headerHref } from '../headerStyle.js'

/**
 * Header log-in panel
 * (desktop Figma 41671:57278 / mobile Figma 41770:49092).
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
  const showWelcomePanel = login.showWelcomePanel !== false // set in useSiteHeader from boolean + durable flag
  const promoFrom = colorVar(hs.loginPromoFrom || 'primary-1')
  const promoTo = colorVar(hs.loginPromoTo || 'secondary-2')
  const formBg = colorVar(hs.loginFormBg || '50')
  const isMobileSheet = isMobile && !embedded

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  /** Shared form stack — mobile uses full width + Figma 41770:49092 sizes. */
  const formStack = (fullWidth) => (
    <>
      <form
        onSubmit={handleSubmit}
        noValidate
        className={`flex flex-col gap-4 ${fullWidth ? 'w-full' : 'w-full max-w-[318px]'}`}
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
            className={`w-full min-w-0 border-0 bg-transparent p-0 font-normal leading-normal outline-none placeholder:opacity-60 focus:outline-none focus:ring-0 ${
              fullWidth ? 'text-[14px]' : 'text-[13px]'
            }`}
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
            className="flex size-4 shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0"
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

      <div
        className={`flex items-center gap-4 ${fullWidth ? 'w-full' : 'mt-4 w-full max-w-[318px]'}`}
      >
        <span
          className="h-px min-w-0 flex-1"
          style={{ backgroundColor: colorVar(hs.loginDividerColor || '300') }}
          aria-hidden
        />
        <span
          className={`shrink-0 font-normal ${fullWidth ? 'text-[12px]' : 'text-[14px]'}`}
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

      {login.createAccountLabel ? (
        <LocalizedLink
          to={headerHref(login.createAccountHref || login.href)}
          onClick={onNavigate}
          className={`flex h-[42px] items-center justify-center rounded-lg border border-solid text-[14px] font-semibold leading-5 no-underline ${
            fullWidth ? 'w-full' : 'mt-4 w-full max-w-[318px]'
          }`}
          style={{
            borderColor: colorVar(hs.loginCreateBorder || 'primary-1'),
            color: colorVar(hs.loginCreateText || 'primary-1'),
          }}
        >
          {login.createAccountLabel}
        </LocalizedLink>
      ) : null}
    </>
  )

  const formColumn = (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center overflow-hidden px-6 py-8 lg:h-[449px] lg:px-9 lg:py-10">
      {login.brandLogoUrl ? (
        <img loading="lazy" decoding="async"
          src={login.brandLogoUrl}
          alt=""
          className="mb-8 h-[59px] w-auto max-w-[137px] object-contain"
        />
      ) : null}
      {formStack(false)}
    </div>
  )

  const promoColumn = (
    <div
      className="relative hidden h-[449px] w-[435px] shrink-0 flex-col justify-between overflow-hidden px-[26px] py-9 lg:flex"
      style={{
        backgroundImage: `linear-gradient(to bottom, ${promoFrom}, ${promoTo})`,
      }}
    >
      {login.panelImageUrl ? (
        <img loading="lazy" decoding="async"
          src={login.panelImageUrl}
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 size-full object-cover opacity-10"
        />
      ) : null}

      <div className="relative z-[1] flex min-h-0 flex-col gap-5 overflow-hidden">
        {login.panelTitle ? (
          <h2
            className="m-0 text-[28px] font-semibold leading-[1.4] rtl:text-[24px] rtl:leading-[1.45] lg:text-[32px] lg:rtl:text-[26px]"
            style={{ color: colorVar(hs.loginTitleColor || '50') }}
          >
            {login.panelTitle}
          </h2>
        ) : null}
        {login.panelSubtitle ? (
          <p
            className="m-0 text-[16px] font-medium leading-[1.32] rtl:text-[15px] lg:text-[18px] lg:rtl:text-[16px]"
            style={{ color: colorVar(hs.loginSubtitleColor || '50') }}
          >
            {login.panelSubtitle}
          </p>
        ) : null}
      </div>

      {Array.isArray(login.benefits) && login.benefits.length ? (
        <ul className="relative z-[1] m-0 flex shrink-0 list-none flex-col gap-4 p-0">
          {login.benefits.map((item, index) =>
            item?.text ? (
              <li key={item.id || `benefit-${index}`} className="flex items-start gap-1">
                <CheckCircle
                  size={16}
                  weight="fill"
                  className="mt-0.5 shrink-0"
                  style={{ color: colorVar(hs.loginCheckColor || 'secondary') }}
                  aria-hidden
                />
                <span
                  className="min-w-0 text-[14px] font-normal leading-[1.32] rtl:text-[13px]"
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

  if (isMobileSheet && typeof document !== 'undefined') {
    return createPortal(
      <div
        data-header-login-sheet
        className="fixed inset-0 z-[1050] flex h-dvh w-full flex-col lg:hidden"
        style={{ backgroundColor: formBg }}
        role="dialog"
        aria-modal="true"
        aria-label={login.label || login.panelTitle}
      >
        {/* Figma 41770:49092 — 16px side inset, top block + form block spaced apart */}
        <div className="flex min-h-0 flex-1 flex-col justify-between px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[38px]">
          <div className="flex w-full flex-col items-end gap-6 px-1.5">
            {onClose ? (
              <button
                type="button"
                onClick={onClose}
                aria-label={t('layout.header.closeMenu')}
                className="flex size-6 shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-700"
              >
                <X size={24} weight="regular" />
              </button>
            ) : null}

            <div className="flex w-full flex-col items-center gap-2.5">
              {login.brandLogoUrl ? (
                <img loading="lazy" decoding="async"
                  src={login.brandLogoUrl}
                  alt=""
                  className="h-[81px] w-auto max-w-[187px] object-contain"
                />
              ) : null}
              {login.panelTitle ? (
                <h2
                  className="m-0 w-full text-center text-[20px] font-medium leading-[1.5]"
                  style={{ color: colorVar(hs.loginInputTextColor || '700') }}
                >
                  {login.panelTitle}
                </h2>
              ) : null}
            </div>
          </div>

          <div className="flex w-full flex-col items-center gap-4 px-1.5 pt-8">
            {formStack(true)}
          </div>
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
          : // Parent panel wrapper is pointer-events-none; only the card catches clicks.
            'pointer-events-none hidden w-full bg-transparent lg:block'
      }
    >
      <Container
        className={`flex justify-end py-0 ${embedded ? 'px-0 sm:px-0 md:px-0 xl:px-0' : 'pb-0 pt-0'}`}
      >
        <div
          className={`pointer-events-auto flex w-full flex-col overflow-hidden bg-50 lg:h-[449px] lg:flex-row lg:items-stretch ${
            showWelcomePanel ? 'max-w-[797px]' : 'max-w-[362px]'
          } ${
            // Flush under the header — no bottom radius/shadow (those left a
            // gray halo and corner gap that read as white space).
            embedded ? 'rounded-xl' : ''
          }`}
          style={{ backgroundColor: formBg }}
        >
          {showWelcomePanel ? promoColumn : null}
          {formColumn}
        </div>
      </Container>
    </div>
  )
}

export default LoginMenu
