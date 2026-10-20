import { useMemo, useState } from 'react'
import Dropdown from './Dropdown.jsx'
import {
  CMS_TEXT_HOVER_CLASS,
  colorVar,
  getButtonStyle,
  getTextStyleVars,
} from '../../styles/cmsStyle.js'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'
import { trackNewsletterAttempt } from '../analytics/cmsEvents.js'
import useCurrentLanguage from '../hooks/useCurrentLanguage.js'

const BUTTON = {
  bgKey: 'buttonBg',
  bgFallback: 'secondary',
  bgHoverFallback: 'secondary-800',
  textKey: 'buttonText',
  textFallback: '700',
  weightFallback: 'semibold',
}

const optionId = (item, index, prefix) => item?.id || `${prefix}-${index}`

const Radio = ({ name, checked, onChange, label, size = 'size-6', labelClass = 'text-sm leading-6' }) => (
  <label className={`inline-flex cursor-pointer items-center gap-1 font-normal text-700 ${labelClass}`}>
    <span className={`relative grid ${size} shrink-0 place-items-center`}>
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className={`absolute inset-0 m-0 cursor-pointer appearance-none rounded-full border-2 bg-white ${
          checked ? 'border-primary-1' : 'border-[#d2d5da]'
        }`}
      />
      <span
        aria-hidden
        className={`pointer-events-none relative z-[1] rounded-full bg-primary-1 ${
          size === 'size-5' ? 'size-2.5' : 'size-3'
        } ${checked ? '' : 'hidden'}`}
      />
    </span>
    <span>{label}</span>
  </label>
)

/**
 * Newsletter subscription card: crew photo beside the subscriber form.
 * Presentational aside from local field state — there is no submit API.
 */
