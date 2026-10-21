import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'

/**
 * Figma: "Our destinations" → Frame 1000004173 (node 38311:3436).
 *
 * Same card system as `DestinationCard`, but the CTA block is always visible —
 * so the scrim starts higher (23.302% vs 38.122%) to carry the extra copy.
 * Background photos fade through a three-image slider.
 */
const FeaturedDestination = ({
  country,
  title,
  heading,
  description,
  cta,
  activities,
  image,
  images,
  imageAlt,
  href = '#',
  // "Things to Do" link; falls back to the main link when not set.
  activitiesHref,
  // Optional Normal/Hover button styling from getButtonStyle (CMS block).
  buttonClassName = '',
  buttonStyle,
}) => {
  const { i18n } = useTranslation()
  const slides = images?.length ? images : image ? [image] : []
  const canSlide = slides.length > 1
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const dragStartX = useRef(null)
  const isRtl = i18n.dir() === 'rtl'

  useEffect(() => {
    if (!canSlide || paused) return undefined

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length)
    }, 5000)

    return () => window.clearInterval(timer)
  }, [canSlide, paused, slides.length])

  const goTo = (index) => {
    const total = slides.length
    setActive(((index % total) + total) % total)
  }

  const onPointerDown = (event) => {
    if (!canSlide) return
    dragStartX.current = event.clientX
  }

  const onPointerUp = (event) => {
    if (dragStartX.current == null) return

    const delta = event.clientX - dragStartX.current
    dragStartX.current = null

    if (Math.abs(delta) < 40) return

    const goingNext = isRtl ? delta > 0 : delta < 0
    goTo(active + (goingNext ? 1 : -1))
  }

  return (
    <article
      className="group relative h-[420px] w-full cursor-pointer overflow-clip rounded-xl lg:h-[46.9rem] lg:w-[20.4rem] lg:min-w-[20.4rem] lg:shrink-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      {slides.map((src, index) => (
        <img loading="lazy" decoding="async"
          key={`${src}-${index}`}
          src={src}
          alt={index === 0 ? imageAlt : ''}
          className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ease-out motion-reduce:transition-none ${
            index === active ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      <div
        aria-hidden
        className="absolute inset-0 z-10 pointer-events-none bg-[linear-gradient(180deg,rgba(0,37,60,0)_23.302%,#00253C_100%)]"
      />

      <div className="pointer-events-none absolute start-4 end-4 top-6 z-20 flex flex-col gap-1 lg:start-[18px] lg:end-[18px] lg:top-10">
        <p className="m-0 text-xs font-semibold text-50 lg:text-base">{country}</p>
        <p className="m-0 text-lg font-bold text-50 lg:font-semibold">{title}</p>
      </div>

      <div className="pointer-events-none absolute inset-x-4 bottom-[30px] z-20 flex flex-col gap-3 lg:inset-x-[18px] lg:bottom-7 lg:gap-10">
        <div className="flex flex-col gap-2 [text-shadow:0px_4px_6px_rgba(33,37,41,0.2),0px_0px_1px_rgba(33,37,41,0.32)] lg:gap-4">
          <h3 className={`${typography.body} m-0 font-semibold text-white`}>{heading}</h3>
          <p className="m-0 text-xs font-normal leading-4 text-50 lg:text-sm lg:leading-5">
            {description}
          </p>
        </div>

        <div className="pointer-events-auto flex flex-col gap-3">
          <LocalizedLink
            href={href}
            className={`flex min-h-0 items-center justify-center rounded-lg bg-primary-1 px-3 py-2 text-center text-xs font-semibold text-white no-underline lg:min-h-[45px] lg:px-[15px] lg:py-2.5 lg:text-sm ${buttonClassName}`}
            style={buttonStyle}
          >
            {cta}
          </LocalizedLink>
          <LocalizedLink
            href={activitiesHref || href}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg text-[13px] font-semibold text-50 no-underline lg:gap-2.5 lg:text-base"
          >
            {activities}
            <span className="flex size-4 shrink-0 items-center justify-center lg:size-[29px]">
              <ArrowRight size={16} className="rtl:-scale-x-100 lg:hidden" />
              <ArrowRight size={20} className="hidden rtl:-scale-x-100 lg:block" />
            </span>
          </LocalizedLink>
        </div>
      </div>
    </article>
  )
}

export default FeaturedDestination
