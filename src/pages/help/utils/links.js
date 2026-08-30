export function getLinkHref(link) {
  return link?.href || '#'
}

export function isLastIndex(index, items) {
  return index === items.length - 1
}
