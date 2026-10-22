import LocalizedLink from '../../../components/LocalizedLink.jsx'
import { colorVar } from '../../../../styles/cmsStyle.js'
import { footerHref } from '../utils/footerStyle.js'

/**
 * Footer brand — logo + tagline (Figma 41944:18826).
 * Responsive: logo scales up slightly toward lg/xl; tagline 14→18px.
 */
const FooterBrand = ({ brand, style }) => (
  <div className="flex w-full min-w-0 shrink-0 flex-col gap-[13px]">
    <LocalizedLink
      href={footerHref(brand.logoHref)}
      aria-label={brand.logoAlt || undefined}
      className="inline-flex h-[43px] w-fit shrink-0 items-center"
    >
      <img loading="lazy" decoding="async"
        src={brand.logoUrl}
        alt={brand.logoAlt}
        width={185}
        height={44}
        className="block h-[44px] w-[185px] max-w-none"
      />
    </LocalizedLink>
    {brand.followText ? (
      <p
        className="m-0 text-[16px] font-medium leading-[normal] sm:text-[17px] lg:text-[18px]"
        style={{ color: colorVar(style.followTextColor || '50') }}
      >
        {brand.followText}
      </p>
    ) : null}
  </div>
)

export default FooterBrand
