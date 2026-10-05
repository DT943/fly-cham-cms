import { useMemo, useState } from 'react'
import { CaretDown } from '@phosphor-icons/react'
import {
  CMS_TEXT_HOVER_CLASS,
  colorVar,
  getButtonStyle,
  getTextStyleVars,
} from '../../styles/cmsStyle.js'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'

const BUTTON = {
  bgKey: 'buttonBg',
  bgFallback: 'secondary',
  bgHoverFallback: 'secondary-800',
  textKey: 'buttonText',
  textFallback: '700',
  weightFallback: 'semibold',
}

const optionId = (item, index, prefix) => item?.id || `${prefix}-${index}`

const Radio = ({ name, checked, onChange, label }) => (
  <label className="inline-flex cursor-pointer items-center gap-1.5 text-sm text-700">
    <input
      type="radio"
      name={name}
      checked={checked}
      onChange={onChange}
      className="size-5 accent-primary-1"
    />
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
      className="flex w-full flex-col gap-5 rounded-xl bg-white p-6 md:p-8"
      style={{ backgroundColor: colorVar(cardBg) }}
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="flex flex-col gap-4">
        {title ? (
          <h2
            className={`m-0 text-[22px] leading-snug md:text-[28px] ${CMS_TEXT_HOVER_CLASS}`}
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
            className={`m-0 text-base leading-normal ${CMS_TEXT_HOVER_CLASS}`}
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

      <div className="flex flex-col items-stretch gap-8 lg:flex-row lg:gap-16">
        {image ? (
          <img
            src={image}
            alt={imageAlt}
            className="h-72 w-full rounded-xl object-cover sm:h-96 lg:h-auto lg:min-h-[520px] lg:w-[46%] lg:shrink-0"
          />
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col gap-5">
          {titleOptions.length ? (
            <div className="flex flex-wrap items-center gap-4">
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

          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              name="firstName"
              autoComplete="given-name"
              placeholder={firstNameLabel}
              aria-label={firstNameLabel}
              className="h-12 min-w-0 flex-1 rounded-lg border-0 bg-100 px-3.5 text-sm font-medium text-700 outline-none placeholder:font-medium placeholder:text-600"
            />
            <input
              type="text"
              name="lastName"
              autoComplete="family-name"
              placeholder={lastNameLabel}
              aria-label={lastNameLabel}
              className="h-12 min-w-0 flex-1 rounded-lg border-0 bg-100 px-3.5 text-sm font-medium text-700 outline-none placeholder:font-medium placeholder:text-600"
            />
          </div>

          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            placeholder={emailLabel}
            aria-label={emailLabel}
            className="h-12 w-full rounded-lg border-0 bg-100 px-3.5 text-sm font-medium text-700 outline-none placeholder:font-medium placeholder:text-600"
          />

          <div className="relative">
            <select
              name="destination"
              aria-label={destinationLabel}
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              className={`h-12 w-full appearance-none rounded-lg border-0 bg-100 px-3.5 pe-10 text-sm font-medium outline-none ${destination ? 'text-700' : 'text-600'}`}
            >
              <option value="">{destinationLabel}</option>
              {destinations.map((item, index) => (
                <option key={optionId(item, index, 'dest')} value={item.label}>
                  {item.label}
                </option>
              ))}
            </select>
            <CaretDown
              size={16}
              className="pointer-events-none absolute end-3.5 top-1/2 -translate-y-1/2 text-600"
              aria-hidden
            />
          </div>

          {preferenceOptions.length ? (
            <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
              {preferencesLabel ? (
                <legend
                  className={`text-sm ${CMS_TEXT_HOVER_CLASS}`}
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
              <div className="grid grid-cols-1 gap-x-16 gap-y-4 sm:grid-cols-2">
                {preferenceOptions.map((item) => (
                  <label key={item.id} className="inline-flex cursor-pointer items-center gap-3 text-sm text-700">
                    <input
                      type="checkbox"
                      name="preferences"
                      value={item.id}
                      checked={Boolean(checked[item.id])}
                      onChange={() => togglePreference(item.id)}
                      className="size-5 shrink-0 rounded accent-primary-1"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ) : null}

          {languageOptions.length ? (
            <div className="flex h-auto min-h-12 flex-col justify-center gap-3 rounded-lg border border-200 px-3.5 py-2 sm:flex-row sm:items-center sm:justify-between">
              {languageLabel ? (
                <span className="text-xs text-700">{languageLabel}</span>
              ) : null}
              <div className="flex flex-wrap items-center gap-6">
                {languageOptions.map((item) => (
                  <Radio
                    key={item.id}
                    name="newsletter-language"
                    label={item.label}
                    checked={languageValue === item.id}
                    onChange={() => setLanguageValue(item.id)}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {(consentBefore || privacyLabel || consentAfter) && (
            <p
              className={`m-0 text-sm leading-normal ${CMS_TEXT_HOVER_CLASS}`}
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
