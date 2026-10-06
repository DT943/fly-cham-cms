import { typography } from '../../../styles/typography.js'

const SearchResultChip = ({ label }) => (
  <span
    className={`${typography.caption} shrink-0 rounded-full bg-primary-1/10 px-3 py-1 font-medium text-primary-1`}
  >
    {label}
  </span>
)

export default SearchResultChip
