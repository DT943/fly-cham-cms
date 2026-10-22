import Container from '../../components/Container.jsx'
import FooterApps from './components/FooterApps.jsx'
import FooterBrand from './components/FooterBrand.jsx'
import FooterLegal from './components/FooterLegal.jsx'
import FooterNav from './components/FooterNav.jsx'
import useSiteFooter from './useSiteFooter.js'
import { colorVar, dividerAlpha } from './utils/footerStyle.js'

/**
 * Site footer — Figma 41944:18826 (1920).
 * Brand → columns → divider (content track) → apps row (back-to-top in the end
 * gutter, see `.cms-ftr-top`) → dark legal bar.
 *
 * Background pattern: Figma word layer 41944:18827 — constrained Right/Top, so
 * it keeps its 1530.8×1047.7 size and sits right -448 / top -199 at every width
 * (10% opacity). Pinned to the physical right in RTL too: the wing shape is not
 * mirrored, and inline-end would push its tip into the middle of the footer.
 */
const Footer = () => {
  const footer = useSiteFooter()
  const { brand, style } = footer

  return (
    <footer
      className="@container relative isolate shrink-0 overflow-hidden text-50"
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
            right: '-448px',
            top: '-199px',
            width: '1530.84px',
            maxWidth: 'none',
            height: 'auto',
          }}
        />
      ) : null}

      <Container className="relative z-10 flex flex-col pt-8 sm:pt-10 md:pt-11 lg:pt-12 xl:pt-[46px]">
        <div className="flex flex-col gap-8 sm:gap-9 md:gap-10 lg:gap-11 xl:gap-11">
          <FooterBrand brand={brand} style={style} />
          <FooterNav columns={footer.columns} style={style} />
        </div>

        {/* Figma: 48px below the tallest column stack, full content track */}
        <div
          className="mt-10 h-px w-full sm:mt-12"
          style={{ backgroundColor: 'var(--ftr-divider-20)' }}
          aria-hidden
        />

        {/* Figma 41944:18895: 51px below the divider, 46px above the legal bar */}
        <div className="mt-8 w-full pb-8 sm:mt-10 sm:pb-10 md:mt-11 lg:pb-11 xl:mt-[51px] xl:pb-[46px]">
          <FooterApps social={footer.social} style={style} />
        </div>
      </Container>

      <FooterLegal legal={footer.legal} style={style} />
    </footer>
  )
}

export default Footer
