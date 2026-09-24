import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pause, Play } from '@phosphor-icons/react'
import Container from '../../../shared/components/Container.jsx'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'
import { typography } from '../../../styles/typography.js'
import { homeHeroSlides } from '../utils/homeHeroContent.js'

const SLIDE_DURATION_MS = 6000

/**
 * Full-bleed home hero carousel — autoplay with pause, progress pill, and dots.
 * Extra bottom space reserved so the booking widget can overlap the hero.
 */
const HomeHeroSlider = () => {
  const { t } = useTranslation()
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const startRef = useRef(Date.now())
  const pausedAtRef = useRef(0)
  const rafRef = useRef(0)
  const slideCount = homeHeroSlides.length

  const goTo = useCallback(
    (index) => {
      setActiveIndex(((index % slideCount) + slideCount) % slideCount)
      setProgress(0)
      startRef.current = Date.now()
      pausedAtRef.current = 0
    },
    [slideCount],
  )

  useEffect(() => {
    if (paused) {
      pausedAtRef.current = progress
      cancelAnimationFrame(rafRef.current)
      return undefined
    }

    startRef.current = Date.now() - pausedAtRef.current * SLIDE_DURATION_MS

    const tick = () => {
      const elapsed = Date.now() - startRef.current
      const next = Math.min(elapsed / SLIDE_DURATION_MS, 1)
      setProgress(next)

      if (next >= 1) {
        setActiveIndex((current) => (current + 1) % slideCount)
        setProgress(0)
        startRef.current = Date.now()
        pausedAtRef.current = 0
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [paused, activeIndex, slideCount])

  return (
    <section
      className="relative isolate min-h-112 w-full overflow-hidden sm:min-h-128 md:min-h-140 lg:min-h-150"
      aria-roledescription="carousel"
      aria-label={t('home.hero.carouselLabel')}
    >
      {homeHeroSlides.map((slide, index) => {
        const isActive = index === activeIndex
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              isActive ? 'z-1 opacity-100' : 'z-0 opacity-0'
            }`}
            aria-hidden={!isActive}
          >
            <img
              src={slide.image}
              alt=""
              style={{ objectPosition: slide.objectPosition }}
              className="absolute inset-0 size-full object-cover"
            />
          </div>
        )
      })}

      <div className="pointer-events-none absolute inset-0 z-2 bg-linear-to-r from-50/70 via-50/20 to-transparent to-55% rtl:bg-linear-to-l" />

      <Container className="relative z-10 flex min-h-112 flex-col justify-center pb-36 pt-14 sm:min-h-128 sm:pb-40 md:min-h-140 md:pb-44 md:pt-16 lg:min-h-150 lg:pb-48">
        {homeHeroSlides.map((slide, index) => {
          const isActive = index === activeIndex
          return (
            <div
              key={slide.id}
              className={`max-w-lg transition-opacity duration-500 ${
                isActive
                  ? 'relative opacity-100'
                  : 'pointer-events-none absolute opacity-0'
              }`}
              aria-hidden={!isActive}
            >
              <div className="flex flex-col items-start gap-2.5 md:gap-3">
                <h1
                  className={`m-0 font-bold leading-tight text-primary-1 ${typography.pageTitle} lg:text-[44px]`}
                >
                  {t(`home.hero.slides.${slide.id}.title`)}
                </h1>
                <p className={`m-0 font-normal text-600 ${typography.sectionDescription}`}>
                  {t(`home.hero.slides.${slide.id}.subtitle`)}
                </p>
                <LocalizedLink
                  href={slide.href}
                  className={`mt-2 inline-flex items-center justify-center rounded-lg bg-secondary px-7 py-3 font-semibold text-50 no-underline transition-colors hover:bg-secondary-800 md:px-8 md:py-3.5 ${typography.button}`}
                >
                  {t('home.hero.bookNow')}
                </LocalizedLink>
              </div>
            </div>
          )
        })}
      </Container>

      <div className="absolute inset-x-0 bottom-28 z-10 flex justify-center sm:bottom-32 md:bottom-36 lg:bottom-40">
        <div
          className="flex items-center gap-2.5"
          role="group"
          aria-label={t('home.hero.controlsLabel')}
        >
          <button
            type="button"
            onClick={() => setPaused((value) => !value)}
            aria-label={paused ? t('home.hero.play') : t('home.hero.pause')}
            className="grid size-7 place-items-center rounded-full border-0 bg-transparent p-0 text-primary-1"
          >
            {paused ? <Play size={14} weight="fill" /> : <Pause size={14} weight="fill" />}
          </button>

          <div className="flex items-center gap-2">
            {homeHeroSlides.map((slide, index) => {
              const isActive = index === activeIndex
              if (isActive) {
                return (
                  <button
                    key={slide.id}
                    type="button"
                    aria-label={t('home.hero.goToSlide', { index: index + 1 })}
                    aria-current="true"
                    onClick={() => goTo(index)}
                    className="relative h-1.5 w-9 overflow-hidden rounded-full border-0 bg-primary-100 p-0"
                  >
                    <span
                      className="absolute inset-y-0 inset-s-0 rounded-full bg-primary-1"
                      style={{ width: `${progress * 100}%` }}
                    />
                  </button>
                )
              }

              return (
                <button
                  key={slide.id}
                  type="button"
                  aria-label={t('home.hero.goToSlide', { index: index + 1 })}
                  onClick={() => goTo(index)}
                  className="size-1.5 shrink-0 rounded-full border-0 bg-primary-200/90 p-0"
                />
              )
            })}
          </div>
        </div>
      </div>

      <span className="sr-only" aria-live="polite">
        {t('home.hero.slideStatus', {
          current: activeIndex + 1,
          total: slideCount,
        })}
      </span>
    </section>
  )
}

export default HomeHeroSlider
