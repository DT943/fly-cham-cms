import Button from './Button.jsx'
import { typography } from '../../styles/typography.js'
import defaultImage from '../../assets/images/help/ph1.png'

const CtaBanner = ({ title, description, cta, href, image = defaultImage }) => (
  <section
    className="relative rounded-2xl overflow-hidden w-full min-h-[220px] sm:min-h-[360px] md:min-h-[400px] bg-cover bg-no-repeat bg-center md:bg-center flex items-center px-5 py-8 sm:px-12 md:px-20 md:py-16"
    style={{ backgroundImage: `url(${image})` }}
  >
    <div className="absolute inset-0 z-[1] ltr:bg-[linear-gradient(to_right,#054E72_0%,#054E72_40%,rgb(5_78_114/0)_100%)] rtl:bg-[linear-gradient(to_left,#054E72_0%,#054E72_40%,rgb(5_78_114/0)_100%)] md:ltr:bg-[linear-gradient(to_right,#054E72_0%,rgb(5_78_114/0)_100%)] md:rtl:bg-[linear-gradient(to_left,#054E72_0%,rgb(5_78_114/0)_100%)]" />

    <div className="relative z-[2] flex flex-col gap-4 md:gap-6 max-w-xl">
      <h2 className={`${typography.sectionTitle} font-semibold text-50 m-0`}>
        {title}
      </h2>
      <p className={`${typography.sectionDescription} font-medium text-50 m-0 leading-relaxed`}>
        {description}
      </p>
      <Button href={href}>{cta}</Button>
    </div>
  </section>
)

export default CtaBanner
