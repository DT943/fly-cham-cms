import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowRight, CaretLeft, CaretRight } from '@phosphor-icons/react'
import Container from './Container.jsx'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'
import { typography } from '../../styles/typography.js'
import {
  CMS_TEXT_HOVER_CLASS,
  colorVar,
  getTextStyleVars,
} from '../../styles/cmsStyle.js'

const getVisibleCount = (width) => {
  if (width >= 1024) return 4
  if (width >= 768) return 3
  if (width >= 640) return 2
  return 1
}

const getGap = (width) => (width >= 768 ? 20 : 16)

const cx = (...parts) => parts.filter(Boolean).join(' ')

const formatPrice = (priceLabel, price, currency) =>
  [priceLabel, price, currency]
    .map((part) => (part === null || part === undefined ? '' : String(part).trim()))
    .filter(Boolean)
    .join(' ')

/**
 * One destination card. The whole card opens `item.href`; the arrow is the
 * visible control, not a separate link.
 */
const TripCard = ({ item, newLabel, priceLabel, textStyle, arrowBg, arrowColor, linkProps, exploreLabel }) => {
  const src = item.image || ''
  const priceText = formatPrice(priceLabel, item.price, item.currency)
  const href = String(item.href || '').trim()

  return (
    <article
      className={`relative aspect-16/13 min-w-0 overflow-hidden rounded-xl ${href ? 'cursor-pointer' : ''}`}
    >
      {href ? (
        <LocalizedLink
          href={href}
          aria-label={exploreLabel}
          className="absolute inset-0 z-[1] cursor-pointer"
        />
      ) : null}
      {src ? (
        <img
          src={src}
          alt={item.imageAlt || ''}
          className="absolute inset-0 size-full object-cover"
        />
      ) : null}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(1,38,59,0)_40%,rgba(1,38,59,0.88)_100%)]"
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] flex items-end justify-between gap-3 p-3.5 md:p-4">
        <div className="flex min-w-0 flex-col gap-1">
          {item.isNew && newLabel ? (
            <span
              className={cx('w-fit rounded px-2 py-0.5', typography.caption, CMS_TEXT_HOVER_CLASS)}
              style={{
                ...getTextStyleVars(textStyle, 'badgeText', '700', 'semibold'),
                backgroundColor: colorVar(textStyle.badgeBg || 'secondary'),
              }}
            >
              {newLabel}
            </span>
          ) : null}
          <h3
            className={cx('m-0', typography.itemTitle, CMS_TEXT_HOVER_CLASS)}
            style={getTextStyleVars(textStyle, 'cardTitleColor', '50', 'semibold')}
          >
            <LinkedText text={item.name} {...linkProps} />
          </h3>
          {priceText ? (
            <p
              className={cx('m-0 opacity-90', typography.caption, CMS_TEXT_HOVER_CLASS)}
              style={getTextStyleVars(textStyle, 'cardDescriptionColor', '50', 'normal')}
            >
              {priceText}
            </p>
          ) : null}
        </div>

        <span
          aria-hidden
          className="grid size-9 shrink-0 place-items-center rounded-full md:size-10"
          style={{
            backgroundColor: colorVar(arrowBg || 'primary-1'),
            color: colorVar(arrowColor),
          }}
        >
          <ArrowRight size={16} weight="bold" className="rtl:-scale-x-100" />
        </span>
      </div>
    </article>
  )
}

/**
 * "Plan Your Trip With Us" — CMS-driven port of pages/home/components/HomePlanTrip.jsx
 * (transform slider: arrows, responsive 1/2/3/4 visible, touch drag, RTL).
 * Registered `fullBleed`, so it renders its own section band + Container.
 * Every style prop defaults to the static source look.
 */
