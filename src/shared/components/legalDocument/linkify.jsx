const linkClass =
  'font-medium text-primary-1 no-underline hover:underline break-words'

/**
 * Turn raw text into React nodes, auto-linking e-mail addresses and http(s)
 * URLs. Trailing sentence punctuation is kept out of URL links.
 */
export function linkify(text) {
  if (!text) return text
  const regex = /(https?:\/\/[^\s]+|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g
  const nodes = []
  let lastIndex = 0
  let match
  let key = 0

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index))

    let token = match[0]
    let trailing = ''
    const isEmail = token.includes('@')
    if (!isEmail) {
      const trimmed = token.replace(/[.,;:)\]]+$/, '')
      trailing = token.slice(trimmed.length)
      token = trimmed
    }

    const href = isEmail ? `mailto:${token}` : token
    nodes.push(
      <a
        key={key++}
        href={href}
        className={linkClass}
        {...(isEmail ? {} : { target: '_blank', rel: 'noreferrer' })}
      >
        {token}
      </a>,
    )
    if (trailing) nodes.push(trailing)
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex))
  return nodes
}

export { linkClass }
