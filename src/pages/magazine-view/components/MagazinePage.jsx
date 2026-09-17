import { forwardRef } from 'react'

const MagazinePage = forwardRef(({ src, alt, pageNumber, isCover = false }, ref) => (
  <div
    ref={ref}
    data-density={isCover ? 'hard' : 'soft'}
    className="magazine-page relative h-full w-full overflow-hidden bg-background"
  >
    <img
      src={src}
      alt={alt}
      draggable={false}
      className="pointer-events-none size-full select-none object-cover"
    />
    <span className="pointer-events-none absolute inset-e-3 bottom-3 rounded bg-secondary-2/70 px-2 py-0.5 text-xs text-50">
      {pageNumber}
    </span>
  </div>
))

MagazinePage.displayName = 'MagazinePage'

export default MagazinePage
