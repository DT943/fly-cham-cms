import Container from './Container.jsx'
import { typography } from '../../styles/typography.js'

/**
 * Full-bleed hero with a background photo, a left-anchored fade, and a
 * title/subtitle block. Shared across content pages (Travel Experience,
 * Before You Fly, About Fly Cham, …).
 *
 * `objectPosition` is a raw CSS value (e.g. "center 35%") applied inline so the
 * photo's focal point can be tuned per page. `contentClassName` sets the width
 * of the text column.
 */
const PageMediaHero = ({
  image,
  imageAlt = '',
  title,
  subtitle,
  objectPosition = 'center',
  contentClassName = 'max-w-[605px]',
}) => (
  <section className="relative isolate overflow-hidden h-80 sm:h-100 md:h-110 lg:h-125">
    <img
      src={image}
      alt={imageAlt}
      style={{ objectPosition }}
      className="absolute inset-0 size-full object-cover"
    />
    <div
      className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(253_253_252/0.90)_28%,rgb(253_253_252/0)_55%)] rtl:bg-[linear-gradient(to_left,rgb(253_253_252/0.90)_28%,rgb(253_253_252/0)_55%)]"
    />

    <Container className="relative flex h-full flex-col justify-center">
      <div className={`flex flex-col gap-4 ${contentClassName}`}>
        <h1 className={`${typography.pageTitle} m-0 font-bold leading-tight text-primary-1 lg:text-[64px]`}>
          {title}
        </h1>
        {subtitle && (
          <p className={`${typography.sectionDescription} m-0 max-w-[430px] font-normal leading-relaxed text-700 lg:text-lg`}>
            {subtitle}
          </p>
        )}
      </div>
    </Container>
  </section>
)

export default PageMediaHero
