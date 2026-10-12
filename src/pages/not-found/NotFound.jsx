import DynamicPage from '../dynamic-page/DynamicPage.jsx'
import NotFoundHero from '../../shared/components/NotFoundHero.jsx'

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
    flushBottom
    fallback={
      <main className={MAIN_CLASS}>
        <NotFoundHero />
      </main>
    }
  />
)

export default NotFound
