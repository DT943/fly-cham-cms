import fallbackImage from '../../assets/images/our-destenations/damascus.jpeg'

const IMAGE_RADIUS = {
  none: 'rounded-none',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
}

/**
 * Closing media panel: muted looping video when provided, otherwise a still.
 */
const NewsDetailFigure = ({
  image,
  imageAlt = '',
  video,
  poster,
  imageRadius = 'xl',
}) => {
  const src = image || fallbackImage
  const radiusClass = IMAGE_RADIUS[imageRadius] || IMAGE_RADIUS.xl

  return (
    <figure className={`mb-8 overflow-hidden md:mb-10 ${radiusClass}`}>
      {video ? (
        <video
          className="aspect-[122/63] w-full object-cover"
          src={video}
          poster={poster || src}
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
