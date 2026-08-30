import { useTranslation } from 'react-i18next'
import heroPhoto from '../../../assets/images/contact-us/ph1.png'
import heroMask from '../../../assets/images/contact-us/mask.png'

const maskStyle = {
  WebkitMaskImage: `url(${heroMask})`,
  maskImage: `url(${heroMask})`,
  WebkitMaskSize: '100% 100%',
  maskSize: '100% 100%',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
  WebkitMaskPosition: 'center',
  maskPosition: 'center',
}

const ContactHeroImage = () => {
  const { t } = useTranslation()
  const alt = t('contact.hero.imageAlt')

  return (
    <div className="w-full">
      <img
        src={heroPhoto}
        alt={alt}
        className="w-full h-auto rounded-2xl object-cover object-[center_20%] aspect-[380/180] md:hidden"
      />
      <div
        className="hidden md:block w-full aspect-[573/330] rtl:-scale-x-100"
        style={maskStyle}
      >
        <div
          className="w-full h-full bg-cover bg-[position:center_20%] rtl:-scale-x-100"
          style={{ backgroundImage: `url(${heroPhoto})` }}
          role="img"
          aria-label={alt}
        />
      </div>
    </div>
  )
}

export default ContactHeroImage
