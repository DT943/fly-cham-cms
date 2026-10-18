import { ArrowRight } from '@phosphor-icons/react'
import { CMS_TEXT_HOVER_CLASS, getButtonStyle, getTextStyleVars, colorVar } from '../../styles/cmsStyle.js'
import useCurrentLanguage from '../hooks/useCurrentLanguage.js'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'

/**
 * Three Marhaba issues fanned in a layered row (same grid as the media-center
 * MagazineFanCluster): cover in front, side issues scaled down, faded and tucked
 * behind. Arbitrary px sizes keep it pixel-identical to the cms2 (Tailwind v3)
 * copy. The caller supplies the display utility (`flex` / `hidden lg:flex`).
 * Images come only from the CMS; an empty image is skipped.
 */
const MagazineCluster = ({ cover, spread1, spread2, compact = false, className = '' }) => {
  const centerSize = compact
    ? 'h-[128px] w-[96px] rounded-md md:h-[144px] md:w-[108px]'
    : 'h-[208px] w-[156px] rounded-lg '
  const sideSize = compact
    ? 'h-[104px] w-[80px] rounded-md md:h-[120px] md:w-[92px]'
    : 'h-[160px] w-[120px] rounded-lg opacity-70 '
  const stageSize = compact
    ? 'mx-auto h-[144px] w-[224px] md:h-[160px] md:w-[256px]'
    : 'h-[224px] w-[256px] md:w-[288px]'

  if (!cover && !spread1 && !spread2) return null

  return (
    <div className={`pointer-events-none relative shrink-0 items-center justify-center ${stageSize} ${className}`}>
      {spread1 ? (
        <img
          src={spread1}
          alt=""
          className={`absolute z-0 object-cover ${sideSize} -translate-x-[68%] rtl:translate-x-[68%]`}
        />
      ) : null}
      {cover ? <img src={cover} alt="" className={`relative z-20 object-cover ${centerSize}`} /> : null}
      {spread2 ? (
        <img
          src={spread2}
          alt=""
          className={`absolute z-10 object-cover ${sideSize} translate-x-[68%] rtl:-translate-x-[68%]`}
        />
      ) : null}
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
  buttonHoverBg,
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
  const isRtl = useCurrentLanguage() === 'ar'
  const bgSrc = bg || ''
  const coverSrc = cover || ''
  const spread1Src = spread1 || ''
  const spread2Src = spread2 || ''
  const deg = isRtl ? 270 : 90

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
  const btn = getButtonStyle(
    { buttonBg, buttonHoverBg, buttonText, buttonTextFontWeight, buttonTextHover, buttonTextFontWeightHover },
    {
      bgKey: 'buttonBg',
      bgHoverKey: 'buttonHoverBg',
      bgFallback: 'secondary',
      bgHoverFallback: 'secondary-800',
      textKey: 'buttonText',
      textFallback: 'btn',
      weightFallback: 'semibold',
    },
  )

  return (
    <section
      className="relative isolate overflow-hidden rounded-[12px] lg:h-90"
      style={{ backgroundColor: colorVar(bannerBg) }}
    >
      {/* Figma overlay layer: opacity 0.9 + navy→transparent + blur(23.10px) + r12 */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[12px]"
        style={{ opacity: 0.9 }}
      >
        {bgSrc ? (
          <img
            src={bgSrc}
            alt=""
            className="absolute inset-0 size-full rounded-[12px] object-cover opacity-50"
          />
        ) : null}
        <div
          className="absolute inset-0 rounded-[12px]"
          style={{
            background: `linear-gradient(${deg}deg, #01263B 0%, rgba(1, 38, 59, 0) 100%)`,
            backdropFilter: 'blur(23.10px)',
            WebkitBackdropFilter: 'blur(23.10px)',
          }}
          aria-hidden
        />
      </div>

      <div className="relative flex h-full flex-col justify-center gap-6 px-6 py-10 md:px-10 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:py-0 lg:ps-16 lg:pe-11.5">
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          {(title || description) ? (
            <div className="flex flex-col gap-3">
              {title ? (
                <h2
                  className={`m-0 text-2xl sm:text-3xl lg:text-4xl ${CMS_TEXT_HOVER_CLASS}`}
                  style={getTextStyleVars(titleStyleKeys, 'titleColor', '50', 'semibold')}
                >
                  <LinkedText text={title} {...linkProps} />
                </h2>
              ) : null}
              {description ? (
                <p
                  className={`m-0 text-base leading-6 md:text-lg ${CMS_TEXT_HOVER_CLASS}`}
                  style={getTextStyleVars(descStyleKeys, 'descriptionColor', '50', 'normal')}
                >
                  <LinkedText text={description} {...linkProps} />
                </p>
              ) : null}
            </div>
          ) : null}

          <MagazineCluster cover={coverSrc} spread1={spread1Src} spread2={spread2Src} compact className="flex lg:hidden" />

          <LocalizedLink
            href={href || '/magazine-view'}
            className={`flex h-14 w-full items-center justify-center gap-2.5 rounded-lg px-4 text-sm font-semibold no-underline transition-colors md:text-base lg:w-fit ${btn.className}`}
            style={btn.style}
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
