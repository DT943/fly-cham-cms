import { getSection } from '../sectionRegistry.js'
import { pickStyle } from '../adapters/pick.js'

/** Render a single CMS block by its `sectionId`, or nothing if unregistered. */
const BlockRenderer = ({ block, lang }) => {
  const section = getSection(block.sectionId)

  if (!section) {
    if (import.meta.env.DEV) {
      console.warn(
        `[cms] No component registered for sectionId "${block.sectionId}"`,
      )
    }
    return null
  }

  // Style is per-language now; resolve it to the active locale's flat object
  // once here so every adapter keeps reading a flat `block.style`.
  const localizedBlock = { ...block, style: pickStyle(block.style, lang) }

  const { Component, mapProps } = section
  return <Component {...mapProps(localizedBlock, lang)} />
}

export default BlockRenderer
