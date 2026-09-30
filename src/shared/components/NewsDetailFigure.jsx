const IMAGE_RADIUS = {
  none: 'rounded-none',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
}

/**
 * Closing media panel: muted looping video when provided, otherwise a still.
 * Media comes only from the CMS; with neither a video nor an image nothing
 * is rendered.
 */
const NewsDetailFigure = ({
  image,
  imageAlt = '',
  video,
  poster,
  imageRadius = 'xl',
}) => {
  const src = image
  if (!video && !src) return null
  const radiusClass = IMAGE_RADIUS[imageRadius] || IMAGE_RADIUS.xl

  return (
    <figure className={`mb-8 overflow-hidden md:mb-10 ${radiusClass}`}>
      {video ? (
        <video
          className="aspect-[122/63] w-full object-cover"
          src={video}
          poster={poster || src || undefined}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={imageAlt}
        />
      ) : (
        <img src={src} alt={imageAlt} className="aspect-[122/63] w-full object-cover" />
      )}
    </figure>
  )
}

export default NewsDetailFigure
