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
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
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
