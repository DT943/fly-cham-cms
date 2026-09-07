import { typography } from '../../styles/typography.js'
import LocalizedLink from './LocalizedLink.jsx'

const buttonClass = (className) =>
  `${typography.button} font-semibold text-btn bg-secondary hover:bg-secondary-800 border-none rounded-lg px-6 py-3 md:px-8 md:py-4 w-fit cursor-pointer transition-colors ${className}`

const Button = ({ children, className = '', type = 'button', href, ...props }) => {
  if (href) {
    return (
      <LocalizedLink
        href={href}
        className={`${buttonClass(className)} no-underline inline-flex items-center justify-center`}
        {...props}
      >
        {children}
      </LocalizedLink>
    )
  }

  return (
    <button type={type} className={buttonClass(className)} {...props}>
      {children}
    </button>
  )
}

export default Button
