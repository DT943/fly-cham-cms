import Container from '../../shared/components/Container.jsx'
import BlockRenderer from './BlockRenderer.jsx'
import { getSection } from '../sectionRegistry.js'

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
const PageBlocks = ({ blocks = [], lang, className = '' }) => {
  const sorted = [...blocks].sort(byOrder)
  // A leading full-bleed block (e.g. a hero) should sit flush under the page
  // header instead of below an empty top-padding band.
  const leadFullBleed = Boolean(getSection(sorted[0]?.sectionId)?.fullBleed)
  const paddingClass = leadFullBleed ? 'pb-5 md:pb-10' : 'py-5 md:py-10'

  return (
    <div className={`flex flex-col gap-6 md:gap-8 ${paddingClass} ${className}`.trim()}>
      {sorted.map((block) => {
        const section = getSection(block.sectionId)
        const rendered = <BlockRenderer key={block.uid} block={block} lang={lang} />
        // Unregistered (renders null) or full-bleed → no Container wrapper.
        if (!section || section.fullBleed) return rendered
        return <Container key={block.uid}>{rendered}</Container>
      })}
    </div>
  )
}

export default PageBlocks
