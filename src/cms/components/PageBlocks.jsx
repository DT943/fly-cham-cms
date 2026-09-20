import BlockRenderer from './BlockRenderer.jsx'

// CMS blocks carry both `order` and `position`; sort by order, then position.
const byOrder = (a, b) =>
  (a.order ?? a.position ?? 0) - (b.order ?? b.position ?? 0)

/** Loop the page's blocks in order and render each through the section registry. */
const PageBlocks = ({ blocks = [], lang }) => (
  <>
    {[...blocks].sort(byOrder).map((block) => (
      <BlockRenderer key={block.uid} block={block} lang={lang} />
    ))}
  </>
)

export default PageBlocks
