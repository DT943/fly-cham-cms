import { Fragment } from 'react'
import { typography } from '../../styles/typography.js'

const Breadcrumbs = ({ items = [] }) => (
  <nav className={`flex items-center gap-2 ${typography.caption}`} aria-label="Breadcrumb">
    {items.map((item, index) => (
      <Fragment key={`${item.label}-${index}`}>
        {index > 0 && <span className="text-600 font-bold">/</span>}
        {item.href ? (
          <a href={item.href} className={`${typography.caption} text-600 font-bold hover:underline`}>
            {item.label}
          </a>
        ) : (
          <span className={`${typography.caption} text-primary-1 font-semibold`}>{item.label}</span>
        )}
      </Fragment>
    ))}
  </nav>
)

export default Breadcrumbs
