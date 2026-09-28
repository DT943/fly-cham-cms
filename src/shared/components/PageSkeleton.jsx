import { useTranslation } from 'react-i18next'
import Container from './Container.jsx'
import Skeleton from './Skeleton.jsx'

// Delay between neighbouring boxes' shimmer, so the sweep rolls down the page
// as one wave instead of every box flashing at once.
const WAVE_STEP = 140

/**
 * The shared loading state for any page. Plain boxes on purpose: CMS pages are
 * built by the admin, so the skeleton must not promise a particular component
 * (hero, cards, …) that may not be there — it only suggests "sections are
 * coming": a tall opening box, a row of two, and a wide closing box.
 *
 * Fades in after a short beat (no flash on fast loads), shimmers in the
 * reading direction (mirrors in Arabic), and is static under reduced motion.
 * Announced once to screen readers ("Loading page…"); the boxes are hidden.
 */
const PageSkeleton = () => {
  const { t } = useTranslation()

  return (
    <div role="status" aria-live="polite" aria-busy="true" className="skeleton-appear w-full">
      <span className="sr-only">{t('common.loadingPage')}</span>
      <Container className="flex flex-col gap-5 py-5 md:gap-8 md:py-10">
        <Skeleton className="h-[220px] w-full rounded-3xl md:h-[360px]" />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-8">
          <Skeleton className="h-[150px] rounded-2xl md:h-[220px]" delay={WAVE_STEP} />
          <Skeleton
            className="hidden h-[150px] rounded-2xl md:block md:h-[220px]"
            delay={WAVE_STEP * 2}
          />
        </div>
        <Skeleton className="h-[120px] w-full rounded-2xl md:h-[160px]" delay={WAVE_STEP * 3} />
      </Container>
    </div>
  )
}

export default PageSkeleton
