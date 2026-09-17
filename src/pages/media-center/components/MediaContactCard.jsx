import { typography } from '../../../styles/typography.js'

const MediaContactCard = ({ icon: Icon, title, description, department, location, email }) => (
  <article className="flex h-full flex-col rounded-2xl border border-200 bg-background p-6 shadow-[0px_4px_6px_rgba(33,37,41,0.05)] md:p-8">
    <div className="flex items-center gap-3 md:gap-4">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-100 md:size-12">
        <Icon size={22} weight="regular" className="text-800" aria-hidden />
      </div>
      <h3 className={`m-0 font-semibold text-800 ${typography.itemTitle}`}>{title}</h3>
    </div>

    <div className="mt-5 flex flex-col gap-3 md:mt-6">
      <p className={`m-0 font-normal leading-relaxed text-700 ${typography.body}`}>{description}</p>
      {department ? (
        <p className={`m-0 font-normal leading-relaxed text-700 ${typography.body}`}>{department}</p>
      ) : null}
      {location ? (
        <p className={`m-0 font-normal leading-relaxed text-700 ${typography.body}`}>{location}</p>
      ) : null}
    </div>

    <div className="mt-6 border-t border-200 pt-5 md:mt-8 md:pt-6">
      <a
        href={`mailto:${email}`}
        className={`font-semibold text-primary-1 underline underline-offset-2 ${typography.body}`}
      >
        {email}
      </a>
    </div>
  </article>
)

export default MediaContactCard
