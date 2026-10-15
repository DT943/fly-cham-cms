import { useEffect, useMemo, useState } from 'react'
import { CaretDown } from '@phosphor-icons/react'
import {
  CMS_TEXT_HOVER_CLASS,
  colorVar,
  getButtonStyle,
  getTextStyleVars,
} from '../../styles/cmsStyle.js'
import { resolvePhosphorIcon } from '../../cms/adapters/phosphorIcons.js'
import Dropdown from './Dropdown.jsx'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'
import useBaggageQuery from '../hooks/useBaggageQuery.js'

// Keep these class maps byte-identical with the cms2 BaggageCalculator block.
const SECTION_PADDING = {
  none: '',
  tight: 'py-4 md:py-6',
  default: '',
  loose: 'py-10 md:py-16',
}
// Page gap (gap-8 md:gap-[60px]) + Figma overlap (71px mobile / 91px desktop).
const OVERLAP_CLASS = 'relative z-[2] -mt-[103px] md:-mt-[151px]'

// Pinned px sizes from Figma 40814:21956 (desktop) / 40814:22113 (mobile).
const CARD_CLASS =
  'flex flex-col gap-4 rounded-xl px-[13px] pb-8 pt-5 md:gap-6 md:rounded-[17px] md:px-[54px] md:pb-11 md:pt-10'
const CARD_SHADOW =
  'shadow-[0px_0px_0.865px_0px_rgba(33,37,41,0.32),0px_3.461px_5.192px_0px_rgba(33,37,41,0.2)]'
const INTRO_SIZE = 'text-xs leading-[normal] md:px-0.5 md:text-base'
const FIELD_CLASS =
  'relative flex h-[55px] items-center justify-between gap-3 overflow-hidden rounded-lg !border-0 px-3 py-1 md:h-[70px]'
const LABEL_SIZE = 'text-[10px] leading-[normal] md:text-xs'
const VALUE_SIZE = 'text-sm leading-5 md:text-base'
const NOTE_SIZE = 'text-xs leading-5 md:text-sm md:leading-[22px]'
const BUTTON_CLASS =
  'flex h-[49px] w-full shrink-0 items-center justify-center gap-2.5 rounded-lg px-2.5 py-3 text-base leading-[normal] transition-colors md:w-[185px]'

const BUTTON_OPTS = {
  bgKey: 'buttonBg',
  bgFallback: 'primary-1',
  bgHoverFallback: 'primary-800',
  textKey: 'buttonText',
  textFallback: '50',
  weightFallback: 'semibold',
}

const cx = (...parts) => parts.filter(Boolean).join(' ')

/** `href?from=…&to=…&class=…&tier=…` (empty values skipped). */
function buildCalculateHref(href, values) {
  const base = String(href || '').trim()
  if (!base) return ''
  const params = new URLSearchParams()
  Object.entries(values).forEach(([key, value]) => {
    if (value) params.set(key, value)
  })
  const query = params.toString()
  if (!query) return base
  // Keep a #hash (e.g. #results) after the query string.
  const [path, hash] = base.split('#')
  const joined = `${path}${path.includes('?') ? '&' : '?'}${query}`
  return hash ? `${joined}#${hash}` : joined
}

/** Figma field (label over value + caret) opening the shared dropdown menu. */
function CalculatorSelect({ id, label, placeholder, options, value, onChange, textStyle, fieldBg, iconColor }) {
  return (
    <Dropdown
      id={id}
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      options={options}
      buttonClassName={FIELD_CLASS}
      buttonStyle={{ backgroundColor: colorVar(fieldBg) }}
      renderButton={({ selected }) => (
        <>
          <span className="flex min-w-0 flex-col gap-1 text-start">
            <span
              className={cx(LABEL_SIZE, CMS_TEXT_HOVER_CLASS)}
              style={getTextStyleVars(textStyle, 'labelColor', '700', 'normal')}
            >
              {label}
            </span>
            <span
              className={cx('truncate', VALUE_SIZE, CMS_TEXT_HOVER_CLASS)}
              style={
                selected
                  ? getTextStyleVars(textStyle, 'valueColor', '700', 'medium')
                  : getTextStyleVars(textStyle, 'placeholderColor', '600', 'normal')
              }
            >
              {selected ? selected.label : placeholder}
            </span>
          </span>
          <CaretDown size={16} aria-hidden className="shrink-0" style={{ color: colorVar(iconColor) }} />
        </>
      )}
    />
  )
}

/**
 * CMS-driven Baggage Calculator form card (Figma 40814:21956 / 40814:22113).
 * Mirrors the cms2 BaggageCalculator block: Calculate stays disabled until every
 * field is chosen, then links to `buttonHref?from=&to=&class=&tier=`.
 */
