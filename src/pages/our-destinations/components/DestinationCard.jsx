import { ArrowRight } from '@phosphor-icons/react'
import { typography } from '../../../styles/typography.js'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'

/**
 * Figma: "Our destinations" → Frame 1000004182 (node 38328:9001).
 *
 * Hover swaps the two content blocks in place, timed off the Figma prototype
 * recording: country/title rise out of frame while the CTA rises in from below,
 * both moving together over ~300ms. The scrim does not change between states —
 * it is one gradient, `rgba(0,37,60,0) 38.122% → #00253C`.
 */
const swapTransition =
  '[transition:translate_300ms_cubic-bezier(0.4,0,0.2,1),opacity_300ms_cubic-bezier(0.4,0,0.2,1)] motion-reduce:[transition:none]'

const DestinationCard = ({
  country,
  title,
  image,
  imageAlt,
  cta,
  activities,
  href = '#',
}) => (
  <article className="group relative overflow-clip rounded-xl aspect-[282/176] cursor-pointer">
    <img
      src={image}
      alt={imageAlt}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
    />
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,rgba(0,37,60,0)_38.122%,#00253C_100%)]"
    />

    {/* Both blocks share one grid cell and sit bottom-aligned, so they cross in place. */}
    <div className="absolute inset-x-0 bottom-0 grid p-4">
      <div
        className={`col-start-1 row-start-1 self-end pointer-events-none flex flex-col gap-1 ${swapTransition} group-hover:opacity-0 group-hover:-translate-y-full group-focus-within:opacity-0 group-focus-within:-translate-y-full motion-reduce:group-hover:translate-y-0 motion-reduce:group-focus-within:translate-y-0`}
      >
        <p className={`${typography.caption} font-semibold text-100 m-0`}>{country}</p>
        <p className={`${typography.body} font-medium text-100 m-0`}>{title}</p>
      </div>

      <div
        className={`col-start-1 row-start-1 self-end flex flex-col gap-2 opacity-0 translate-y-full pointer-events-none ${swapTransition} group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto motion-reduce:translate-y-0`}
      >
        <LocalizedLink
          href={href}
          className={`${typography.caption} font-semibold text-100 bg-primary-1 hover:bg-primary-1/90 no-underline rounded-lg p-2.5 text-center transition-colors duration-200 ease-out motion-reduce:transition-none`}
        >
          {cta}
        </LocalizedLink>
        <LocalizedLink
          href={href}
          className={`${typography.caption} font-medium text-50 inline-flex items-center justify-center gap-2.5 no-underline rounded-lg transition-transform duration-200 hover:translate-x-1 rtl:hover:-translate-x-1 motion-reduce:transition-none motion-reduce:hover:translate-x-0`}
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

export default DestinationCard
