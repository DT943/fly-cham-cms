import { ArrowRight } from '@phosphor-icons/react'
import { CMS_TEXT_HOVER_CLASS, getTextStyleVars, colorVar } from '../../styles/cmsStyle.js'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'
import defaultBg from '../../assets/images/city-sights/magazine-bg.png'
import defaultCover from '../../assets/images/city-sights/magazine-cover.jpg'
import defaultSpread1 from '../../assets/images/city-sights/magazine-spread-1.jpg'
import defaultSpread2 from '../../assets/images/city-sights/magazine-spread-2.jpg'

const MagazineCluster = ({ cover, spread1, spread2, compact = false, className = '' }) => {
  const coverSize = compact ? 'h-36 w-27 rounded-md md:h-52 md:w-39' : 'h-78.5 w-59.25 rounded-lg'
  const spreadSize = compact ? 'h-17.5 w-14.5 rounded-md md:h-25.5 md:w-21.5' : 'h-38 w-32 rounded-lg'
  const gap = compact ? 'gap-1.5 md:gap-2' : 'gap-2.5'

  return (
    <div className={`pointer-events-none shrink-0 items-center ${compact ? 'justify-center' : ''} ${gap} ${className}`}>
      <img src={cover} alt="" className={`${coverSize} object-cover`} />
      <div className={`flex flex-col ${gap}`}>
        <img src={spread1} alt="" className={`${spreadSize} object-cover`} />
        <img src={spread2} alt="" className={`${spreadSize} object-cover`} />
      </div>
    </div>
  )
}

/**
 * Magazine promo banner. Defaults reproduce the static city-sights banner; the
 * CMS (via the section registry) overrides the copy, CTA, images, colours and
 * backlinks.
 */
const MagazineBanner = ({
  title = '',
  description = '',
  cta = '',
  href = '/magazine-view',
  bg,
  cover,
  spread1,
  spread2,
  bannerBg = 'primary-1',
  titleColor = '50',
  titleFontWeight = 'semibold',
  titleColorHover,
  titleFontWeightHover,
  descriptionColor = '50',
  descriptionFontWeight = 'normal',
  descriptionColorHover,
  descriptionFontWeightHover,
  buttonBg = 'secondary',
  buttonHoverBg = 'secondary-800',
  buttonText = 'btn',
  buttonTextFontWeight = 'semibold',
  buttonTextHover,
  buttonTextFontWeightHover,
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
}) => {
  const bgSrc = bg || defaultBg
  const coverSrc = cover || defaultCover
  const spread1Src = spread1 || defaultSpread1
  const spread2Src = spread2 || defaultSpread2

  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }
  const titleStyleKeys = { titleColor, titleFontWeight, titleColorHover, titleFontWeightHover }
  const descStyleKeys = {
    descriptionColor,
    descriptionFontWeight,
    descriptionColorHover,
    descriptionFontWeightHover,
  }
  const buttonStyleKeys = { buttonText, buttonTextFontWeight, buttonTextHover, buttonTextFontWeightHover }

  return (
    <section
      className="relative isolate overflow-hidden rounded-xl lg:h-90"
      style={{ backgroundColor: colorVar(bannerBg) }}
    >
      <div className="pointer-events-none absolute inset-0">
        <img src={bgSrc} alt="" className="absolute inset-0 size-full scale-105 object-cover opacity-90 blur-[3px]" />
        <div className="absolute inset-0 bg-linear-to-r from-[#01263b] from-28% to-[#01263b]/25 rtl:bg-linear-to-l" />
      </div>

      <div className="relative flex h-full flex-col justify-center gap-6 px-6 py-10 md:px-10 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:py-0 lg:ps-16 lg:pe-11.5">
        <div className="flex flex-col gap-6 lg:min-w-0 lg:max-w-160">
          <div className="flex flex-col gap-3">
            <h2
              className={`m-0 text-2xl sm:text-3xl lg:text-4xl ${CMS_TEXT_HOVER_CLASS}`}
              style={getTextStyleVars(titleStyleKeys, 'titleColor', '50', 'semibold')}
            >
              <LinkedText text={title} {...linkProps} />
            </h2>
            <p
              className={`m-0 text-base leading-6 md:text-lg ${CMS_TEXT_HOVER_CLASS}`}
              style={getTextStyleVars(descStyleKeys, 'descriptionColor', '50', 'normal')}
            >
              <LinkedText text={description} {...linkProps} />
            </p>
          </div>

          <MagazineCluster cover={coverSrc} spread1={spread1Src} spread2={spread2Src} compact className="flex lg:hidden" />

          <LocalizedLink
            href={href || '/magazine-view'}
            className="flex h-14 w-full items-center justify-center gap-2.5 rounded-lg px-4 text-base font-semibold no-underline transition-colors md:text-lg lg:w-fit"
            style={{
              backgroundColor: colorVar(buttonBg),
              ...getTextStyleVars(buttonStyleKeys, 'buttonText', 'btn'),
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colorVar(buttonHoverBg)
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colorVar(buttonBg)
            }}
          >
            {cta}
            <ArrowRight size={29} className="shrink-0 rtl:-scale-x-100" />
          </LocalizedLink>
        </div>

        <MagazineCluster cover={coverSrc} spread1={spread1Src} spread2={spread2Src} className="hidden lg:flex" />
      </div>
    </section>
  )
}

export default MagazineBanner
