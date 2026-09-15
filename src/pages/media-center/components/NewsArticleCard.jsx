import { ArrowRight, Clock } from '@phosphor-icons/react'
import { typography } from '../../../styles/typography.js'
import Button from '../../../shared/components/Button.jsx'

/**
 * Featured news card: image on the left, copy on the right at lg+.
 * Stacks with the image first on smaller screens.
 */
const NewsArticleCard = ({
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
  <article className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10 xl:gap-14">
    <div className="w-full overflow-hidden rounded-2xl lg:w-[min(48%,28rem)] lg:shrink-0 xl:w-[32.5rem]">
      <img
        src={image}
        alt={imageAlt}
        className="aspect-[4/3] w-full object-cover sm:aspect-[16/10] lg:aspect-[520/375]"
      />
    </div>

    <div className="flex min-w-0 flex-1 flex-col gap-4 md:gap-5">
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

      <div className="flex flex-col gap-3">
        <h3 className={`m-0 font-semibold text-primary-1 ${typography.itemTitle}`}>{title}</h3>
        <p className={`m-0 font-normal leading-relaxed text-700 ${typography.body}`}>{excerpt}</p>
      </div>

      <Button href={href} className="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-3.5">
        {cta}
        <ArrowRight size={16} weight="bold" className="text-btn rtl:-scale-x-100" />
      </Button>
    </div>
  </article>
)

export default NewsArticleCard
