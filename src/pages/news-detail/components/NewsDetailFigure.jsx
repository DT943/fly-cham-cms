/**
 * Closing media panel. Renders a muted, looping, autoplaying video when the
 * article provides one (with a poster for the first frame / reduced-motion),
 * otherwise falls back to a still image. Matches the Figma 12px-radius panel.
 */
const NewsDetailFigure = ({ image, imageAlt, video, poster }) => (
  <figure className="mb-8 overflow-hidden rounded-xl md:mb-10">
    {video ? (
      <video
        className="aspect-[122/63] w-full object-cover"
        src={video}
        poster={poster || image}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={imageAlt}
      />
    ) : (
      <img src={image} alt={imageAlt} className="aspect-[122/63] w-full object-cover" />
    )}
  </figure>
)

export default NewsDetailFigure
