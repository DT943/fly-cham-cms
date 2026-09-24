import logo from '../../../../assets/images/layout/logo.png'
import LocalizedLink from '../../../components/LocalizedLink.jsx'
import FooterSocial from './FooterSocial.jsx'

const FooterBrand = () => (
  <div className="flex flex-col gap-6 border-b border-white/15 pb-8 sm:flex-row sm:items-center sm:justify-between">
    <LocalizedLink href="/" aria-label="Fly Cham" className="inline-flex w-fit">
      <img src={logo} alt="Fly Cham" className="h-9 w-auto md:h-11" />
    </LocalizedLink>
    <FooterSocial />
  </div>
)

export default FooterBrand
