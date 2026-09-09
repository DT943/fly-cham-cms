import Container from '../../../shared/components/Container.jsx'

const DestinationHero = ({ title, country, image, imageAlt }) => (
  <section className="relative isolate overflow-hidden h-70 sm:h-90 md:h-110 lg:h-125">
    <img
      src={image}
      alt={imageAlt}
      className="absolute inset-0 size-full object-cover object-[center_38%]"
    />
    <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-primary-1 to-transparent to-[82%] rtl:bg-linear-to-l" />

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

export default DestinationHero
