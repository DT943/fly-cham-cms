import { typography } from '../../../styles/typography.js'

const SearchResultChip = ({ label }) => (
  <span
    className={`${typography.caption} shrink-0 rounded-full px-2.5 py-0.5 font-medium bg-primary-100 text-primary-1`}
  >
    {label}
  </span>
)

export default SearchResultChip
