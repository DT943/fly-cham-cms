import { typography } from '../../styles/typography.js'

const Input = ({
  id,
  type = 'text',
  label = 'Input',
  placeholder = ' ',
  value,
  onChange,
  name,
  className = '',
  error,
  rows,
  transparentBg = false,
  ...props
}) => {
  const hasError = Boolean(error)
  const isTextarea = rows !== undefined
  const fieldId = id || name || 'floating-input'
  const bgClass = transparentBg ? 'bg-100/60 backdrop-blur-sm' : 'bg-background'
  const borderClass = hasError
    ? 'border border-alert'
    : 'border border-200 focus:!border-primary-1 focus-within:!border-primary-1'
  const textClass = hasError ? 'text-alert' : 'text-600'

  if (isTextarea) {
    return (
      <div className="relative w-full">
        <div className={`relative w-full ${bgClass} rounded-md ${borderClass}`}>
          <label
            htmlFor={fieldId}
            className={`block px-3 sm:px-4 pt-3 pb-1 ${typography.caption} overflow-hidden text-ellipsis whitespace-nowrap pointer-events-none transition duration-100 ease-in-out origin-top-left rtl:origin-top-right
              ${value ? 'scale-90 -translate-y-1 text-primary-1' : ''}
              ${hasError ? 'text-alert' : 'text-600'}`}
          >
            {label}
          </label>
          <textarea
            id={fieldId}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            rows={rows}
            aria-invalid={hasError}
            className={`block w-full px-3 sm:px-4 pb-2 ${typography.body} bg-transparent focus:outline-none focus:ring-0 resize-vertical ${textClass} ${className}`}
            {...props}
          />
        </div>
        {hasError && typeof error === 'string' && (
          <p className={`${typography.caption} text-alert m-0 mt-1`}>{error}</p>
        )}
      </div>
    )
  }

  return (
    <div className="relative w-full">
      <input
        id={fieldId}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        aria-invalid={hasError}
        className={`peer block w-full ${bgClass} rounded-md px-3 sm:px-4 pt-6 pb-2 ${typography.body} placeholder-transparent focus:outline-none focus:ring-0 h-14 md:h-auto ${borderClass} ${textClass} ${className}`}
        {...props}
      />
      <label
        htmlFor={fieldId}
        className={`absolute top-0 start-0 px-4 pt-4.5 ${typography.body} pointer-events-none transition duration-100 ease-in-out origin-top-left rtl:origin-top-right w-full overflow-hidden text-ellipsis whitespace-nowrap
          peer-disabled:opacity-50 peer-disabled:pointer-events-none
          peer-focus:scale-90 peer-focus:-translate-y-2
          peer-not-placeholder-shown:scale-90 peer-not-placeholder-shown:-translate-y-2
          ${hasError ? 'text-alert' : 'text-600'}
          peer-focus:text-primary-1
          peer-not-placeholder-shown:text-primary-1`}
      >
        {label}
      </label>
      {hasError && typeof error === 'string' && (
        <p className={`${typography.caption} text-alert m-0 mt-1`}>{error}</p>
      )}
    </div>
  )
}

export default Input
