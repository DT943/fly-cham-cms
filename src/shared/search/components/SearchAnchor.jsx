import { searchHitId } from '../utils/searchHit.js'

const SearchAnchor = ({
  hit,
  id,
  as: Component = 'div',
  className = '',
  children,
  ...props
}) => (
  <Component
    id={id || (hit ? searchHitId(hit) : undefined)}
    className={`scroll-mt-28 ${className}`.trim()}
    {...props}
  >
    {children}
  </Component>
)

export default SearchAnchor
