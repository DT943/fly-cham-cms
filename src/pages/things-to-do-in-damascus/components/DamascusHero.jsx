import Container from '../../../shared/components/Container.jsx'
import useCurrentLanguage from '../../../shared/hooks/useCurrentLanguage.js'

const DestinationHero = ({ title, country, image, imageAlt }) => {
  const isRtl = useCurrentLanguage() === 'ar'

  return (
    <section className="relative isolate overflow-hidden h-70 sm:h-90 md:h-110 lg:h-125">
      <img
        src={image}
        alt={imageAlt}
        className="absolute inset-0 size-full object-cover object-[center_38%]"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          // Figma: linear-gradient(90deg, #006080 0%, rgba(0,0,0,0) 100%)
          backgroundImage: `linear-gradient(${
            isRtl ? 270 : 90
          }deg, var(--color-primary-1, #006080) 0%, rgba(0, 0, 0, 0) 100%)`,
        }}
        aria-hidden
      />

      <Container className="relative flex h-full flex-col justify-center">
        <div className="flex max-w-140 flex-col gap-2 md:gap-3">
          <h1 className="m-0 text-3xl font-semibold leading-tight text-50 sm:text-4xl md:text-5xl">
            {title}
          </h1>
          <p className="m-0 text-base font-semibold text-50 md:text-xl">{country}</p>
        </div>
      </Container>
    </section>
  )
}

export default DestinationHero
