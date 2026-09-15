import { Clock } from '@phosphor-icons/react'
import { typography } from '../../../styles/typography.js'
import NewsLearnMoreLink from './NewsLearnMoreLink.jsx'

const NewsGridCard = ({
  image,
  imageAlt,
  date,
  dateTime,
  category,
  title,
  excerpt,
  cta,
  href,
}) => (
  <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-200 bg-50 shadow-[0px_4px_6px_rgba(33,37,41,0.05)]">
    <img src={image} alt={imageAlt} className="aspect-[4/3] w-full object-cover" />

    <div className="flex flex-1 flex-col gap-3 p-5 md:gap-4 md:p-6">
      <div className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-600 ${typography.caption}`}>
        <span className="inline-flex items-center gap-1.5">
          <Clock size={16} weight="regular" className="shrink-0" aria-hidden />
          <time dateTime={dateTime}>{date}</time>
        </span>
        <span aria-hidden className="text-500">
          ·
        </span>
        <span
          className={`rounded-full bg-primary-1/10 px-3 py-1 font-medium text-primary-1 ${typography.caption}`}
        >
          {category}
        </span>
      </div>

      <h3 className={`m-0 font-semibold text-primary-1 ${typography.itemTitle}`}>{title}</h3>
      <p className={`m-0 flex-1 font-normal leading-relaxed text-700 ${typography.body}`}>
        {excerpt}
      </p>

      <div className="flex justify-end pt-1">
        <NewsLearnMoreLink href={href} label={cta} />
      </div>
    </div>
  </article>
)

export default NewsGridCard
