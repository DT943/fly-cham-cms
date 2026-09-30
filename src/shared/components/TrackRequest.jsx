import { useState } from 'react'
import {
  colorVar,
  getButtonStyle,
  getTextStyleVars,
  CMS_TEXT_HOVER_CLASS,
} from '../../styles/cmsStyle.js'
import useCurrentLanguage from '../hooks/useCurrentLanguage.js'
import LinkedText from './backlinks/LinkedText.jsx'

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
  default: 'py-6 md:py-10',
  loose: 'py-10 md:py-16',
}

const REQUIRED_TEXT = {
  en: 'This field is required',
  ar: 'هذا الحقل مطلوب',
}

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
  const required = REQUIRED_TEXT[lang] || REQUIRED_TEXT.en

  const [values, setValues] = useState({ caseNumber: '', lastName: '' })
  const [errors, setErrors] = useState({})

  const handleChange = (key) => (event) =>
    setValues((prev) => ({ ...prev, [key]: event.target.value }))

  const handleSubmit = (event) => {
    event.preventDefault()
    const next = {}
    if (!values.caseNumber.trim()) next.caseNumber = required
    if (!values.lastName.trim()) next.lastName = required
    setErrors(next)
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
      <img
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

  return (
    <section
      className={cx(
        'flex flex-col gap-8 md:flex-row md:items-center md:gap-12',
        paddingClass,
        showSectionBg && 'rounded-2xl px-4 md:px-6',
      )}
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
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
    </section>
  )
}

export default TrackRequest
