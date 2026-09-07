import { ArrowRight } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'
import bannerBg from '../../../assets/images/city-sights/magazine-bg.png'
import cover from '../../../assets/images/city-sights/magazine-cover.jpg'
import spreadOne from '../../../assets/images/city-sights/magazine-spread-1.jpg'
import spreadTwo from '../../../assets/images/city-sights/magazine-spread-2.jpg'

/**
 * Cover plus two stacked spreads. `compact` is the reduced scale used inside the
 * copy column below lg; the full design size renders beside the copy at lg. The
 * caller supplies the display utility so the two placements can toggle cleanly.
 */
const MagazineCluster = ({ compact = false, className = '' }) => {
  const coverSize = compact ? 'h-36 w-27 rounded-md md:h-52 md:w-39' : 'h-78.5 w-59.25 rounded-lg'
  const spreadSize = compact
    ? 'h-17.5 w-14.5 rounded-md md:h-25.5 md:w-21.5'
    : 'h-38 w-32 rounded-lg'
  const gap = compact ? 'gap-1.5 md:gap-2' : 'gap-2.5'

  return (
    <div
      className={`pointer-events-none shrink-0 items-center ${compact ? 'justify-center' : ''} ${gap} ${className}`}
    >
      <img src={cover} alt="" className={`${coverSize} object-cover`} />
      <div className={`flex flex-col ${gap}`}>
        <img src={spreadOne} alt="" className={`${spreadSize} object-cover`} />
        <img src={spreadTwo} alt="" className={`${spreadSize} object-cover`} />
      </div>
    </div>
  )
}

const MagazineBanner = () => {
  const { t } = useTranslation()

  return (
    <section className="relative isolate overflow-hidden rounded-xl bg-primary-1 lg:h-90">
      {/*
        The photo is blurred directly rather than through a backdrop-filter on the
        gradient: the result is identical (the only thing behind that layer is this
        image over a flat fill), and it avoids the backdrop layer failing to repaint
        the lower half of the banner when the section resizes. `scale-125` pushes the
        blur's faded edges outside the clip so no seam shows — it needs to clear the
        23px radius on the short side, which is only 360px tall at lg.
      */}
      <div className="pointer-events-none absolute inset-0">
        <img
          src={bannerBg}
          alt=""
          className="absolute inset-0 size-full scale-105 object-cover opacity-90 blur-[3px]"
        />
        {/*
          The gradient stays solid across the copy so the white text keeps its
          contrast, then drops to 25% so the photo actually reads on the artwork
          side. Figma's own values (50% image under a 23px blur and a wash that is
          still ~80% opaque at the right edge) render as a flat teal fill.
        */}
        <div className="absolute inset-0 bg-linear-to-r from-[#01263b] from-28% to-[#01263b]/25 rtl:bg-linear-to-l" />
      </div>

      {/*
        Row at lg so the copy can never run under the artwork: the text is a
        shrinkable flex item capped at the design's 640px, the images are fixed.
      */}
      <div className="relative flex h-full flex-col justify-center gap-6 px-6 py-10 md:px-10 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:py-0 lg:ps-16 lg:pe-11.5">
        <div className="flex flex-col gap-6 lg:min-w-0 lg:max-w-160">
          <div className="flex flex-col gap-3 text-50">
            <h2 className="m-0 text-2xl font-semibold sm:text-3xl lg:text-4xl">
              {t('citySights.magazine.title')}
            </h2>
            <p className="m-0 text-base font-normal leading-6 md:text-lg">
              {t('citySights.magazine.description')}
            </p>
          </div>

          <MagazineCluster compact className="flex lg:hidden" />

          <LocalizedLink
            href="#"
            className="flex h-14 w-full items-center justify-center gap-2.5 rounded-lg bg-secondary px-4 text-base font-semibold text-white no-underline transition-colors hover:bg-secondary-800 md:text-lg lg:w-fit"
          >
            {t('citySights.magazine.cta')}
            <ArrowRight size={29} className="shrink-0 rtl:-scale-x-100" />
          </LocalizedLink>
        </div>

        <MagazineCluster className="hidden lg:flex" />
      </div>
    </section>
  )
}

export default MagazineBanner
