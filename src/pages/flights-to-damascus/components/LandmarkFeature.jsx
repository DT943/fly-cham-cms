import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Container from '../../../shared/components/Container.jsx'
import ThumbnailCarousel from './ThumbnailCarousel.jsx'

/**
 * One landmark block: a white card with the landmark photo and copy side by side,
 * closed by the shared thumbnail carousel. `imageStart` puts the photo on the
 * leading (start) side instead of the trailing side, so sections alternate.
 */
const LandmarkFeature = ({ id, image, imageStart = false, thumbnails = [] }) => {
  const { t } = useTranslation()
  const slides = thumbnails.length > 0 ? thumbnails : [image]
  const [active, setActive] = useState(0)
  const banner = slides[active] || image
  const title = t(`flightsToDamascus.landmarks.${id}.title`)
  const description = t(`flightsToDamascus.landmarks.${id}.description`)
  const imageAlt = t(`flightsToDamascus.landmarks.${id}.imageAlt`)

  return (
    <section id={id} className="bg-50 scroll-mt-28">
      <Container className="flex flex-col gap-8 py-10 md:py-14 lg:gap-10 lg:py-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-28">
          <img
            src={banner}
            alt={imageAlt}
            className={`h-64 w-full shrink-0 rounded-2xl object-cover sm:h-80 lg:h-[454px] lg:w-[55%] ${
              imageStart ? '' : 'lg:order-2'
            }`}
          />
          <div className={`flex w-full flex-col gap-4 lg:gap-6 ${imageStart ? '' : 'lg:order-1'}`}>
            <h2 className="m-0 text-2xl font-semibold text-700 sm:text-3xl lg:text-[40px]">{title}</h2>
            <p className="m-0 text-sm leading-[1.6] text-700 sm:text-base">{description}</p>
          </div>
        </div>
        <ThumbnailCarousel
          images={slides}
          active={active}
          onSelect={setActive}
          altPrefix={imageAlt}
        />
      </Container>
    </section>
  )
}

export default LandmarkFeature
