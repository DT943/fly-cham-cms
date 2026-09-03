import { typography } from '../../../styles/typography.js'

const chipStyles = {
  faq: 'bg-primary-1/15 text-primary-1',
  form: 'bg-secondary/25 text-700',
  page: 'bg-200 text-700',
}

const SearchResultChip = ({ type, label }) => (
  <span
    className={`${typography.caption} shrink-0 rounded-full px-2.5 py-0.5 font-medium ${
      chipStyles[type] || chipStyles.page
    }`}
  >
    {label}
  </span>
)

export default SearchResultChip
