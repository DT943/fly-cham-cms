const Container = ({ as: Tag = 'div', className = '', children, ...props }) => (
  <Tag
    className={`mx-auto w-full max-w-page px-4 sm:px-8 md:px-10 ${className}`}
    {...props}
  >
    {children}
  </Tag>
)

export default Container
