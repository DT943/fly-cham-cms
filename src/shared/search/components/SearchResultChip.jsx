import { typography } from '../../../styles/typography.js'

const SearchResultChip = ({ type, label }) => {
  const isFaq = type === 'faq'

  return (
    <span
      className={`${typography.caption} shrink-0 rounded-full px-2.5 py-0.5 font-medium ${
        isFaq ? 'bg-primary-1/15 text-primary-1' : 'bg-200 text-700'
      }`}
    >
      {label}
    </span>
  )
}

export default SearchResultChip
