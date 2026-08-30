const Button = ({ children, className = '', type = 'button', ...props }) => (
  <button
    type={type}
    className={`text-base md:text-lg font-semibold text-50 bg-secondary hover:bg-secondary-800 border-none rounded-lg px-8 py-4 w-fit cursor-pointer transition-colors ${className}`}
    {...props}
  >
    {children}
  </button>
)

export default Button
