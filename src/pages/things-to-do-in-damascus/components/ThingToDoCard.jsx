import { typography } from '../../../styles/typography.js'

const ThingToDoCard = ({ badge, badgeIcon: BadgeIcon, title, description, image, imageAlt }) => (
  <article className="group relative h-100 overflow-hidden rounded-2xl">
    <img
      src={image}
      alt={imageAlt}
      className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
    />
    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-secondary-2 from-0% via-secondary-2/80 via-30% to-transparent to-55%" />

    <span className="absolute start-4 top-5 inline-flex items-center gap-2 rounded-full border border-solid border-50 bg-secondary-2/10 px-2.5 py-1 backdrop-blur-sm">
      <span className={`${typography.caption} font-semibold text-50`}>{badge}</span>
      <BadgeIcon size={18} className="shrink-0 text-50" />
    </span>

    <div className="absolute inset-x-4 bottom-5 flex flex-col gap-1">
      <h3 className={`${typography.itemTitle} m-0 font-semibold text-secondary`}>{title}</h3>
      {description ? (
        <p className={`${typography.itemDescription} m-0 leading-relaxed text-50`}>{description}</p>
      ) : null}
    </div>
  </article>
)

export default ThingToDoCard
