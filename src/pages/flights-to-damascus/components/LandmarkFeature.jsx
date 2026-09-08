import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Container from '../../../shared/components/Container.jsx'
import ThumbnailCarousel from './ThumbnailCarousel.jsx'

/**
 * One landmark block. The `dark` variant lays a frosted-glass copy card over a
 * full-bleed photo; the `light` variant is a sand-coloured split with the photo
 * and copy side by side. Both close with the shared thumbnail carousel.
 */
const LandmarkFeature = ({ id, variant, image, imageStart = false, thumbnails = [] }) => {
  const { t } = useTranslation()
  const slides = thumbnails.length > 0 ? thumbnails : [image]
  const [active, setActive] = useState(0)
  const banner = slides[active] || image
  const title = t(`flightsToDamascus.landmarks.${id}.title`)
  const description = t(`flightsToDamascus.landmarks.${id}.description`)
  const imageAlt = t(`flightsToDamascus.landmarks.${id}.imageAlt`)

  if (variant === 'light') {
    return (
      <section className="bg-secondary-200">
        <Container className="flex flex-col gap-8 py-10 md:py-14 lg:gap-10 lg:py-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
            <img
              src={banner}
              alt={imageAlt}
              className={`h-64 w-full shrink-0 rounded-2xl object-cover sm:h-80 lg:h-[440px] lg:w-[55%] ${
                imageStart ? '' : 'lg:order-2'
              }`}
            />
            <div className={`flex w-full flex-col gap-4 lg:gap-6 ${imageStart ? '' : 'lg:order-1'}`}>
              <h2 className="m-0 text-2xl font-semibold text-700 sm:text-3xl lg:text-4xl">{title}</h2>
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

  return (
    <section className="relative isolate overflow-hidden">
      <img src={banner} alt={imageAlt} className="absolute inset-0 size-full object-cover" />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-secondary-2 from-10% to-transparent to-90% rtl:bg-linear-to-l" />

      <Container className="relative flex min-h-[560px] flex-col justify-between gap-10 py-10 md:min-h-[680px] md:py-14 lg:min-h-[720px]">
        <div className="flex flex-1 items-center">
          <div className="flex w-full max-w-[600px] flex-col gap-4 rounded-2xl bg-[rgba(1,38,59,0.25)] p-4 backdrop-blur-[15px] sm:gap-6 sm:p-6">
            <h2 className="m-0 text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">{title}</h2>
            <p className="m-0 text-sm leading-[1.6] text-50 sm:text-base">{description}</p>
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
