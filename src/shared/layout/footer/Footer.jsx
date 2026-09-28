import Container from '../../components/Container.jsx'
import FooterBrand from './components/FooterBrand.jsx'
import FooterLegal from './components/FooterLegal.jsx'
import FooterNav from './components/FooterNav.jsx'
import useSiteFooter from './useSiteFooter.js'
import { colorVar, dividerAlpha } from './utils/footerStyle.js'

/**
 * Site footer — brand + columns + legal bar, with decorative end pattern.
 * Everything comes from the CMS footer document (useSiteFooter): the bundled
 * default renders immediately, a saved document swaps in when it loads.
 */
const Footer = () => {
  const footer = useSiteFooter()
  const { brand, style } = footer

  return (
    <footer
      className="relative isolate overflow-hidden text-50"
      style={{
        backgroundColor: colorVar(style.bg),
        // Divider tints used by the accordion and legal-bar border classes.
        '--ftr-divider-15': dividerAlpha(style.dividerColor, 15),
        '--ftr-divider-20': dividerAlpha(style.dividerColor, 20),
      }}
    >
      {style.showPattern && brand.patternUrl ? (
        <img
          src={brand.patternUrl}
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-e-0 bottom-0 z-0 hidden h-[45%] w-auto max-w-[42%] object-contain object-bottom-right sm:block lg:max-w-[36%]"
        />
      ) : null}

      {/* Mobile/tablet (< lg) uses the compact stacked design; lg+ is unchanged. */}
      <Container className="relative z-10 flex flex-col gap-6 py-8 lg:gap-12 lg:py-14">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10 xl:gap-14">
          <FooterBrand brand={brand} social={footer.social} style={style} />
          <FooterNav columns={footer.columns} style={style} />
        </div>
        <FooterLegal legal={footer.legal} style={style} />
      </Container>
    </footer>
  )
}

export default Footer
