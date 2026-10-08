import { useEffect, useRef, useState } from 'react'
import { CaretDown, CaretUp, Info, Pause, Play, X } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import Container from '../../components/Container.jsx'
import LocalizedLink from '../../components/LocalizedLink.jsx'

const DISMISS_KEY = 'flycham.travelNotice.dismissed'
const SWITCH_MS = 450
const ROTATE_MS = 6000

/** Home-page ticker. Each item links to its travel update. */
const NOTICES = [
  { id: 'airspace', href: '/travel-updates' },
  { id: 'autumnWeather', href: '/travel-updates/autumnWeather' },
  { id: 'flightsResume', href: '/travel-updates/flightsResume' },
]

const readDismissed = () => {
  try {
    return sessionStorage.getItem(DISMISS_KEY) === '1'
  } catch {
    return false
  }
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const controlClass =
  'inline-flex h-3.5 w-4 cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent p-0 text-secondary-2 outline-none hover:text-primary-1 focus-visible:ring-2 focus-visible:ring-primary-1'

const TravelUpdatesNotice = () => {
  const { t } = useTranslation()
  const [dismissed, setDismissed] = useState(readDismissed)
  const [index, setIndex] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [paused, setPaused] = useState(false)
  const [motion, setMotion] = useState(null)
  const indexRef = useRef(0)
  const motionRef = useRef(null)
  const hoveredRef = useRef(false)
  const pausedRef = useRef(false)
  const goRef = useRef(() => {})

  useEffect(() => {
    indexRef.current = index
  }, [index])

  useEffect(() => {
    motionRef.current = motion
  }, [motion])

  useEffect(() => {
    hoveredRef.current = hovered
  }, [hovered])

  useEffect(() => {
    pausedRef.current = paused
  }, [paused])

  goRef.current = (dir) => {
    if (motionRef.current || NOTICES.length < 2) return
    const from = indexRef.current
    const to = (from + dir + NOTICES.length) % NOTICES.length

    if (prefersReducedMotion()) {
      indexRef.current = to
      setIndex(to)
      return
    }

    const nextMotion = { from, to, dir, run: false }
    motionRef.current = nextMotion
    setMotion(nextMotion)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setMotion((current) => (current ? { ...current, run: true } : current))
      })
    })
    window.setTimeout(() => {
      indexRef.current = to
      motionRef.current = null
      setIndex(to)
      setMotion(null)
    }, SWITCH_MS)
  }

  useEffect(() => {
    if (dismissed) return undefined
    const id = window.setInterval(() => {
      if (pausedRef.current || hoveredRef.current || motionRef.current || document.hidden) return
      goRef.current(1)
    }, ROTATE_MS)
    return () => window.clearInterval(id)
  }, [dismissed])

  if (dismissed) return null

  const dismiss = () => {
    try {
      sessionStorage.setItem(DISMISS_KEY, '1')
    } catch {
      /* storage can be blocked; still hide it for this view */
    }
    setDismissed(true)
  }

  const renderLine = (noticeIndex, className, style, hidden) => {
    const notice = NOTICES[noticeIndex]
    return (
      <LocalizedLink
        to={notice.href}
        aria-hidden={hidden || undefined}
        tabIndex={hidden ? -1 : undefined}
        className={`flex h-full w-full min-w-0 items-center gap-1.5 text-secondary-2 no-underline hover:underline ${className}`}
        style={style}
      >
        <span className="shrink-0 text-[13px] leading-5 font-semibold">
          {t('layout.header.travelNotice.label')}
        </span>
        <span className="min-w-0 truncate text-[13px] leading-5 font-normal">
          {t(`layout.header.travelNotice.items.${notice.id}`)}
        </span>
      </LocalizedLink>
    )
  }

  const slideClass =
    'absolute inset-x-0 top-0 transition-transform duration-500 ease-out motion-reduce:transition-none'

  return (
    <div
      className="relative z-10 border-b border-secondary-200 bg-secondary-100 text-secondary-2"
      role="region"
      aria-roledescription={t('layout.header.travelNotice.regionLabel')}
      aria-label={t('layout.header.travelNotice.regionLabel')}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setHovered(false)
      }}
    >
      <Container className="flex h-10 items-center gap-4">
        <Info size={16} weight="regular" className="shrink-0 text-primary-1" aria-hidden />
        <div className="relative h-5 min-w-0 flex-1 overflow-hidden">
          <span className="sr-only" aria-live="polite">
            {t('layout.header.travelNotice.label')}{' '}
            {t(`layout.header.travelNotice.items.${NOTICES[index].id}`)}
          </span>
          {motion ? (
            <>
              {renderLine(
                motion.from,
                slideClass,
                { transform: motion.run ? `translateY(${motion.dir * -100}%)` : 'translateY(0)' },
                true,
              )}
              {renderLine(
                motion.to,
                slideClass,
                {
                  transform: motion.run ? 'translateY(0)' : `translateY(${motion.dir * 100}%)`,
                },
                true,
              )}
            </>
          ) : (
            renderLine(index, 'absolute inset-x-0 top-0')
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <div className="flex flex-col items-center justify-center">
            <button
              type="button"
              className={controlClass}
              aria-label={t('layout.header.travelNotice.previous')}
              onClick={() => goRef.current(-1)}
            >
              <CaretUp size={11} weight="bold" />
            </button>
            <button
              type="button"
              className={controlClass}
              aria-label={t('layout.header.travelNotice.next')}
              onClick={() => goRef.current(1)}
            >
              <CaretDown size={11} weight="bold" />
            </button>
          </div>
          <button
            type="button"
            className="inline-flex size-[18px] cursor-pointer items-center justify-center rounded-full border border-secondary-2/80 bg-transparent text-secondary-2 outline-none hover:bg-secondary-200 focus-visible:ring-2 focus-visible:ring-primary-1"
            aria-pressed={paused}
            aria-label={t(
              paused ? 'layout.header.travelNotice.play' : 'layout.header.travelNotice.pause',
            )}
            onClick={() => setPaused((value) => !value)}
          >
            {paused ? <Play size={8} weight="fill" /> : <Pause size={8} weight="fill" />}
          </button>
          <button
            type="button"
            className="inline-flex size-5 cursor-pointer items-center justify-center border-0 bg-transparent text-secondary-2 outline-none hover:text-primary-1 focus-visible:ring-2 focus-visible:ring-primary-1"
            aria-label={t('layout.header.travelNotice.close')}
            onClick={dismiss}
          >
            <X size={13} weight="bold" />
          </button>
        </div>
      </Container>
    </div>
  )
}

export default TravelUpdatesNotice
