import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CMS_TEXT_HOVER_CLASS,
  colorVar,
  getTextStyleVars,
} from '../../styles/cmsStyle.js'
import { resolvePhosphorIcon } from '../../cms/adapters/phosphorIcons.js'
import { withLanguage } from '../../i18n/languages.js'
import useCurrentLanguage from '../hooks/useCurrentLanguage.js'
import { FLYCHAM_SITE_URL } from '../../vendor/flycham/lib/flychamSite.js'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'

const SECTION_PADDING = {
  none: '',
  tight: 'py-4 md:py-6',
  default: '',
  loose: 'py-10 md:py-16',
}

const cx = (...parts) => parts.filter(Boolean).join(' ')

const linkStyle = (style) => ({
  linkColor: style.linkColor,
  linkHoverColor: style.linkHoverColor,
  linkFontWeight: style.linkFontWeight,
  linkUnderline: style.linkUnderline,
  linkItalic: style.linkItalic,
})

function Field({ id, icon, label, placeholder, value, onChange, style }) {
  const Icon = icon ? resolvePhosphorIcon(icon) : null
  return (
    <label
      htmlFor={id}
      className="flex min-h-[84px] cursor-text items-center gap-3 rounded-[10px] px-4"
      style={{ backgroundColor: colorVar(style.fieldBg || '100') }}
    >
      {Icon ? (
        <Icon size={22} weight="regular" className="shrink-0" style={{ color: colorVar(style.iconColor || '800') }} aria-hidden />
      ) : null}
      <span className="min-w-0 flex-1">
        {label ? (
          <span className={cx('block text-sm', CMS_TEXT_HOVER_CLASS)} style={getTextStyleVars(style, 'labelColor', '800', 'medium')}>
            {label}
          </span>
        ) : null}
        <input
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder || ' '}
          autoComplete="off"
          className="block w-full border-0 bg-transparent p-0 text-sm text-800 placeholder:text-800/40 focus:outline-none focus:ring-0"
        />
      </span>
    </label>
  )
}

function Help({ href, className, style, children }) {
  if (!href) return <span className={className} style={style}>{children}</span>
  if (/^https?:/i.test(href)) return <a href={href} className={className} style={style}>{children}</a>
  return <LocalizedLink to={href} className={className} style={style}>{children}</LocalizedLink>
}

/**
 * Find-your-booking card. An empty button link opens flycham.com manage booking,
 * because this site does not complete the reservation flow.
 */
const BookingLookup = ({
  title = '',
  pnrLabel = '',
  pnrPlaceholder = '',
  pnrIcon = 'Ticket',
  lastNameLabel = '',
  lastNamePlaceholder = '',
  lastNameIcon = 'User',
  helpLabel = '',
  helpHref = '',
  helpIcon = 'Info',
  buttonLabel = '',
  buttonHref = '',
  links = [],
  showLinks = true,
  showTitle = true,
  showHelp = true,
  showButton = true,
  sectionPadding = 'none',
  cardBg = 'background',
  fieldBg = '100',
  iconColor = '800',
  submitBg = 'secondary',
  ...textStyle
}) => {
  const navigate = useNavigate()
  const language = useCurrentLanguage()
  const [pnr, setPnr] = useState('')
  const [lastName, setLastName] = useState('')
  const style = { showLinks, fieldBg, iconColor, submitBg, ...textStyle }
  const canSearch = Boolean(pnr.trim()) && Boolean(lastName.trim())
  if (!title && !pnrLabel && !lastNameLabel && !buttonLabel) return null

  const onSubmit = (event) => {
    event.preventDefault()
    if (!canSearch) return
    const href = String(buttonHref || '').trim() || `${FLYCHAM_SITE_URL}/gb/${language}/manage-booking`
    if (/^https?:/i.test(href)) {
      window.location.assign(href)
      return
    }
    navigate(withLanguage(href, language))
  }

  const HelpIcon = helpIcon ? resolvePhosphorIcon(helpIcon) : null
  const padding = SECTION_PADDING[sectionPadding] ?? ''
  const buttonVars = canSearch
    ? { backgroundColor: colorVar(submitBg || 'secondary'), ...getTextStyleVars(style, 'buttonColor', '700', 'semibold') }
    : { backgroundColor: colorVar('200'), color: colorVar('400') }

  return (
    <section className={padding}>
      <form
        onSubmit={onSubmit}
        noValidate
        className="flex flex-col gap-5 rounded-2xl px-5 py-6  md:px-8 md:py-8"
        style={{ backgroundColor: colorVar(cardBg) }}
      >
        {showTitle && title ? (
          <h2 className={cx('m-0 text-[22px] leading-tight', CMS_TEXT_HOVER_CLASS)} style={getTextStyleVars(style, 'titleColor', 'secondary-2', 'semibold')}>
            <LinkedText text={title} links={links} enabled={showLinks} {...linkStyle(style)} />
          </h2>
        ) : null}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field
            id="booking-lookup-pnr"
            icon={pnrIcon}
            label={pnrLabel}
            placeholder={pnrPlaceholder}
            value={pnr}
            onChange={(event) => setPnr(event.target.value)}
            style={style}
          />
          <Field
            id="booking-lookup-last-name"
            icon={lastNameIcon}
            label={lastNameLabel}
            placeholder={lastNamePlaceholder}
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            style={style}
          />
        </div>
        {showHelp && helpLabel ? (
          <Help
            href={helpHref}
            className={cx('m-0 inline-flex w-fit items-center gap-2 text-sm no-underline', CMS_TEXT_HOVER_CLASS)}
            style={getTextStyleVars(style, 'helpTitleColor', 'primary-1', 'medium')}
          >
            {HelpIcon ? <HelpIcon size={18} weight="regular" aria-hidden /> : null}
            <LinkedText text={helpLabel} links={links} enabled={showLinks} {...linkStyle(style)} />
          </Help>
        ) : null}
        {showButton && buttonLabel ? (
          <button
            type="submit"
            disabled={!canSearch}
            className={cx('inline-flex h-12 w-fit items-center justify-center rounded-lg border-none px-6 text-base', canSearch ? 'cursor-pointer' : 'cursor-not-allowed')}
            style={buttonVars}
          >
            {buttonLabel}
          </button>
        ) : null}
      </form>
    </section>
  )
}

export default BookingLookup
