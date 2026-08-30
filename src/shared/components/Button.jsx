const Button = ({ children, className = '', type = 'button', ...props }) => (
  <button
    type={type}
    className={`font-montserrat text-base md:text-lg font-semibold text-white bg-[#baa981] hover:bg-[#a89570] border-none rounded-lg px-8 py-4 w-fit cursor-pointer transition-colors ${className}`}
    {...props}
  >
    {children}
  </button>
)

export default Button
