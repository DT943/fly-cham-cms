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
        <img src={brand.logoUrl} alt={brand.logoAlt} className="h-9 w-auto md:h-11" />
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
    {social.length > 0 ? <FooterSocial social={social} style={style} /> : null}
  </div>
)

export default FooterBrand
