import { typography } from '../../styles/typography.js'
import SearchAnchor from '../search/components/SearchAnchor.jsx'
import FaqItem from './FaqItem.jsx'
import LocalizedLink from './LocalizedLink.jsx'

const Faqs = ({ title, items = [], browseLabel, browseHref = '#' }) => (
  <section className="flex flex-col gap-4 md:gap-6">
    {title && (
      <h2 className={`${typography.sectionTitle} font-semibold text-700 m-0`}>
        {title}
      </h2>
    )}
    <div className="flex flex-col gap-3 md:gap-4">
      {items.map((item) => {
        const faqItem = (
          <FaqItem
            question={item.question}
            answer={item.answer}
            extra={item.extra}
          />
        )

        if (!item.hit) {
          return <div key={item.id}>{faqItem}</div>
        }

        return (
          <SearchAnchor key={item.id} hit={item.hit}>
            {faqItem}
          </SearchAnchor>
        )
      })}
    </div>
    {browseLabel && (
      <div className="flex justify-center pt-1 md:pt-2">
        <LocalizedLink
          href={browseHref}
          className={`${typography.button} font-semibold text-50 bg-secondary hover:bg-secondary-800 no-underline rounded-lg px-8 py-3 md:px-10 md:py-3.5`}
        >
          {browseLabel}
        </LocalizedLink>
      </div>
    )}
  </section>
)

export default Faqs
