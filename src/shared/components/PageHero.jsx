import { typography } from '../../styles/typography.js'

const maskStyle = (mask) => ({
  WebkitMaskImage: `url(${mask})`,
  maskImage: `url(${mask})`,
  WebkitMaskSize: '100% 100%',
  maskSize: '100% 100%',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
  WebkitMaskPosition: 'center',
  maskPosition: 'center',
})

const PageHeroImage = ({ image, mask, imageAlt }) => (
  <div className="w-full">
    <img
      src={image}
      alt={imageAlt}
      className={`w-full h-auto rounded-2xl object-cover object-[center_20%] aspect-[380/180] ${mask ? 'md:hidden' : ''}`}
    />
    {mask && (
      <div
        className="hidden md:block w-full aspect-[573/330] rtl:-scale-x-100"
        style={maskStyle(mask)}
      >
        <div
          className="w-full h-full bg-cover bg-[position:center_20%] rtl:-scale-x-100"
          style={{ backgroundImage: `url(${image})` }}
          role="img"
          aria-label={imageAlt}
        />
      </div>
    )}
  </div>
)

const PageHero = ({ title, subtitle, image, mask, imageAlt = '' }) => (
  <section className={image ? 'flex flex-col md:flex-row md:items-center gap-5 md:gap-10 lg:gap-14' : 'flex flex-col gap-2 md:gap-4'}>
    {image && (
      <div className="order-1 md:order-2 md:w-1/2 lg:w-[54%] shrink-0">
        <PageHeroImage image={image} mask={mask} imageAlt={imageAlt} />
      </div>
    )}
    <div className={image ? 'order-2 md:order-1 flex-1 flex flex-col gap-2 md:gap-4' : 'flex flex-col gap-2 md:gap-4'}>
      <h1 className={`${typography.pageTitle} font-bold text-primary-1 leading-tight m-0`}>
        {title}
      </h1>
      {subtitle && (
        <p className={`${typography.sectionDescription} font-medium text-700 m-0`}>
          {subtitle}
        </p>
      )}
    </div>
  </section>
)

export default PageHero
