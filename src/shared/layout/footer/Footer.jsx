import Container from '../../components/Container.jsx'
import FooterApps from './components/FooterApps.jsx'
import FooterBrand from './components/FooterBrand.jsx'
import FooterLegal from './components/FooterLegal.jsx'
import FooterNav from './components/FooterNav.jsx'
import useSiteFooter from './useSiteFooter.js'
import { colorVar, dividerAlpha } from './utils/footerStyle.js'

/**
 * Site footer — Figma 41944:18826 (1920).
 * Brand → columns → divider (content track) → apps row (extends into right gutter)
 * → dark legal bar.
 *
 * Background pattern: Figma word layer 41944:18827 — right -448 / top -199 /
 * 1530.8×1047.7 at 10% opacity on the 1920 frame.
 */
const Footer = () => {
  const footer = useSiteFooter()
  const { brand, style } = footer

  return (
    <footer
      className="relative isolate shrink-0 overflow-hidden text-50"
      style={{
        backgroundColor: colorVar(style.bg),
        '--ftr-divider-15': dividerAlpha(style.dividerColor, 15),
        '--ftr-divider-20': dividerAlpha(style.dividerColor, 20),
      }}
    >
      {style.showPattern && brand.patternUrl ? (
        <img loading="lazy" decoding="async"
          src={brand.patternUrl}
          alt=""
          aria-hidden
          className="pointer-events-none absolute z-0 hidden opacity-10 sm:block"
          style={{
            insetInlineEnd: '-23.333%',
            top: '-22.562%',
            width: '79.731%',
            maxWidth: 'none',
            height: 'auto',
            objectFit: 'contain',
            objectPosition: 'right top',
          }}
        />
      ) : null}

      <Container className="relative z-10 flex flex-col pt-8 sm:pt-10 md:pt-11 lg:pt-12 xl:pt-[46px]">
        <div className="flex flex-col gap-8 sm:gap-9 md:gap-10 lg:gap-11 xl:gap-11">
          <FooterBrand brand={brand} style={style} />
          <FooterNav columns={footer.columns} style={style} />
        </div>

        {/* Figma: ~73px below tallest column stack, 1217px content track */}
        <div
          className="mt-10 h-px w-full sm:mt-12 md:mt-14 lg:mt-16 xl:mt-[72px]"
          style={{ backgroundColor: 'var(--ftr-divider-20)' }}
          aria-hidden
        />

        {/* Figma: 51px below divider; row extends into the page gutter (~50px from viewport edge) */}
        <div className="relative mt-8 w-full pb-8 sm:mt-10 sm:pb-10 md:mt-11 md:pb-10 lg:pb-11 xl:mt-[51px] xl:me-[calc(-1*min(18.8rem,max(0px,(100vw-var(--max-width-page))/2-3.125rem)))] xl:pb-12">
          <FooterApps social={footer.social} style={style} />
        </div>
      </Container>

      <FooterLegal legal={footer.legal} style={style} />
    </footer>
  )
}

export default Footer
