import DynamicPage from '../dynamic-page/DynamicPage.jsx'
import NotFoundHero from '../../shared/components/NotFoundHero.jsx'

// The hero pulls up under the sticky header (which turns dark over it — see
// isFullBleedPath) so the photo always covers the full viewport.
const PULL_UNDER_HEADER = '-mt-16 md:-mt-[4.5rem]'
const MAIN_CLASS = 'flex w-full flex-1 flex-col'

/**
 * The 404 page — a dynamic CMS page (slug `not-found`, one "not-found-hero"
 * block) rendered by DynamicPage like every other CMS page.
 *
 * It must never fail: DynamicPage shows this page for every missing page, so
 * when the `not-found` page itself can't load (CMS down, page missing, no
 * blocks in this language) the same hero renders with its built-in text and
 * photo instead.
 */
const NotFound = () => (
  <DynamicPage
    slug="not-found"
    className={MAIN_CLASS}
    blocksClassName={PULL_UNDER_HEADER}
    flushBottom
    fallback={
      <main className={`${MAIN_CLASS} ${PULL_UNDER_HEADER}`}>
        <NotFoundHero />
      </main>
    }
  />
)

export default NotFound
