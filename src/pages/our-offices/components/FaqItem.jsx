import { CaretDown } from '@phosphor-icons/react'
import { typography } from '../../../styles/typography.js'

const FaqItem = ({ question, answer }) => (
  <details className="group bg-background rounded-xl border border-200">
    <summary className={`${typography.itemTitle} font-medium text-700 m-0 flex items-center justify-between gap-4 cursor-pointer list-none px-4 py-4 md:px-6 md:py-5 [&::-webkit-details-marker]:hidden`}>
      <span className="min-w-0">{question}</span>
      <CaretDown
        size={18}
        weight="regular"
        className="shrink-0 text-700 font-medium transition-transform duration-200 group-open:rotate-180"
      />
    </summary>
    {answer && (
      <p className={`${typography.itemDescription} text-600 m-0 px-4 pb-4 md:px-6 md:pb-5 leading-relaxed`}>
        {answer}
      </p>
    )}
  </details>
)

export default FaqItem
