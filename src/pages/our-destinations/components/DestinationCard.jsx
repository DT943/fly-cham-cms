import { ArrowRight } from '@phosphor-icons/react'
import { typography } from '../../../styles/typography.js'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'

const DestinationCard = ({
  country,
  title,
  image,
  imageAlt,
  cta,
  activities,
  href = '#',
}) => (
  <article className="group relative overflow-hidden rounded-xl aspect-[282/176] cursor-pointer transition-shadow duration-300 ease-out hover:shadow-[0_8px_30px_rgba(0,37,60,0.25)] motion-reduce:transition-none motion-reduce:hover:shadow-none">
    <img
      src={image}
      alt={imageAlt}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
    />
    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,rgba(0,37,60,0)_0%,rgba(0,37,60,0.85)_100%)] transition-opacity duration-300 ease-out group-hover:opacity-0 group-focus-within:opacity-0 motion-reduce:transition-none" />
    <div className="absolute inset-0 pointer-events-none opacity-0 bg-[linear-gradient(to_bottom,rgba(0,96,128,0.2)_0%,rgba(0,66,92,0.55)_45%,rgba(0,37,60,0.92)_100%)] transition-opacity duration-300 ease-out group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none" />

    <div className="absolute inset-x-0 bottom-0 grid p-4">
      <div className="col-start-1 row-start-1 self-end pointer-events-none flex flex-col gap-1 transition-all duration-300 ease-out group-hover:opacity-0 group-hover:-translate-y-3 group-focus-within:opacity-0 group-focus-within:-translate-y-3 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 motion-reduce:group-focus-within:translate-y-0">
        <p className={`${typography.caption} font-semibold text-100 m-0`}>{country}</p>
        <p className={`${typography.body} font-medium text-100 m-0`}>{title}</p>
      </div>

      <div className="col-start-1 row-start-1 self-end flex flex-col gap-3 opacity-0 translate-y-4 pointer-events-none transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto motion-reduce:transition-none motion-reduce:translate-y-0">
        <LocalizedLink
          href={href}
          className={`${typography.caption} font-semibold text-100 bg-primary-1/85 hover:bg-primary-1 no-underline rounded-lg px-2.5 py-3 text-center transition-colors duration-200 ease-out motion-reduce:transition-none`}
        >
          {cta}
        </LocalizedLink>
        <LocalizedLink
          href={href}
          className={`${typography.caption} font-medium text-50 inline-flex items-center justify-center gap-2 no-underline transition-transform duration-200 hover:translate-x-1 rtl:hover:-translate-x-1 motion-reduce:transition-none motion-reduce:hover:translate-x-0`}
        >
          {activities}
          <ArrowRight size={14} weight="bold" className="rtl:-scale-x-100" />
        </LocalizedLink>
      </div>
    </div>
  </article>
)

export default DestinationCard
