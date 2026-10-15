import LocalizedLink from '../../../components/LocalizedLink.jsx'
import { typography } from '../../../../styles/typography.js'
import { colorAlpha, footerHref } from '../utils/footerStyle.js'
import FooterSocial from './FooterSocial.jsx'

/**
 * Footer brand — logo, follow text underneath, then the social icons.
 * From `lg` the column is as wide as the icon row so every icon stays on one line.
 */
const FooterBrand = ({ brand, social, style }) => (
  <div className="flex w-full min-w-0 shrink-0 flex-col gap-5 lg:w-max">
    <div className="flex flex-col items-start gap-3">
      <LocalizedLink
        href={footerHref(brand.logoHref)}
        aria-label={brand.logoAlt || undefined}
        className="inline-flex w-fit shrink-0"
      >
        <img
          src={brand.logoUrl}
          alt={brand.logoAlt}
          width={185}
          height={44}
          className="block h-[44px] w-[185px] max-w-none"
        />
      </LocalizedLink>
      {brand.followText ? (
        <p
          className={`m-0 max-w-xs ${typography.caption}`}
          style={{ color: colorAlpha(style.followTextColor, 90) }}
        >
          {brand.followText}
        </p>
      ) : null}
    </div>
    <div className="flex w-full min-w-0 flex-col gap-3 lg:w-max">
      {brand.description ? (
        <p
          className={`m-0 w-full min-w-0 lg:w-0 lg:min-w-full ${typography.caption}`}
          style={{ color: colorAlpha(style.followTextColor, 90) }}
        >
          {brand.description}
        </p>
      ) : null}
      {social.length > 0 ? <FooterSocial social={social} style={style} /> : null}
    </div>
  </div>
)

export default FooterBrand
