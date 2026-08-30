import { Fragment } from 'react'

const Breadcrumbs = ({ items = [] }) => (
  <nav className="flex items-center gap-2 font-montserrat text-sm" aria-label="Breadcrumb">
    {items.map((item, index) => (
      <Fragment key={`${item.label}-${index}`}>
        {index > 0 && <span className="text-[#5f5f5c] font-bold">/</span>}
        {item.href ? (
          <a href={item.href} className="text-[#5f5f5c] font-bold hover:underline">
            {item.label}
          </a>
        ) : (
          <span className="text-[#006080] font-semibold">{item.label}</span>
        )}
      </Fragment>
    ))}
  </nav>
)

export default Breadcrumbs
