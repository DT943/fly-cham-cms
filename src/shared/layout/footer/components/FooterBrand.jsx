import { useTranslation } from 'react-i18next'
import logo from '../../../../assets/images/layout/logo.png'
import LocalizedLink from '../../../components/LocalizedLink.jsx'
import { typography } from '../../../../styles/typography.js'
import FooterSocial from './FooterSocial.jsx'

/**
 * Footer brand — logo + follow text on one row, social icons below.
 */
const FooterBrand = () => {
  const { t } = useTranslation()

  return (
    <div className="flex min-w-0 flex-col gap-5 lg:w-[min(100%,22rem)] lg:shrink-0 xl:w-96">
      {/* Mobile: logo above the follow text; lg+: side by side (unchanged). */}
      <div className="flex flex-col items-start gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:gap-x-4 lg:gap-y-2">
        <LocalizedLink href="/" aria-label="Fly Cham" className="inline-flex w-fit shrink-0">
          <img src={logo} alt="Fly Cham" className="h-9 w-auto md:h-11" />
        </LocalizedLink>
        <p className={`m-0 max-w-xs text-50/90 ${typography.caption}`}>
          {t('layout.footer.follow')}
        </p>
      </div>
      <FooterSocial />
    </div>
  )
}

export default FooterBrand
