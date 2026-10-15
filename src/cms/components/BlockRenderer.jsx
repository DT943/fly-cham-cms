import { useMemo } from 'react'
import { getSection } from '../sectionRegistry.js'
import { pickStyle } from '../adapters/pick.js'
import { applyMediaAlts } from '../mediaAlt.js'
import useMediaAltLookup from '../useMediaAlts.js'

/** Render a single CMS block by its `sectionId`, or nothing if unregistered. */
const BlockRenderer = ({ block, lang }) => {
  const section = getSection(block.sectionId)
  // Images take their alt from the media library (one alt per image, edited
  // in the cms2 Insert Media modal), whatever the block stored.
  const altLookup = useMediaAltLookup()
  const content = useMemo(
    () => applyMediaAlts(block.content, altLookup, lang),
    [block.content, altLookup, lang],
  )

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
  const localizedBlock = { ...block, content, style: pickStyle(block.style, lang) }

  const { Component, mapProps } = section
  return <Component {...mapProps(localizedBlock, lang)} />
}

export default BlockRenderer
