import { getSection } from '../sections/sectionRegistry.js'

/** Render a single CMS block by its `sectionId`, or nothing if unregistered. */
const BlockRenderer = ({ block, lang }) => {
  const section = getSection(block.sectionId)

  if (!section) {
    if (import.meta.env.DEV) {
      console.warn(
        `[new-help] No component registered for sectionId "${block.sectionId}"`,
      )
    }
    return null
  }

  const { Component, mapProps } = section
  return <Component {...mapProps(block, lang)} />
}

export default BlockRenderer
