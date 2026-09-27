import Container from '../../components/Container.jsx'
import footerPattern from '../../../assets/images/layout/footer-pattern.png'
import FooterBrand from './components/FooterBrand.jsx'
import FooterLegal from './components/FooterLegal.jsx'
import FooterNav from './components/FooterNav.jsx'

/**
 * Site footer — brand + columns + legal bar, with decorative end pattern.
 */
const Footer = () => (
  <footer className="relative isolate overflow-hidden bg-primary-1 text-50">
    <img
      src={footerPattern}
      alt=""
      aria-hidden
      className="pointer-events-none absolute inset-e-0 bottom-0 z-0 hidden h-[45%] w-auto max-w-[42%] object-contain object-bottom-right sm:block lg:max-w-[36%]"
    />

    <Container className="relative z-10 flex flex-col gap-10 py-12 md:gap-12 md:py-14">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-10 xl:gap-14">
        <FooterBrand />
        <FooterNav />
      </div>
      <FooterLegal />
    </Container>
  </footer>
)

export default Footer
