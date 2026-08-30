import { Fragment } from 'react'

const Breadcrumbs = ({ items = [] }) => (
  <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
    {items.map((item, index) => (
      <Fragment key={`${item.label}-${index}`}>
        {index > 0 && <span className="text-600 font-bold">/</span>}
        {item.href ? (
          <a href={item.href} className="text-600 font-bold hover:underline">
            {item.label}
          </a>
        ) : (
          <span className="text-primary-1 font-semibold">{item.label}</span>
        )}
      </Fragment>
    ))}
  </nav>
)

export default Breadcrumbs