const NewsletterForm = ({
  title = '',
  description = '',
  image = '',
  imageAlt = '',
  titles = [],
  firstNameLabel = '',
  lastNameLabel = '',
  emailLabel = '',
  destinationLabel = '',
  destinations = [],
  preferencesLabel = '',
  preferences = [],
  languageLabel = '',
  languages = [],
  consentBefore = '',
  privacyLabel = '',
  consentAfter = '',
  privacyHref = '/legal/privacy-policy',
  submitLabel = '',
  cardBg = '50',
  titleColor = '700',
  titleFontWeight = 'semibold',
  titleColorHover,
  titleFontWeightHover,
  descriptionColor = '800',
  descriptionFontWeight = 'normal',
  descriptionColorHover,
  descriptionFontWeightHover,
  labelColor = '700',
  labelFontWeight = 'semibold',
  labelColorHover,
  labelFontWeightHover,
  bodyColor = '700',
  bodyFontWeight = 'normal',
  bodyColorHover,
  bodyFontWeightHover,
  linkColor = 'primary-1',
  linkFontWeight = 'semibold',
  linkColorHover,
  linkFontWeightHover,
  buttonBg = 'secondary',
  buttonBgHover,
  buttonText = '700',
  buttonTextFontWeight = 'semibold',
  buttonTextHover,
  buttonTextFontWeightHover,
  links = [],
  showLinks = true,
  linkUnderline,
  linkItalic,
}) => {
  const titleOptions = useMemo(
    () => titles.map((item, index) => ({ ...item, id: optionId(item, index, 'title') })),
    [titles],
  )
  const languageOptions = useMemo(
    () => languages.map((item, index) => ({ ...item, id: optionId(item, index, 'lang') })),
    [languages],
  )
  const preferenceOptions = useMemo(
    () => preferences.map((item, index) => ({ ...item, id: optionId(item, index, 'pref') })),
    [preferences],
  )

  const [titleValue, setTitleValue] = useState(
    () => titleOptions.find((item) => item.selected)?.id || titleOptions[0]?.id || '',
  )
  const [languageValue, setLanguageValue] = useState(
    () => languageOptions.find((item) => item.selected)?.id || languageOptions[0]?.id || '',
  )
  const [checked, setChecked] = useState({})
  const language = useCurrentLanguage()
  const anyLabel = language === 'ar' ? 'أي' : 'Any'
  const [destination, setDestination] = useState('')

  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor: linkColorHover,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }
  const btn = getButtonStyle(
    { buttonBg, buttonBgHover, buttonText, buttonTextFontWeight, buttonTextHover, buttonTextFontWeightHover },
    BUTTON,
  )

  const togglePreference = (id) => {
    setChecked((current) => {
      const next = { ...current, [id]: !current[id] }
      if (id === 'all') {
        preferenceOptions.forEach((item) => {
          next[item.id] = next.all
        })
      } else if (!next[id]) {
        next.all = false
      } else if (preferenceOptions.filter((item) => item.id !== 'all').every((item) => next[item.id])) {
        next.all = true
      }
      return next
    })
  }

  return (
    <form
      className="flex w-full min-w-0 flex-col gap-[19px] overflow-x-clip rounded-xl bg-white p-6 md:p-[33px]"
      style={{ backgroundColor: colorVar(cardBg) }}
      onSubmit={(event) => {
        event.preventDefault()
        trackNewsletterAttempt({ formLocation: 'newsletter_form', formId: 'newsletter-form' })
      }}
    >
      <div className="flex flex-col gap-4">
        {title ? (
          <h2
            className={`m-0 text-[22px] leading-[1.5] md:text-[28px] ${CMS_TEXT_HOVER_CLASS}`}
            style={getTextStyleVars(
              { titleColor, titleFontWeight, titleColorHover, titleFontWeightHover },
              'titleColor',
              '700',
              'semibold',
            )}
          >
            <LinkedText text={title} {...linkProps} />
          </h2>
        ) : null}
        {description ? (
          <p
            className={`m-0 text-base leading-[1.5] ${CMS_TEXT_HOVER_CLASS}`}
            style={getTextStyleVars(
              { descriptionColor, descriptionFontWeight, descriptionColorHover, descriptionFontWeightHover },
              'descriptionColor',
              '800',
              'normal',
            )}
          >
            <LinkedText text={description} {...linkProps} />
          </p>
        ) : null}
      </div>

      <div className="flex min-w-0 flex-col items-stretch gap-8 lg:flex-row lg:items-start lg:gap-[89px]">
        {image ? (
          <img
            src={image}
            alt={imageAlt}
            className="aspect-[537/583] w-full min-w-0 rounded-xl object-cover lg:h-[583px] lg:w-[min(537px,46%)] lg:shrink"
          />
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col gap-[19px]">
          {titleOptions.length ? (
            <div className="flex flex-wrap items-center gap-2">
              {titleOptions.map((item) => (
                <Radio
                  key={item.id}
                  name="newsletter-title"
                  label={item.label}
                  checked={titleValue === item.id}
                  onChange={() => setTitleValue(item.id)}
                />
              ))}
            </div>
          ) : null}

          <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
            <input
              type="text"
              name="firstName"
              autoComplete="given-name"
              placeholder={firstNameLabel}
              aria-label={firstNameLabel}
              className="h-12 min-w-0 flex-1 rounded-lg border-0 bg-100 px-3.5 text-sm font-medium text-700 outline-none placeholder:font-medium placeholder:text-600 focus:outline-none focus:ring-0"
            />
            <input
              type="text"
              name="lastName"
              autoComplete="family-name"
              placeholder={lastNameLabel}
              aria-label={lastNameLabel}
              className="h-12 min-w-0 flex-1 rounded-lg border-0 bg-100 px-3.5 text-sm font-medium text-700 outline-none placeholder:font-medium placeholder:text-600 focus:outline-none focus:ring-0"
            />
          </div>

          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            placeholder={emailLabel}
            aria-label={emailLabel}
            className="h-12 w-full rounded-lg border-0 bg-100 px-3.5 text-sm font-medium text-700 outline-none placeholder:font-medium placeholder:text-600 focus:outline-none focus:ring-0"
          />

          <Dropdown
            name="destination"
            label={destinationLabel}
            value={destination}
            onChange={setDestination}
            placeholder={destinationLabel}
            options={[
              { value: 'any', label: anyLabel },
              ...destinations
                .filter((item) => String(item.label || '').trim().toLowerCase() !== anyLabel.toLowerCase())
                .map((item) => ({ value: item.label, label: item.label })),
            ]}
          />

          {preferenceOptions.length ? (
            <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
              {preferencesLabel ? (
                <legend
                  className={`mb-4 block text-sm ${CMS_TEXT_HOVER_CLASS}`}
                  style={getTextStyleVars(
                    { labelColor, labelFontWeight, labelColorHover, labelFontWeightHover },
                    'labelColor',
                    '700',
                    'semibold',
                  )}
                >
                  {preferencesLabel}
                </legend>
              ) : null}
              <div className="flex flex-col gap-[27px]">
                {preferenceOptions.map((item) => (
                  <label key={item.id} className="inline-flex cursor-pointer items-center gap-3 text-sm font-normal text-700">
                    <input
                      type="checkbox"
                      name="preferences"
                      value={item.id}
                      checked={Boolean(checked[item.id])}
                      onChange={() => togglePreference(item.id)}
                      className="size-5 shrink-0 appearance-none rounded border border-[#d2d5da] bg-white bg-center bg-no-repeat checked:border-primary-1 checked:bg-primary-1 checked:bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M3.5%208.5%206.5%2011.5%2012.5%204.5%22%20stroke%3D%22white%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')]"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ) : null}

          {languageOptions.length ? (
            <div className="flex h-12 min-w-0 items-center justify-between gap-3 rounded-lg border border-200 py-0 ps-[13px] pe-[18px]">
              {languageLabel ? (
                <span className="shrink-0 text-xs font-normal text-700">{languageLabel}</span>
              ) : null}
              <div className="flex shrink-0 items-center gap-6">
                {languageOptions.map((item) => (
                  <Radio
                    key={item.id}
                    name="newsletter-language"
                    label={item.label}
                    size="size-5"
                    labelClass="text-base leading-normal"
                    checked={languageValue === item.id}
                    onChange={() => setLanguageValue(item.id)}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {(consentBefore || privacyLabel || consentAfter) && (
            <p
              className={`m-0 text-sm leading-[1.5] ${CMS_TEXT_HOVER_CLASS}`}
              style={getTextStyleVars(
                { bodyColor, bodyFontWeight, bodyColorHover, bodyFontWeightHover },
                'bodyColor',
                '700',
                'normal',
              )}
            >
              {consentBefore}
              {privacyLabel ? (
                <LocalizedLink
                  href={privacyHref || '/legal/privacy-policy'}
                  className={`no-underline hover:!no-underline ${CMS_TEXT_HOVER_CLASS}`}
                  style={getTextStyleVars(
                    { linkColor, linkFontWeight, linkColorHover, linkFontWeightHover },
                    'linkColor',
                    'primary-1',
                    'semibold',
                  )}
                >
                  {privacyLabel}
                </LocalizedLink>
              ) : null}
              {consentAfter}
            </p>
          )}
        </div>
      </div>

      {submitLabel ? (
        <>
          <div className="h-px w-full bg-200" />
          <div className="flex justify-end">
            <button
              type="submit"
              className={`inline-flex h-12 w-40 items-center justify-center rounded-lg border-0 px-4 text-sm ${btn.className}`}
              style={btn.style}
            >
              {submitLabel}
            </button>
          </div>
        </>
      ) : null}
    </form>
  )
}

export default NewsletterForm
