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
      className="group relative overflow-clip rounded-xl w-full min-h-[28rem] lg:w-[20.4rem] lg:min-w-[20.4rem] lg:h-[46.9rem] lg:shrink-0 cursor-pointer "
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      {slides.map((src, index) => (
        <img
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

      <div className="absolute top-10 start-[18px] end-[18px] z-20 pointer-events-none flex flex-col gap-1">
        <p className={`${typography.body} font-semibold text-50 m-0`}>{country}</p>
        <p className={`${typography.itemTitle} font-semibold text-50 m-0`}>{title}</p>
      </div>

      <div className="absolute inset-x-[18px] bottom-7 z-20 flex flex-col gap-10 pointer-events-none">
        <div className="flex flex-col gap-4 [text-shadow:0px_4px_6px_rgba(33,37,41,0.2),0px_0px_1px_rgba(33,37,41,0.32)]">
          <h3 className={`${typography.body} font-semibold text-white m-0`}>{heading}</h3>
          <p className={`${typography.caption} font-normal text-50 m-0 leading-5`}>
            {description}
          </p>
        </div>

        <div className="flex flex-col gap-3 pointer-events-auto">
          <LocalizedLink
            href={href}
            className={`${typography.caption} font-semibold text-white bg-primary-1 hover:bg-primary-1/90 no-underline rounded-lg px-[15px] py-2.5 min-h-[45px] flex items-center justify-center text-center transition-colors duration-200 ease-out motion-reduce:transition-none ${buttonClassName}`}
            style={buttonStyle}
          >
            {cta}
          </LocalizedLink>
          <LocalizedLink
            href={href}
            className={`${typography.body} font-semibold text-50 inline-flex items-center justify-center gap-2.5 no-underline rounded-lg transition-transform duration-200 hover:translate-x-1 rtl:hover:-translate-x-1 motion-reduce:transition-none motion-reduce:hover:translate-x-0`}
          >
            {activities}
            <span className="flex items-center justify-center size-[29px] shrink-0">
              <ArrowRight size={20} className="rtl:-scale-x-100" />
            </span>
          </LocalizedLink>
        </div>
      </div>
    </article>
  )
}

export default FeaturedDestination
