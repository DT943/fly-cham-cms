import { ArrowRight } from '@phosphor-icons/react'
import LocalizedLink from './LocalizedLink.jsx'
import { typography } from '../../styles/typography.js'

/**
 * Two-up photo cards with a bottom gold scrim, title, description, and
 * "Learn more" arrow link. Callers pass copy, images, and hrefs.
 */
const MediaCards = ({ cards = [] }) => (
  <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
    {cards.map(({ id, image, imageAlt = '', href, title, description, cta }) => (
      <article
        key={id || title}
        className="relative isolate flex min-h-[360px] flex-col justify-end overflow-hidden rounded-2xl p-8 md:p-10"
      >
        <img
          src={image}
          alt={imageAlt}
          className="absolute inset-0 -z-10 size-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-linear-to-b from-transparent to-secondary-2" />

        <div className="flex flex-col gap-3 text-50">
          {title && (
            <h2 className="m-0 text-2xl font-bold md:text-[28px]">{title}</h2>
          )}
          {description && (
            <p className={`m-0 font-normal leading-normal text-100 ${typography.caption}`}>
              {description}
            </p>
          )}
          {cta && href && (
            <LocalizedLink
              href={href}
              className={`mt-1 inline-flex w-fit items-center gap-2.5 font-semibold text-50 no-underline ${typography.button}`}
            >
              <span className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-100">
                <ArrowRight size={16} weight="bold" className="text-primary-1 rtl:rotate-180" />
              </span>
              {cta}
            </LocalizedLink>
          )}
        </div>
      </article>
    ))}
  </section>
)

export default MediaCards
