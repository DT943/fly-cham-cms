import logo from '../../../../assets/images/layout/logo.png'
import LocalizedLink from '../../../components/LocalizedLink.jsx'
import FooterSocial from './FooterSocial.jsx'

const FooterBrand = () => (
  <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
    <LocalizedLink to="/" aria-label="Fly Cham">
      <img src={logo} alt="Fly Cham" className="h-9 md:h-11 w-auto" />
    </LocalizedLink>
    <FooterSocial />
  </div>
)

export default FooterBrand
