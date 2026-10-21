import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import checkCircleIcon from '../../assets/icons/track-request/check-circle.svg'
import noMatchIcon from '../../assets/icons/track-request/no-match.svg'
import chatDotsIcon from '../../assets/icons/track-request/chat-dots.svg'
import phoneIcon from '../../assets/icons/track-request/phone.svg'
import {
  colorVar,
  getButtonStyle,
  getTextStyleVars,
  CMS_TEXT_HOVER_CLASS,
} from '../../styles/cmsStyle.js'
import useCurrentLanguage from '../hooks/useCurrentLanguage.js'
import LinkedText from './backlinks/LinkedText.jsx'
import LocalizedLink from './LocalizedLink.jsx'

const cx = (...parts) => parts.filter(Boolean).join(' ')

// Explicit sizes from the Figma design — kept identical to the cms2 renderer.
const TITLE_SIZE_CLASS = 'text-2xl md:text-[28px]'
const SUBTITLE_SIZE_CLASS = 'text-base leading-6'
const LABEL_SIZE_CLASS = 'text-base leading-6'

const TITLE_ALIGN_CLASS = {
  left: 'text-start',
  center: 'text-center',
  right: 'text-end',
}

const TITLE_ITEMS_CLASS = {
  left: 'items-start',
  center: 'items-center',
  right: 'items-end',
}

const SECTION_PADDING_CLASS = {
  tight: 'py-4 md:py-6',
  default: '',
  loose: 'py-10 md:py-16',
}

const REQUIRED_TEXT = {
  en: 'This field is required',
  ar: 'هذا الحقل مطلوب',
}

/** "fcr000152" → "FCR-000152". Other values are shown in uppercase. */
function formatCaseNumber(value) {
  const compact = value.trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
  const match = compact.match(/^([A-Z]+)(\d+)$/)
  return match ? `${match[1]}-${match[2]}` : value.trim().toUpperCase()
}

/** "alex.morgan@gmail.com" → "Alex Morgan". A last name is shown as typed. */
function formatFullName(value) {
  const trimmed = value.trim()
  if (!trimmed.includes('@')) return trimmed
  return trimmed
    .split('@')[0]
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ')
}

function formatEmail(value) {
  const trimmed = value.trim()
  return trimmed.includes('@') ? trimmed : ''
}

const Detail = ({
  label,
  value,
  ltr = false,
  gap = 'gap-[6px]',
  labelClass = 'text-sm font-normal leading-5 text-[#3E3E3B]',
  valueClass = 'text-base font-semibold leading-normal text-[#3E3E3B]',
}) => (
  <div className={cx('flex min-w-0 flex-col', gap)}>
    <span className={labelClass}>{label}</span>
    <span dir={ltr ? 'ltr' : undefined} className={valueClass}>
      {value}
    </span>
  </div>
)

/** Pull the backlink style keys out of the flat style object for LinkedText. */
const linkStyle = (style) => ({
  linkColor: style.linkColor,
  linkHoverColor: style.linkHoverColor,
  linkFontWeight: style.linkFontWeight,
  linkUnderline: style.linkUnderline,
  linkItalic: style.linkItalic,
})

/** Stacked field — label above a filled input box with a placeholder. */
const Field = ({ id, name, label, placeholder, value, onChange, error, dir, autoComplete, style }) => {
  const hasError = Boolean(error)
  return (
    <div className="flex w-full flex-col gap-2">
      <label
        htmlFor={id}
        className={cx(LABEL_SIZE_CLASS, 'm-0', CMS_TEXT_HOVER_CLASS)}
        style={getTextStyleVars(style, 'labelColor', '700', 'medium')}
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type="text"
        dir={dir}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        aria-invalid={hasError}
        className={cx(
          'w-full rounded-lg border-0 p-4 text-sm text-700 placeholder:text-600 focus:outline-none focus:ring-2',
          hasError ? 'ring-1 ring-alert' : 'focus:ring-primary-1',
        )}
        style={{ backgroundColor: colorVar(style.inputBg || '50') }}
      />
      {hasError && typeof error === 'string' && (
        <p className="text-sm text-alert m-0">{error}</p>
      )}
    </div>
  )
}

/**
 * CMS-driven "Continue an existing request" block — a two-column layout with a
 * side photo and a case-tracking form (stacked label + placeholder inputs and a
 * submit button). Every style key falls through to the Figma default when unset.
 * Mirrors flychamadmin cms2's TrackRequest renderer.
 */