const HomePlanTrip = ({
  title = '',
  subtitle = '',
  viewAllLabel = '',
  viewAllHref = '/our-destinations',
  newLabel = '',
  priceLabel = '',
  items = [],
  showHeader = true,
  showSubtitle = true,
  showViewAll = true,
  showSectionBg = true,
  sectionBg = '100',
  badgeBg = 'secondary',
  arrowBg = 'primary-1',
  arrowColor = '50',
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
  ...textStyle
}) => {
  const { t, i18n } = useTranslation()
  const viewportRef = useRef(null)
  const dragRef = useRef({ active: false, startX: 0, lastX: 0 })
  const swipedRef = useRef(false)
  const [index, setIndex] = useState(0)
  const [layout, setLayout] = useState({ cardWidth: 0, gap: 16, visible: 1 })
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const isRtl = i18n.dir() === 'rtl'
  const total = items.length
  const maxIndex = Math.max(0, total - layout.visible)

  const measure = useCallback(() => {
    const el = viewportRef.current
    if (!el) return

    const width = el.clientWidth
    const visible = getVisibleCount(width)
    const gap = getGap(width)
    const cardWidth = Math.max(0, (width - gap * (visible - 1)) / visible)

    setLayout({ cardWidth, gap, visible })
    setIndex((current) => Math.min(current, Math.max(0, total - visible)))
  }, [total])

  useEffect(() => {
    measure()
    const el = viewportRef.current
    if (!el || typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure)
      return () => window.removeEventListener('resize', measure)
    }

    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [measure])

  const go = useCallback(
    (direction) => {
      setIndex((current) => Math.max(0, Math.min(maxIndex, current + direction)))
    },
    [maxIndex],
  )

  const onPointerDown = (event) => {
    if (event.pointerType === 'mouse') return
    swipedRef.current = false
    dragRef.current = { active: true, startX: event.clientX, lastX: event.clientX }
    setIsDragging(true)
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const onPointerMove = (event) => {
    if (!dragRef.current.active) return
    const delta = event.clientX - dragRef.current.startX
    dragRef.current.lastX = event.clientX
    setDragOffset(delta)
  }

  const onPointerUp = () => {
    if (!dragRef.current.active) return
    const delta = dragRef.current.lastX - dragRef.current.startX
    dragRef.current.active = false
    setIsDragging(false)
    setDragOffset(0)

    const threshold = Math.min(72, layout.cardWidth * 0.2)
    if (Math.abs(delta) < threshold) return

    swipedRef.current = true
    const forward = isRtl ? delta > 0 : delta < 0
    go(forward ? 1 : -1)
  }

  const onClickCapture = (event) => {
    if (!swipedRef.current) return
    swipedRef.current = false
    event.preventDefault()
    event.stopPropagation()
  }

  if (!items.length && !title) return null

  const offset = layout.cardWidth > 0 ? index * (layout.cardWidth + layout.gap) : 0
  const baseTranslate = isRtl ? offset : -offset
  const translateX = baseTranslate + (isDragging ? dragOffset : 0)

  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }
  const cardStyle = { ...textStyle, badgeBg }

  const subtitleVisible = showSubtitle && Boolean(subtitle)
  const viewAllVisible = showViewAll && Boolean(viewAllLabel)
  const headerVisible = showHeader && (title || subtitleVisible || viewAllVisible)

  return (
    <section
      className="w-full min-w-0"
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      <Container className="flex min-w-0 flex-col gap-5 md:gap-7">
        {headerVisible ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
            <div className="flex max-w-xl flex-col gap-1.5 md:gap-2">
              {title ? (
                <h2
                  className={cx('m-0', typography.sectionTitle, 'lg:text-[32px]', CMS_TEXT_HOVER_CLASS)}
                  style={getTextStyleVars(textStyle, 'titleColor', '700', 'semibold')}
                >
                  <LinkedText text={title} {...linkProps} />
                </h2>
              ) : null}
              {subtitleVisible ? (
                <p
                  className={cx('m-0', typography.sectionDescription, CMS_TEXT_HOVER_CLASS)}
                  style={getTextStyleVars(textStyle, 'subtitleColor', '600', 'normal')}
                >
                  <LinkedText text={subtitle} {...linkProps} />
                </p>
              ) : null}
            </div>
            {viewAllVisible ? (
              <LocalizedLink
                href={viewAllHref || '#'}
                className={cx(
                  'inline-flex shrink-0 cursor-pointer items-center gap-1 no-underline',
                  typography.caption,
                )}
                style={getTextStyleVars(textStyle, 'ctaColor', 'primary-1', 'semibold')}
              >
                {viewAllLabel}
                <CaretRight size={14} weight="bold" className="rtl:-scale-x-100" />
              </LocalizedLink>
            ) : null}
          </div>
        ) : null}

        {items.length ? (
          <div className="relative min-w-0">
            <div
              ref={viewportRef}
              className="min-w-0 touch-pan-y overflow-hidden"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onClickCapture={onClickCapture}
            >
              <div
                className="flex will-change-transform"
                style={{
                  gap: `${layout.gap}px`,
                  transform: `translate3d(${translateX}px, 0, 0)`,
                  transition: isDragging
                    ? 'none'
                    : 'transform 650ms cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                {items.map((item, i) => (
                  <div
                    key={item.id || i}
                    data-trip-card
                    className="shrink-0 grow-0"
                    style={{
                      width: layout.cardWidth ? `${layout.cardWidth}px` : undefined,
                      flexBasis: layout.cardWidth ? `${layout.cardWidth}px` : undefined,
                    }}
                  >
                    <TripCard
                      item={item}
                      newLabel={newLabel}
                      priceLabel={priceLabel}
                      textStyle={cardStyle}
                      arrowBg={arrowBg}
                      arrowColor={arrowColor}
                      linkProps={linkProps}
                      exploreLabel={t('home.planTrip.explore', { city: item.name })}
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => go(-1)}
              disabled={index <= 0}
              aria-label={t('home.planTrip.prev')}
              className="absolute inset-s-0 top-1/2 z-10 hidden size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-200 bg-50 text-600 shadow-[0_2px_10px_rgba(33,37,41,0.12)] transition-opacity hover:text-primary-1 disabled:pointer-events-none disabled:opacity-40 md:grid rtl:translate-x-1/2"
            >
              <CaretLeft size={16} weight="bold" className="rtl:-scale-x-100" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              disabled={index >= maxIndex}
              aria-label={t('home.planTrip.next')}
              className="absolute inset-e-0 top-1/2 z-10 hidden size-9 translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-200 bg-50 text-600 shadow-[0_2px_10px_rgba(33,37,41,0.12)] transition-opacity hover:text-primary-1 disabled:pointer-events-none disabled:opacity-40 md:grid rtl:-translate-x-1/2"
            >
              <CaretRight size={16} weight="bold" className="rtl:-scale-x-100" />
            </button>
          </div>
        ) : null}
      </Container>
    </section>
  )
}

export default HomePlanTrip
