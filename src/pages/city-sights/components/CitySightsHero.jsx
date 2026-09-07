import { useTranslation } from 'react-i18next'
import Container from '../../../shared/components/Container.jsx'
import heroPhoto from '../../../assets/images/city-sights/hero.jpg'
import SightsSearch from './SightsSearch.jsx'

const CitySightsHero = () => {
  const { t } = useTranslation()

  return (
    <section className="relative isolate overflow-hidden md:h-125">
      <img
        src={heroPhoto}
        alt={t('citySights.hero.imageAlt')}
        className="absolute inset-0 size-full object-cover object-[center_38%]"
      />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-primary-1 to-transparent to-[82%] rtl:bg-linear-to-l" />
      {/* The design's single gradient only covers the copy at desktop widths; below
          md the text spans the full frame, so it needs a flat scrim to stay legible. */}
      <div className="pointer-events-none absolute inset-0 bg-secondary-2/35 md:hidden" />

      <Container className="relative flex h-full flex-col justify-end gap-8 py-10 md:gap-12 md:pb-9 md:pt-0">
        <div className="flex max-w-[43.5rem] flex-col gap-3">
          <h1 className="m-0 text-3xl font-semibold leading-tight text-50 sm:text-4xl md:text-5xl lg:text-[64px]">
            {t('citySights.hero.title')}
          </h1>
          <p className="m-0 max-w-[34.5rem] text-base font-normal text-50 md:text-xl">
            {t('citySights.hero.description')}
          </p>
        </div>

        <SightsSearch />
      </Container>
    </section>
  )
}

export default CitySightsHero
