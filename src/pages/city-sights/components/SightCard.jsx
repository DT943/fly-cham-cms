const SightCard = ({ name, location, tags, image, imageAlt }) => (
  <article className="group relative flex h-75 flex-col justify-end overflow-hidden rounded-2xl p-4">
    <img
      src={image}
      alt={imageAlt}
      className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
    />
    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,37,60,0)_45%,#00253c_100%)]" />

    <div className="relative flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h3 className="m-0 text-xl font-semibold text-secondary-700">{name}</h3>
        <p className="m-0 text-sm font-normal text-[#e2e8f0]">{location}</p>
      </div>

      <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
        {tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold text-white"
          >
            {tag}
          </li>
        ))}
      </ul>
    </div>
  </article>
)

export default SightCard
