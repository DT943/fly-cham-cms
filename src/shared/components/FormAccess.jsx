import { Ticket, User } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import {
  colorVar,
  getButtonStyle,
  getTextStyleVars,
  CMS_TEXT_HOVER_CLASS,
} from '../../styles/cmsStyle.js'
import { typography } from '../../styles/typography.js'
import useLocalizedRoute from '../routing/hooks/useLocalizedRoute.js'
import { getSupportForm } from '../../pages/forms/utils/supportForms.js'
import useFormAccess from '../../pages/forms/hooks/useFormAccess.js'
import LinkedText from './backlinks/LinkedText.jsx'

const cx = (...parts) => parts.filter(Boolean).join(' ')

const REQUEST_PATH = /^\/help\/contact-us\/forms\/([^/]+)\/request$/

/** Form id from `?form=` on `/help/contact-us/forms/request-a-form`, or the old path. */
function formIdFromRoute(pagePath, search) {
  const fromQuery = new URLSearchParams(search || '').get('form')
  if (fromQuery) return fromQuery
  const fromPath = pagePath.match(REQUEST_PATH)?.[1]
  if (fromPath) return fromPath
  return 'bookingChange'
}

const SECTION_PADDING_CLASS = {
  none: '',
  tight: 'py-4 md:py-6',
  default: 'py-6 md:py-10',
  loose: 'py-10 md:py-16',
}

/** Pull the backlink style keys out of the flat style object for LinkedText. */
const linkStyle = (style) => ({
  linkColor: style.linkColor,
  linkHoverColor: style.linkHoverColor,
  linkFontWeight: style.linkFontWeight,
  linkUnderline: style.linkUnderline,
  linkItalic: style.linkItalic,
})

/** The shared `Input` icon variant, with CMS-driven colors. */
const Field = ({ id, name, icon: Icon, label, hint, error, style, ...props }) => {
  const hasError = Boolean(error)
  return (
    <div className="relative w-full">
      <div
        className={cx(
          'flex items-center gap-3 w-full rounded-lg px-4 py-3 min-h-16',
          hasError && 'ring-1 ring-alert',
        )}
        style={{ backgroundColor: colorVar(style.inputBg) }}
      >
        <Icon
          size={22}
          weight="regular"
          className="shrink-0"
          style={{ color: colorVar(style.iconColor) }}
        />
        <div className="flex-1 min-w-0">
          <label
            htmlFor={id}
            className={cx(typography.caption, 'block m-0', CMS_TEXT_HOVER_CLASS)}
            style={getTextStyleVars(style, 'labelColor', '800', 'medium')}
          >
            {label}
          </label>
          <input
            id={id}
            name={name}
            type="text"
            placeholder={hint || ' '}
            aria-invalid={hasError}
            className={`block w-full bg-transparent border-0 p-0 ${typography.caption} text-800 placeholder:text-500 focus:outline-none focus:ring-0`}
            {...props}
          />
        </div>
      </div>
      {hasError && typeof error === 'string' && (
        <p className={`${typography.caption} text-alert m-0 mt-1`}>{error}</p>
      )}
    </div>
  )
}

/**
 * CMS-driven "Find your booking" card of the request-a-form page
 * (`/help/contact-us/forms/request-a-form?form=<formId>`). The stage label and
 * title come from that form; the copy, labels and colors come from the CMS.
 * Submitting validates PNR + last name and opens that form's detail page.
 * Mirrors flychamadmin cms2's FormAccess renderer.
 */
const FormAccess = ({
  subtitle,
  pnrLabel,
  pnrHint,
  lastNameLabel,
  submitLabel,
  links = [],
  showLinks = true,
  showEyebrow = true,
  showTitle = true,
  showSubtitle = true,
  showSectionBg = false,
  sectionBg = '100',
  sectionPadding = 'none',
  cardBg = 'background',
  inputBg = '100',
  iconColor = '800',
  ...rest
}) => {
  const { t } = useTranslation()
  const { pagePath, search } = useLocalizedRoute()
  const form = getSupportForm(formIdFromRoute(pagePath, search))
  const { formik, handlePnrChange, handleLastNameChange, fieldError, canSearch } =
    useFormAccess(form?.id)

  if (!form) return null

  const style = { showLinks, inputBg, iconColor, ...rest }
  const submitButtonStyle = getButtonStyle(style, {
    bgKey: 'submitBg',
    bgFallback: 'secondary',
    bgHoverFallback: 'secondary-800',
    textKey: 'submitTextColor',
    textFallback: 'btn',
    weightFallback: 'semibold',
  })
  const paddingClass = SECTION_PADDING_CLASS[sectionPadding] ?? SECTION_PADDING_CLASS.none

  return (
    <section
      className={cx(paddingClass, showSectionBg && 'rounded-2xl px-4 md:px-6')}
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      <div
        className="rounded-2xl border border-200/80 shadow-[0_8px_24px_rgba(0,0,0,0.06)] px-5 py-6 sm:px-8 md:px-10 md:py-8 flex flex-col gap-5 md:gap-6"
        style={{ backgroundColor: colorVar(cardBg) }}
      >
        <div className="flex flex-col gap-2">
          {showEyebrow && (
            <p
              className={cx(typography.caption, 'm-0', CMS_TEXT_HOVER_CLASS)}
              style={getTextStyleVars(style, 'eyebrowColor', 'primary-1', 'medium')}
            >
              {t(`forms.filters.${form.stageId}`)}
            </p>
          )}
          {showTitle && (
            <h2
              className={cx(typography.sectionTitle, 'm-0', CMS_TEXT_HOVER_CLASS)}
              style={getTextStyleVars(style, 'titleColor', '800', 'bold')}
            >
              {t(`forms.items.${form.id}.title`)}
            </h2>
          )}
          {showSubtitle && subtitle && (
            <p
              className={cx(typography.itemDescription, 'm-0', CMS_TEXT_HOVER_CLASS)}
              style={getTextStyleVars(style, 'subtitleColor', '600', 'normal')}
            >
              <LinkedText text={subtitle} links={links} enabled={showLinks} {...linkStyle(style)} />
            </p>
          )}
        </div>

        <form onSubmit={formik.handleSubmit} noValidate className="flex flex-col gap-4 md:gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <Field
              id="form-access-pnr"
              name="pnr"
              icon={Ticket}
              label={pnrLabel}
              hint={pnrHint}
              dir="ltr"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck="false"
              maxLength={6}
              autoFocus
              value={formik.values.pnr}
              onChange={handlePnrChange}
              onBlur={formik.handleBlur}
              error={fieldError('pnr')}
              style={style}
            />
            <Field
              id="form-access-last-name"
              name="lastName"
              icon={User}
              label={lastNameLabel}
              autoComplete="family-name"
              autoCapitalize="characters"
              spellCheck="false"
              dir="ltr"
              value={formik.values.lastName}
              onChange={handleLastNameChange}
              onBlur={formik.handleBlur}
              error={fieldError('lastName')}
              style={style}
            />
          </div>
          <button
            type="submit"
            disabled={!canSearch}
            className={cx(
              typography.button,
              'rounded-lg border-none px-6 py-3 md:px-8 md:py-4 w-full sm:w-fit sm:self-end transition-colors',
              canSearch ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed',
              submitButtonStyle.className,
            )}
            style={submitButtonStyle.style}
          >
            {submitLabel}
          </button>
        </form>
      </div>
    </section>
  )
}

export default FormAccess
