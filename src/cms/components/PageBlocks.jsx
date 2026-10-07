import Container from '../../shared/components/Container.jsx'
import BlockRenderer from './BlockRenderer.jsx'
import { getSection } from '../sectionRegistry.js'
import { pickStyle } from '../adapters/pick.js'

/**
 * A registry entry's `fullBleed` is either a boolean or a function of the
 * block's (language-resolved) style — e.g. newsletter-signup is full-bleed only
 * in its `photo` variant.
 */
const isFullBleed = (section, block, lang) => {
  if (!section) return false
  if (typeof section.fullBleed === 'function') {
    return Boolean(section.fullBleed(pickStyle(block.style, lang) || {}))
  }
  return Boolean(section.fullBleed)
}

// CMS blocks carry both `order` and `position`; sort by order, then position.
const byOrder = (a, b) =>
  (a.order ?? a.position ?? 0) - (b.order ?? b.position ?? 0)

/**
 * Loop the page's blocks in order and render each through the section registry.
 *
 * Owns the page layout so blocks can control their own width: normal blocks are
 * wrapped in the max-w-page `Container`, while sections flagged `fullBleed` in
 * the registry (e.g. page-media-hero) render bare so they span the full width of
 * the page — matching the static pages, without any viewport-width hack.
 */
/**
 * `flushBottom`: when the last block is full-bleed (e.g. a newsletter photo
 * band), drop the bottom padding so it sits directly on the footer.
 * `gapClass`: override the vertical spacing between blocks for a page whose
 * design uses a different rhythm (e.g. Travel Updates). The default matches
 * the page builder canvas: 32px, then 60px from the md breakpoint.
 */
const PageBlocks = ({
  blocks = [],
  lang,
  className = '',
  flushBottom = false,
  gapClass = 'gap-8 md:gap-[60px]',
}) => {
  const sorted = [...blocks].sort(byOrder)
  // A leading full-bleed block (e.g. a hero) should sit flush under the page
  // header instead of below an empty top-padding band.
  const leadFullBleed = sorted[0]
    ? isFullBleed(getSection(sorted[0].sectionId), sorted[0], lang)
    : false
  const last = sorted[sorted.length - 1]
  const trailFullBleed =
    flushBottom && last ? isFullBleed(getSection(last.sectionId), last, lang) : false
  const topClass = leadFullBleed ? '' : 'pt-5 md:pt-10'
  const bottomClass = trailFullBleed ? '' : 'pb-5 md:pb-10'
  const paddingClass = `${topClass} ${bottomClass}`.trim()

  return (
    <div className={`flex flex-col ${gapClass} ${paddingClass} ${className}`.trim()}>
      {sorted.map((block) => {
        const section = getSection(block.sectionId)
        const rendered = <BlockRenderer key={block.uid} block={block} lang={lang} />
        // Unregistered (renders null) or full-bleed → no Container wrapper.
        if (!section || isFullBleed(section, block, lang)) return rendered
        return <Container key={block.uid}>{rendered}</Container>
      })}
    </div>
  )
}

export default PageBlocks
