/**
 * Default site image: always lazy-loads and decodes off the main thread.
 * Use for CMS / content media so every component gets the same behavior.
 */
export default function LazyImage({
  loading = 'lazy',
  decoding = 'async',
  alt = '',
  ...props
}) {
  return <img alt={alt} loading={loading} decoding={decoding} {...props} />
}
