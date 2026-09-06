import { ArrowRight } from '@phosphor-icons/react'
import { typography } from '../../../styles/typography.js'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'

const FeaturedDestination = ({
  country,
  title,
  heading,
  description,
  cta,
  activities,
  image,
  imageAlt,
  href = '#',
}) => (
  <article className="group relative overflow-hidden rounded-xl w-full min-h-[28rem] lg:w-[20.4rem] lg:min-w-[20.4rem] lg:h-[46.9rem] lg:shrink-0 cursor-pointer transition-shadow duration-300 ease-out hover:shadow-[0_12px_40px_rgba(0,37,60,0.3)] motion-reduce:transition-none motion-reduce:hover:shadow-none">
    <img
      src={image}
      alt={imageAlt}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
    />
    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,37,60,0.3)_0%,rgba(0,37,60,0.15)_40%,rgba(0,37,60,0.7)_70%,rgba(0,37,60,0.95)_100%)]" />

    <div className="absolute top-6 start-5 flex flex-col gap-1 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 motion-reduce:transition-none">
      <p className={`${typography.body} font-semibold text-50 m-0`}>{country}</p>
      <p className={`${typography.itemTitle} font-semibold text-50 m-0`}>{title}</p>
    </div>

    <div className="absolute inset-x-5 bottom-6 flex flex-col gap-6 transition-transform duration-300 ease-out group-hover:-translate-y-1 motion-reduce:transition-none">
      <div className="flex flex-col gap-4">
        <h3 className={`${typography.body} font-semibold text-50 m-0`}>{heading}</h3>
        <p className={`${typography.caption} text-50 m-0 leading-relaxed`}>{description}</p>
      </div>
      <div className="flex flex-col gap-3">
        <LocalizedLink
          href={href}
          className={`${typography.caption} font-semibold text-50 bg-primary-1 group-hover:bg-[#007A9E] no-underline rounded-lg px-4 py-2.5 text-center transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.97] motion-reduce:transition-none motion-reduce:hover:scale-100`}
        >
          {cta}
        </LocalizedLink>
        <LocalizedLink
          href={href}
          className={`${typography.body} font-semibold text-50 inline-flex items-center justify-center gap-2 no-underline transition-transform duration-200 hover:translate-x-1.5 rtl:hover:-translate-x-1.5 motion-reduce:hover:translate-x-0`}
        >
          {activities}
          <ArrowRight size={16} weight="bold" className="rtl:-scale-x-100" />
        </LocalizedLink>
      </div>
    </div>
  </article>
)

export default FeaturedDestination
