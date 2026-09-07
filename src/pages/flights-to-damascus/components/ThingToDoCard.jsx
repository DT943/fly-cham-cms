import { ArrowRight } from '@phosphor-icons/react'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'

const ThingToDoCard = ({ badge, badgeIcon: BadgeIcon, title, description, cta, image, imageAlt, href = '#' }) => (
  <article className="group relative h-[403px] overflow-hidden rounded-2xl">
    <img
      src={image}
      alt={imageAlt}
      className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
    />
    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,37,60,0)_45%,#00253c_100%)]" />

    <span className="absolute start-[17px] top-[21px] inline-flex items-center justify-center gap-2.5 rounded-[35px] border border-solid border-50 bg-[rgba(29,27,32,0.1)] px-2.5 py-1 backdrop-blur-[6.35px]">
      <span className="text-base font-semibold leading-[19px] text-white">{badge}</span>
      <BadgeIcon size={24} className="shrink-0 text-white" />
    </span>

    <div className="absolute inset-x-[17px] bottom-[18px] flex flex-col items-end">
      <div className="flex w-full flex-col">
        <h3 className="m-0 text-xl font-semibold text-secondary-700">{title}</h3>
        <p className="m-0 text-sm leading-[1.4] text-50">{description}</p>
      </div>
      <LocalizedLink
        href={href}
        className="inline-flex items-center gap-[5px] no-underline transition-transform duration-200 ease-out hover:translate-x-1 rtl:hover:-translate-x-1 motion-reduce:transition-none motion-reduce:hover:translate-x-0"
      >
        <span className="grid size-8.5 shrink-0 place-items-center rounded-full bg-50">
          <ArrowRight size={16} weight="bold" className="text-primary-1 rtl:-scale-x-100" />
        </span>
        <span className="text-base font-semibold leading-[19px] text-50">{cta}</span>
      </LocalizedLink>
    </div>
  </article>
)

export default ThingToDoCard
