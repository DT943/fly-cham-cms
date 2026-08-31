import { typography } from '../../styles/typography.js'

const PromoBanner = ({ title, description, cta, href = '#', image, imageAlt }) => (
  <section className="relative rounded-2xl overflow-hidden w-full min-h-[200px] sm:min-h-[240px] md:min-h-[280px] flex items-center px-5 py-8 sm:px-10 md:px-14 md:py-12">
    <img
      src={image}
      alt={imageAlt}
      className="absolute inset-0 w-full h-full object-cover object-center"
    />
    <div className="absolute inset-0 z-[1] ltr:bg-[linear-gradient(to_right,#0B2A4A_0%,rgb(11_42_74/0.8)_42%,rgb(11_42_74/0)_100%)] rtl:bg-[linear-gradient(to_left,#0B2A4A_0%,rgb(11_42_74/0.8)_42%,rgb(11_42_74/0)_100%)]" />
    <div className="relative z-[2] flex flex-col gap-3 md:gap-5 max-w-xl">
      <h2 className={`${typography.sectionTitle} font-bold text-50 m-0`}>
        {title}
      </h2>
      <p className={`${typography.sectionDescription} text-50 m-0 leading-relaxed`}>
        {description}
      </p>
      <a
        href={href}
        className={`${typography.button} font-semibold text-50 bg-secondary hover:bg-secondary-800 no-underline rounded-lg px-6 py-3 md:px-8 md:py-3.5 w-fit`}
      >
        {cta}
      </a>
    </div>
  </section>
)

export default PromoBanner
