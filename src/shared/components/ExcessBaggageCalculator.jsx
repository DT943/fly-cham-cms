import { useEffect, useMemo, useRef, useState } from 'react'
import { CaretDown } from '@phosphor-icons/react'
import {
  CMS_TEXT_HOVER_CLASS,
  colorVar,
  getButtonStyle,
  getTextStyleVars,
} from '../../styles/cmsStyle.js'
import { resolvePhosphorIcon } from '../../cms/adapters/phosphorIcons.js'
import { getBaggageQuote } from '../../cms/api/getBaggageQuote.js'
import { posName, usePosList } from '../pos/posList.js'
import Dropdown from './Dropdown.jsx'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'

// Keep these class maps byte-identical with the cms2 ExcessBaggageCalculator block.
const SECTION_PADDING = {
  none: '',
  tight: 'py-4 md:py-6',
  default: '',
  loose: 'py-10 md:py-16',
}

const TITLE_SIZE = 'text-[28px] leading-[1.2] md:text-[48px]'
const SUBTITLE_SIZE = 'text-sm leading-normal no-underline md:text-base'
// Below md the card runs edge to edge: the negative margins cancel the page
// Container's gutter (px-4 sm:px-8) and the padding keeps the fields on it.
const CARD_CLASS =
  'flex flex-col gap-5 -mx-4 rounded-none px-4 py-5 sm:-mx-8 sm:px-8 md:mx-0 md:gap-6 md:rounded-xl md:px-6 md:pb-8 md:pt-7'
const CARD_BORDER_CLASS = 'border-y border-solid md:border-x'
const CARD_SHADOW =
  'shadow-[0px_0px_0.865px_0px_rgba(33,37,41,0.32),0px_3.461px_5.192px_0px_rgba(33,37,41,0.2)]'
const FORM_GRID =
  'grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_160px_192px] lg:items-end lg:gap-6'
const LABEL_SIZE = 'text-sm leading-normal md:text-base'
const FIELD_CLASS =
  'h-12 rounded-lg px-4 py-0 md:h-14 md:px-5'
const VALUE_SIZE = 'text-base leading-6 md:text-lg'
const BUTTON_CLASS =
  'flex h-12 w-full items-center justify-center gap-2.5 rounded-lg px-4 text-base leading-normal transition-colors md:h-14 md:text-lg'
const RESULT_LABEL_SIZE = 'text-base leading-normal md:text-lg'
const PRICE_SIZE = 'text-2xl leading-tight md:text-4xl'
const LINK_SIZE = 'text-base leading-normal md:text-lg'

const BUTTON_OPTS = {
  bgKey: 'buttonBg',
  bgFallback: 'primary-1',
  bgHoverFallback: 'primary-800',
  textKey: 'buttonText',
  textFallback: '50',
  weightFallback: 'semibold',
}

const cx = (...parts) => parts.filter(Boolean).join(' ')

/** `1025` → `"1,025.00"` (Latin digits, always 2 decimals). */
const formatPrice = (amount) =>
  new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
    amount,
  )

/** Nearest scrolling ancestor, or the page itself. */
function scrollParentOf(el) {
  for (let node = el?.parentElement; node; node = node.parentElement) {
    const { overflowY } = getComputedStyle(node)
    if (/(auto|scroll)/.test(overflowY) && node.scrollHeight > node.clientHeight) return node
  }
  return null
}

/**
 * Like the booking widget: when a field's menu opens but isn't fully on
 * screen, scroll so the calculator (title/subtitle down to the open menu) sits
 * centred in the space under the sticky header — not pinned to the very top.
 * If it can't all fit, show the whole menu without hiding the field.
 */
