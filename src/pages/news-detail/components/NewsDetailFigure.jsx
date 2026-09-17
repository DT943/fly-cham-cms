const NewsDetailFigure = ({ image, imageAlt }) => (
  <figure className="mb-8 overflow-hidden rounded-2xl md:mb-10">
    <img src={image} alt={imageAlt} className="aspect-[16/9] w-full object-cover" />
  </figure>
)

export default NewsDetailFigure