const TrackRequest = ({
  title,
  subtitle,
  caseLabel,
  casePlaceholder,
  nameLabel,
  namePlaceholder,
  submitLabel,
  image,
  imageAlt,
  links = [],
  showLinks = true,
  showTitle = true,
  showSubtitle = true,
  showImage = true,
  imagePosition = 'left',
  showSectionBg = false,
  sectionBg = '100',
  sectionPadding = 'default',
  titleAlign = 'left',
  inputBg = '50',
  submitBg = 'primary-1',
  ...rest
}) => {
  const lang = useCurrentLanguage()
  const { t } = useTranslation()
  const required = REQUIRED_TEXT[lang] || REQUIRED_TEXT.en

  const [values, setValues] = useState({ caseNumber: '', lastName: '' })
  const [errors, setErrors] = useState({})
  const [result, setResult] = useState(null)

  const handleChange = (key) => (event) =>
    setValues((prev) => ({ ...prev, [key]: event.target.value }))

  const handleSubmit = (event) => {
    event.preventDefault()
    const next = {}
    if (!values.caseNumber.trim()) next.caseNumber = required
    if (!values.lastName.trim()) next.lastName = required
    setErrors(next)
    if (Object.keys(next).length) return
    setResult({
      caseNumber: formatCaseNumber(values.caseNumber),
      fullName: formatFullName(values.lastName),
      email: formatEmail(values.lastName),
    })
  }

  const style = { showLinks, inputBg, submitBg, ...rest }
  const submitButtonStyle = getButtonStyle(style, {
    bgKey: 'submitBg',
    bgFallback: 'primary-1',
    textKey: 'submitTextColor',
    textFallback: '50',
    weightFallback: 'semibold',
  })
  const alignKey = titleAlign in TITLE_ALIGN_CLASS ? titleAlign : 'left'
  const alignClass = TITLE_ALIGN_CLASS[alignKey]
  const itemsClass = TITLE_ITEMS_CLASS[alignKey]
  const paddingClass = SECTION_PADDING_CLASS[sectionPadding] ?? SECTION_PADDING_CLASS.default

  const showHeader = (showTitle && title) || (showSubtitle && subtitle)
  // The photo comes only from the CMS; with no image URL the column is skipped.
  const imageSrc = image
  const hasImage = showImage && imageSrc

  const imageCol = hasImage ? (
    <div className="relative w-full overflow-hidden rounded-xl md:w-1/2 md:shrink-0">
      <img loading="lazy" decoding="async"
        src={imageSrc}
        alt={imageAlt || ''}
        className="h-full min-h-[240px] w-full object-cover md:min-h-[360px]"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary-1/40 to-transparent"
        aria-hidden
      />
    </div>
  ) : null

  const formCol = (
    <div className="flex w-full flex-col gap-6 md:flex-1">
      {showHeader && (
        <div className={cx('flex flex-col gap-3', alignClass)}>
          {showTitle && title && (
            <h2
              className={cx(TITLE_SIZE_CLASS, 'm-0 font-semibold', CMS_TEXT_HOVER_CLASS)}
              style={getTextStyleVars(style, 'titleColor', '700', 'semibold')}
            >
              <LinkedText text={title} links={links} enabled={showLinks} {...linkStyle(style)} />
            </h2>
          )}
          {showSubtitle && subtitle && (
            <p
              className={cx(SUBTITLE_SIZE_CLASS, 'm-0', CMS_TEXT_HOVER_CLASS)}
              style={getTextStyleVars(style, 'subtitleColor', '700', 'normal')}
            >
              <LinkedText text={subtitle} links={links} enabled={showLinks} {...linkStyle(style)} />
            </p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <Field
          id="track-caseNumber"
          name="caseNumber"
          label={caseLabel}
          placeholder={casePlaceholder}
          dir="ltr"
          autoComplete="off"
          value={values.caseNumber}
          onChange={handleChange('caseNumber')}
          error={errors.caseNumber}
          style={style}
        />
        <Field
          id="track-lastName"
          name="lastName"
          label={nameLabel}
          placeholder={namePlaceholder}
          autoComplete="off"
          value={values.lastName}
          onChange={handleChange('lastName')}
          error={errors.lastName}
          style={style}
        />
        <div className={cx('flex flex-col', itemsClass)}>
          <button
            type="submit"
            className={cx(
              'inline-flex h-[55px] min-w-[186px] items-center justify-center rounded-lg border-none px-6 text-base font-semibold leading-none cursor-pointer',
              submitButtonStyle.className,
            )}
            style={submitButtonStyle.style}
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  )

  const resultCard = result ? (
    <div className="flex w-full flex-col gap-6">
      <div className="flex w-full items-start gap-3 overflow-hidden rounded-lg border border-[#B00300] bg-[#FFF2F0] p-4">
        <img loading="lazy" decoding="async" src={noMatchIcon} alt="" width={24} height={24} />
        <div className="flex min-w-0 flex-1 flex-col gap-2 text-[#3E3E3B]">
          <p className="m-0 text-base font-semibold leading-normal">
            {t('forms.track.result.notFoundTitle')}
          </p>
          <p className="m-0 text-sm font-normal leading-5">
            {t('forms.track.result.notFoundBody')}
          </p>
        </div>
      </div>
      <div className="flex w-full flex-col items-start gap-6 overflow-hidden rounded-xl bg-white p-6">
      <div className="flex w-full items-center justify-between gap-4">
        <div className="px-[25px]">
          <Detail
            label={t('forms.track.result.caseNumber')}
            value={result.caseNumber}
            ltr
            gap="gap-[2px]"
            labelClass="text-sm font-normal leading-[17px] text-[#3E3E3B]"
            valueClass="text-lg font-semibold leading-6 text-[#3E3E3B]"
          />
        </div>
        <span className="inline-flex shrink-0 items-center rounded-full bg-[#F4EFE3] px-3 py-2 text-[13px] font-medium leading-normal text-[#776039]">
          {t('forms.track.result.status')}
        </span>
      </div>
      <dl className="m-0 flex w-full flex-col gap-6 px-[22px] sm:flex-row sm:items-start">
        <div className="min-w-0 flex-1">
          <Detail label={t('forms.track.result.fullName')} value={result.fullName} />
        </div>
        <div className="min-w-0 flex-1">
          <Detail
            label={t('forms.track.result.requestType')}
            value={t('forms.track.result.requestTypeValue')}
            gap="gap-[2px]"
            labelClass="text-sm font-normal leading-[17px] text-[#3E3E3B]"
            valueClass="text-base font-semibold leading-5 text-[#282826]"
          />
        </div>
        <div className="min-w-0 flex-1">
          <Detail label={t('forms.track.result.contactEmail')} value={result.email || '—'} ltr />
        </div>
      </dl>
      <div className="h-px w-full bg-[#E5E5E3]" />
      <div className="flex w-full flex-col items-center gap-10 pt-2.5">
        <div className="grid w-full items-start gap-4 md:grid-cols-[minmax(10rem,1fr)_auto_minmax(10rem,1fr)]">
          <div className="flex flex-col gap-[13px] ps-[21px]">
            <Detail
              label={t('forms.track.result.bookingReference')}
              value={t('forms.track.result.bookingReferenceValue')}
              ltr
              valueClass="text-base font-medium leading-normal text-[#3E3E3B]"
            />
            <Detail
              label={t('forms.track.result.currentStatus')}
              value={t('forms.track.result.status')}
              gap="gap-[2px]"
              labelClass="text-sm font-normal leading-[17px] text-[#3E3E3B]"
              valueClass="text-base font-medium leading-5 text-[#282826]"
            />
          </div>
          <div className="flex w-full max-w-[383px] flex-col gap-4 sm:w-[383px] sm:flex-row">
            <LocalizedLink
              href="/help/contact-us"
              className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-lg bg-[#006080] p-2.5 text-base font-semibold leading-none text-white no-underline sm:flex-1"
            >
              <img loading="lazy" decoding="async" src={phoneIcon} alt="" width={24} height={24} />
              {t('forms.track.result.contactUs')}
            </LocalizedLink>
            <button
              type="button"
              className="inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2.5 rounded-lg border border-[#006080] bg-white p-2.5 text-base font-semibold leading-none text-[#006080] sm:flex-1"
            >
              <img loading="lazy" decoding="async" src={chatDotsIcon} alt="" width={24} height={24} />
              {t('forms.track.result.chatNow')}
            </button>
          </div>
        </div>
        <p className="m-0 flex items-center justify-center">
          <span className="inline-flex items-center gap-1 rounded-[44px] bg-[rgba(83,147,200,0.15)] px-[21px] py-2.5 text-lg font-semibold leading-normal text-[#5393C8]">
            <img loading="lazy" decoding="async" src={checkCircleIcon} alt="" width={24} height={24} />
            {t('forms.track.result.emailed')}
          </span>
        </p>
      </div>
    </div>
    </div>
  ) : null

  return (
    <section
      className={cx(
        'flex flex-col gap-8',
        paddingClass,
        showSectionBg && 'rounded-2xl px-4 md:px-6',
      )}
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-12">
        {imagePosition === 'right' ? (
          <>
            {formCol}
            {imageCol}
          </>
        ) : (
          <>
            {imageCol}
            {formCol}
          </>
        )}
      </div>
      {resultCard}
    </section>
  )
}

export default TrackRequest