function scrollMenuIntoView(field) {
  const menu = field?.querySelector('[role="listbox"]')?.parentElement
  if (!field || !menu) return
  const scroller = scrollParentOf(field)
  const box = scroller ? scroller.getBoundingClientRect() : { top: 0, bottom: window.innerHeight }
  const header = [...document.querySelectorAll('header')].find((el) =>
    ['sticky', 'fixed'].includes(getComputedStyle(el).position),
  )
  const viewTop = Math.max(box.top, header?.getBoundingClientRect().bottom || 0) + 16
  const viewBottom = Math.min(box.bottom, window.innerHeight) - 16
  const fieldTop = field.getBoundingClientRect().top
  const menuBottom = menu.getBoundingClientRect().bottom
  if (fieldTop >= viewTop && menuBottom <= viewBottom) return

  const regionTop = (field.closest('[data-excess-baggage]') || field).getBoundingClientRect().top
  let delta
  if (menuBottom - regionTop <= viewBottom - viewTop) {
    delta = (regionTop + menuBottom) / 2 - (viewTop + viewBottom) / 2
  } else {
    delta = Math.min(menuBottom - viewBottom, fieldTop - viewTop)
  }
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  ;(scroller || window).scrollBy({ top: delta, behavior: reduce ? 'auto' : 'smooth' })
}

/** Rendered inside the dropdown trigger: scrolls when its menu opens. */
function ScrollOnOpen({ open, fieldRef }) {
  useEffect(() => {
    if (!open) return undefined
    // After the dropdown has scrolled its selected row into view.
    const timer = setTimeout(() => scrollMenuIntoView(fieldRef.current), 60)
    return () => clearTimeout(timer)
  }, [open, fieldRef])
  return null
}

/** Visible label over the shared dropdown (field: value + caret). */
function CalculatorSelect({ id, label, placeholder, options, value, onChange, textStyle, fieldBg, fieldBorderColor, iconColor, fieldRef }) {
  const localRef = useRef(null)
  const setRef = (node) => {
    localRef.current = node
    if (fieldRef) fieldRef.current = node
  }
  return (
    <div ref={setRef} className="flex min-w-0 flex-col gap-2">
      <span
        id={`${id}-label`}
        className={cx(LABEL_SIZE, CMS_TEXT_HOVER_CLASS)}
        style={getTextStyleVars(textStyle, 'labelColor', '600', 'normal')}
      >
        {label}
      </span>
      <Dropdown
        id={id}
        label={label}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        options={options}
        buttonClassName={FIELD_CLASS}
        buttonStyle={{ backgroundColor: colorVar(fieldBg), borderColor: colorVar(fieldBorderColor) }}
        renderButton={({ selected, open }) => (
          <>
            <span
              className={cx('min-w-0 truncate', VALUE_SIZE, CMS_TEXT_HOVER_CLASS)}
              style={
                selected
                  ? getTextStyleVars(textStyle, 'valueColor', '800', 'normal')
                  : getTextStyleVars(textStyle, 'placeholderColor', '500', 'normal')
              }
            >
              {selected ? selected.label : placeholder}
            </span>
            <CaretDown
              size={20}
              aria-hidden
              className={cx('shrink-0 transition-transform', open && 'rotate-180')}
              style={{ color: colorVar(iconColor) }}
            />
            <ScrollOnOpen open={open} fieldRef={localRef} />
          </>
        )}
      />
    </div>
  )
}

/**
 * CMS-driven Excess Baggage Calculator. Mirrors the cms2 block: From / To list
 * the POS countries (GET /api/public/pos-list, the shared header store), plus
 * an Excess weight select. Calculate asks the CMS backend for a quote
 * (GET /api/public/baggage-prices/quote) — the admin's USD price per kg for
 * the route × the chosen kg — and shows it, or `unavailableText` when that
 * route has no price yet. Changing a field clears the shown price.
 */
