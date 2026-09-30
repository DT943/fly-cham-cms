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
 * coming".
 *
 * It is a full screen tall, under the real header, so the footer stays below
 * the fold until the page itself renders. Shimmers in the reading direction
 * (mirrors in Arabic) and is static under reduced motion. Announced once to
 * screen readers ("Loading page…"); the boxes are hidden.
 */
const PageSkeleton = () => {
  const { t } = useTranslation()

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="flex min-h-dvh w-full flex-1 flex-col"
    >
      <span className="sr-only">{t('common.loadingPage')}</span>
      <Container className="flex min-h-dvh flex-1 flex-col gap-5 py-5 md:gap-8 md:py-10">
        <Skeleton className="min-h-[220px] w-full flex-[1.5] rounded-3xl md:min-h-[360px]" />
        <div className="grid min-h-[150px] flex-1 grid-cols-1 gap-5 md:min-h-[220px] md:grid-cols-2 md:gap-8">
          <Skeleton className="min-h-[150px] rounded-2xl md:min-h-[220px]" delay={WAVE_STEP} />
          <Skeleton
            className="hidden min-h-[150px] rounded-2xl md:block md:min-h-[220px]"
            delay={WAVE_STEP * 2}
          />
        </div>
        <Skeleton
          className="min-h-[120px] w-full flex-[0.7] rounded-2xl md:min-h-[160px]"
          delay={WAVE_STEP * 3}
        />
      </Container>
    </div>
  )
}

export default PageSkeleton
