import { typography } from '../../../styles/typography.js'
import heroPhoto from '../../../assets/images/our-destenations/ph1.png'

const DestinationsHero = ({ title, subtitle, imageAlt }) => (
  <section className="relative overflow-hidden bg-100">
    <div className="relative z-10 mx-auto w-full max-w-page px-4 sm:px-8 md:px-10 xl:px-0">
      <div className="flex flex-col justify-center gap-2 md:gap-4 py-8 md:py-14 lg:py-16 md:min-h-[20rem] lg:min-h-[24rem] md:w-[46%] lg:w-[42%]">
        <h1 className={`${typography.pageTitle} font-bold text-primary-1 leading-tight m-0`}>
          {title}
        </h1>
        {subtitle && (
          <p className={`${typography.sectionDescription} font-medium text-600 m-0`}>
            {subtitle}
          </p>
        )}
      </div>

      <img
        src={heroPhoto}
        alt={imageAlt}
        className="md:hidden w-full h-auto rounded-2xl object-cover object-[center_30%] aspect-[380/180] mb-6"
      />
    </div>

    <div className="hidden md:block absolute inset-y-0 end-0 w-[58%] lg:w-[80%] pointer-events-none">
      <img
        src={heroPhoto}
        alt=""
        className="w-full h-full object-cover object-[72%_center]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-100 from-0% via-100/75 via-[18%] to-transparent to-[48%] rtl:bg-gradient-to-l" />
    </div>
  </section>
)

export default DestinationsHero