const ExcessBaggageCalculator = ({
  lang = 'en',
  title = '',
  subtitle = '',
  fromLabel = '',
  toLabel = '',
  weightLabel = '',
  fromPlaceholder = '',
  toPlaceholder = '',
  weightPlaceholder = '',
  defaultFrom = '',
  defaultTo = '',
  defaultWeight = '',
  weights = [],
  buttonLabel = '',
  buttonIcon = '',
  resultLabel = '',
  unavailableText = '',
  linkLabel = '',
  linkHref = '',
  sectionPadding = 'none',
  showSectionBg = false,
  sectionBg = '100',
  showTitle = true,
  showSubtitle = true,
  cardBg = 'background',
  showCardBorder = true,
  cardBorderColor = '200',
  showCardShadow = false,
  dividerColor = '200',
  showLink = true,
  fieldBg = '100',
  fieldBorderColor = '200',
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
  const defaults = useMemo(
    () => ({ from: defaultFrom, to: defaultTo, weight: defaultWeight }),
    [defaultFrom, defaultTo, defaultWeight],
  )
  const [values, setValues] = useState(defaults)
  useEffect(() => setValues(defaults), [defaults])
  const posList = usePosList()
  const posOptions = useMemo(
    () => posList.map((pos) => ({ value: pos.code, label: posName(pos, lang) })),
    [posList, lang],
  )
  // "To" never offers the chosen "From" country.
  const toOptions = useMemo(
    () => posOptions.filter((option) => option.value !== values.from),
    [posOptions, values.from],
  )
  const toFieldRef = useRef(null)
  const weightFieldRef = useRef(null)
  // { status: 'idle' | 'loading' | 'priced' | 'unavailable', total?, currency? }
  const [quote, setQuote] = useState({ status: 'idle' })
  const requestRef = useRef(0)
  // A changed field makes the shown price stale (and drops a pending answer).
  useEffect(() => {
    requestRef.current += 1
    setQuote({ status: 'idle' })
  }, [values.from, values.to, values.weight])

  if (!title && !buttonLabel) return null

  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }
  // Calculate needs a real pick in every field (a stored default that is no
  // longer an option shows the placeholder, so it doesn't count).
  const isOption = (options, value) =>
    Boolean(value) && options.some((option) => option.value === value)
  const ready =
    isOption(posOptions, values.from) &&
    isOption(toOptions, values.to) &&
    isOption(weights, values.weight)
  const btn = getButtonStyle(textStyle, BUTTON_OPTS)
  const ButtonIcon = showButtonIcon !== false ? resolvePhosphorIcon(buttonIcon || 'Calculator') : null
  const set = (key) => (value) => setValues((prev) => ({ ...prev, [key]: value }))
  // Open the next field's menu once this one has closed and re-rendered.
  const openNext = (fieldRef) =>
    setTimeout(() => {
      const trigger = fieldRef.current?.querySelector('button[aria-haspopup="listbox"]')
      if (!trigger || trigger.getAttribute('aria-expanded') === 'true') return
      trigger.focus()
      trigger.click()
    }, 0)
  // Picking "From" clears a clashing "To" and opens "To"; picking "To" opens the weight.
  const setFrom = (value) => {
    setValues((prev) => ({ ...prev, from: value, to: prev.to === value ? '' : prev.to }))
    openNext(toFieldRef)
  }
  const setTo = (value) => {
    setValues((prev) => ({ ...prev, to: value }))
    openNext(weightFieldRef)
  }
  const calculate = () => {
    if (!ready || quote.status === 'loading') return
    const id = (requestRef.current += 1)
    setQuote({ status: 'loading' })
    getBaggageQuote({ from: values.from, to: values.to, weight: values.weight })
      .then((result) => {
        if (id !== requestRef.current) return
        setQuote(
          result
            ? { status: 'priced', total: result.totalUsd, currency: result.currency }
            : { status: 'unavailable' },
        )
      })
      .catch(() => {
        if (id === requestRef.current) setQuote({ status: 'unavailable' })
      })
  }
  const fieldProps = { textStyle, fieldBg, fieldBorderColor, iconColor }

  const buttonInner = (
    <>
      {ButtonIcon ? <ButtonIcon size={22} aria-hidden className="shrink-0" /> : null}
      <span>{buttonLabel}</span>
    </>
  )
  const withTitle = showTitle !== false && title
  const withSubtitle = showSubtitle !== false && subtitle
  const withBorder = showCardBorder !== false

  return (
    <div
      data-excess-baggage=""
      className={cx('flex flex-col', SECTION_PADDING[sectionPadding] || '')}
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      {withTitle || withSubtitle ? (
        <div className="mb-5 flex flex-col gap-1 md:mb-6 md:gap-2">
          {withTitle ? (
            <h2
              className={cx('m-0', TITLE_SIZE, CMS_TEXT_HOVER_CLASS)}
              style={getTextStyleVars(textStyle, 'titleColor', 'primary-1', 'bold')}
            >
              {title}
            </h2>
          ) : null}
          {withSubtitle ? (
            <p
              className={cx('m-0', SUBTITLE_SIZE, CMS_TEXT_HOVER_CLASS)}
              style={getTextStyleVars(textStyle, 'subtitleColor', '600', 'normal')}
            >
              <LinkedText text={subtitle} {...linkProps} />
            </p>
          ) : null}
        </div>
      ) : null}

      <div
        className={cx(CARD_CLASS, showCardShadow ? CARD_SHADOW : '', withBorder && CARD_BORDER_CLASS)}
        style={{
          backgroundColor: colorVar(cardBg),
          ...(withBorder ? { borderColor: colorVar(cardBorderColor) } : null),
        }}
      >
        <div className={FORM_GRID}>
          <CalculatorSelect
            id="ebc-from"
            label={fromLabel}
            placeholder={fromPlaceholder}
            options={posOptions}
            value={values.from || ''}
            onChange={setFrom}
            {...fieldProps}
          />
          <CalculatorSelect
            id="ebc-to"
            label={toLabel}
            placeholder={toPlaceholder}
            options={toOptions}
            value={values.to || ''}
            onChange={setTo}
            fieldRef={toFieldRef}
            {...fieldProps}
          />
          <CalculatorSelect
            id="ebc-weight"
            label={weightLabel}
            placeholder={weightPlaceholder}
            options={weights}
            value={values.weight || ''}
            onChange={set('weight')}
            fieldRef={weightFieldRef}
            {...fieldProps}
          />
          {buttonLabel ? (
            ready ? (
              <button
                type="button"
                onClick={calculate}
                aria-busy={quote.status === 'loading'}
                className={cx(
                  BUTTON_CLASS,
                  'border-0',
                  quote.status === 'loading' ? 'cursor-wait opacity-80' : 'cursor-pointer',
                  btn.className,
                )}
                style={btn.style}
              >
                {buttonInner}
              </button>
            ) : (
              <button
                type="button"
                disabled
                className={cx(BUTTON_CLASS, 'cursor-not-allowed border-0 font-semibold')}
                style={{ backgroundColor: colorVar(disabledBg), color: colorVar(disabledText) }}
              >
                {buttonInner}
              </button>
            )
          ) : null}
        </div>

        <div className="h-px w-full" style={{ backgroundColor: colorVar(dividerColor) }} />

        <div className="flex items-center justify-between gap-4 md:gap-6">
          {resultLabel ? (
            <span
              className={cx('min-w-0', RESULT_LABEL_SIZE, CMS_TEXT_HOVER_CLASS)}
              style={getTextStyleVars(textStyle, 'descriptionColor', '600', 'normal')}
            >
              {resultLabel}
            </span>
          ) : (
            <span />
          )}
          <span aria-live="polite" className="max-w-[60%] shrink-0 text-end">
            {quote.status === 'priced' ? (
              <span
                className={cx(PRICE_SIZE, CMS_TEXT_HOVER_CLASS)}
                style={getTextStyleVars(textStyle, 'priceColor', 'primary-1', 'bold')}
              >
                {formatPrice(quote.total)} {quote.currency}
              </span>
            ) : quote.status === 'unavailable' && unavailableText ? (
              <span
                className={cx(RESULT_LABEL_SIZE, CMS_TEXT_HOVER_CLASS)}
                style={getTextStyleVars(textStyle, 'priceColor', 'primary-1', 'bold')}
              >
                {unavailableText}
              </span>
            ) : null}
          </span>
        </div>

        {showLink !== false && linkLabel ? (
          <LocalizedLink
            href={linkHref || '#'}
            className={cx('self-start no-underline hover:underline', LINK_SIZE, CMS_TEXT_HOVER_CLASS)}
            style={getTextStyleVars(textStyle, 'ctaColor', 'primary-1', 'normal')}
          >
            {linkLabel}
          </LocalizedLink>
        ) : null}
      </div>
    </div>
  )
}

export default ExcessBaggageCalculator