const BaggageCalculator = ({
  intro = '',
  fromLabel = '',
  toLabel = '',
  classLabel = '',
  tierLabel = '',
  fromPlaceholder = '',
  toPlaceholder = '',
  classPlaceholder = '',
  tierPlaceholder = '',
  defaultFrom = '',
  defaultTo = '',
  defaultClass = '',
  defaultTier = '',
  airports = [],
  classes = [],
  tiers = [],
  buttonLabel = '',
  buttonIcon = '',
  buttonHref = '',
  noteText = '',
  noteLinkLabel = '',
  noteLinkHref = '',
  overlapHero = true,
  sectionPadding = 'none',
  showSectionBg = false,
  sectionBg = '100',
  cardBg = 'background',
  showCardShadow = true,
  showIntro = true,
  showTier = true,
  showNote = true,
  fieldBg = '100',
  iconColor = '700',
  showButtonIcon = true,
  disabledBg = '300',
  disabledText = '500',
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
  ...textStyle
}) => {
  // After Calculate the page reloads with the choices in the URL — keep them.
  const query = useBaggageQuery()
  const defaults = useMemo(
    () => ({
      from: query.from || defaultFrom,
      to: query.to || defaultTo,
      class: query.class || defaultClass,
      tier: query.tier || defaultTier,
    }),
    [query.from, query.to, query.class, query.tier, defaultFrom, defaultTo, defaultClass, defaultTier],
  )
  const [values, setValues] = useState(defaults)
  useEffect(() => setValues(defaults), [defaults])

  if (!intro && !airports.length && !buttonLabel) return null

  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }
  const withTier = showTier !== false
  const ready =
    Boolean(values.from && values.to && values.class) &&
    values.from !== values.to &&
    (!withTier || Boolean(values.tier))
  const href = ready
    ? buildCalculateHref(buttonHref, {
        from: values.from,
        to: values.to,
        class: values.class,
        tier: withTier ? values.tier : '',
      })
    : ''
  const btn = getButtonStyle(textStyle, BUTTON_OPTS)
  const ButtonIcon = showButtonIcon !== false ? resolvePhosphorIcon(buttonIcon || 'Calculator') : null
  const set = (key) => (value) => setValues((prev) => ({ ...prev, [key]: value }))
  const fieldProps = { textStyle, fieldBg, iconColor }

  const buttonInner = (
    <>
      {ButtonIcon ? <ButtonIcon size={24} aria-hidden className="shrink-0" /> : null}
      <span>{buttonLabel}</span>
    </>
  )

  return (
    <div
      className={cx(overlapHero ? OVERLAP_CLASS : '', SECTION_PADDING[sectionPadding] || '')}
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      <div
        className={cx(CARD_CLASS, showCardShadow !== false ? CARD_SHADOW : '')}
        style={{ backgroundColor: colorVar(cardBg) }}
      >
        {showIntro !== false && intro ? (
          <p
            className={cx('m-0', INTRO_SIZE, CMS_TEXT_HOVER_CLASS)}
            style={getTextStyleVars(textStyle, 'titleColor', '700', 'normal')}
          >
            <LinkedText text={intro} {...linkProps} />
          </p>
        ) : null}

        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 md:gap-4">
          <CalculatorSelect
            id="bc-from"
            label={fromLabel}
            placeholder={fromPlaceholder}
            options={airports}
            value={values.from || ''}
            onChange={set('from')}
            {...fieldProps}
          />
          <CalculatorSelect
            id="bc-to"
            label={toLabel}
            placeholder={toPlaceholder}
            options={airports}
            value={values.to || ''}
            onChange={set('to')}
            {...fieldProps}
          />
          <CalculatorSelect
            id="bc-class"
            label={classLabel}
            placeholder={classPlaceholder}
            options={classes}
            value={values.class || ''}
            onChange={set('class')}
            {...fieldProps}
          />
          {withTier ? (
            <CalculatorSelect
              id="bc-tier"
              label={tierLabel}
              placeholder={tierPlaceholder}
              options={tiers}
              value={values.tier || ''}
              onChange={set('tier')}
              {...fieldProps}
            />
          ) : null}
        </div>

        <div className="flex flex-col-reverse gap-4 md:flex-row md:items-start md:justify-between md:gap-6">
          {showNote !== false && (noteText || noteLinkLabel) ? (
            <p
              className={cx('m-0 max-w-[420px]', NOTE_SIZE, CMS_TEXT_HOVER_CLASS)}
              style={getTextStyleVars(textStyle, 'noteColor', '700', 'normal')}
            >
              {noteText ? <LinkedText text={`${noteText} `} {...linkProps} /> : null}
              {noteLinkLabel ? (
                <LocalizedLink
                  href={noteLinkHref || '#'}
                  className={cx('underline', CMS_TEXT_HOVER_CLASS)}
                  style={getTextStyleVars(textStyle, 'ctaColor', 'primary-1', 'medium')}
                >
                  {noteLinkLabel}
                </LocalizedLink>
              ) : null}
            </p>
          ) : (
            <span />
          )}
          {buttonLabel ? (
            ready ? (
              <LocalizedLink
                href={href || '#'}
                className={cx(BUTTON_CLASS, 'no-underline', btn.className)}
                style={btn.style}
              >
                {buttonInner}
              </LocalizedLink>
            ) : (
              <button
                type="button"
                disabled
                className={cx(BUTTON_CLASS, 'cursor-not-allowed font-semibold')}
                style={{ backgroundColor: colorVar(disabledBg), color: colorVar(disabledText) }}
              >
                {buttonInner}
              </button>
            )
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default BaggageCalculator
