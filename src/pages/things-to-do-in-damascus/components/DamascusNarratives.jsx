import { useTranslation } from 'react-i18next'
import { damascusNarratives } from '../utils/damascusContent.js'

const DamascusNarratives = () => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-10 md:gap-14 lg:gap-20">
      {damascusNarratives.map(({ id, image, imageFirst, titleClass }) => (
        <section
          key={id}
          className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10"
        >
          <img
            src={image}
            alt={t(`thingsToDoInDamascus.narratives.${id}.imageAlt`)}
            className={`h-55 w-full shrink-0 rounded-2xl object-cover sm:h-70 lg:h-80 lg:w-140 ${
              imageFirst ? '' : 'lg:order-2'
            }`}
          />
          <div
            className={`flex w-full flex-col justify-center gap-3 lg:w-150 lg:gap-5 ${
              imageFirst ? '' : 'lg:order-1'
            }`}
          >
            <h2 className={`m-0 text-xl sm:text-2xl lg:text-[28px] ${titleClass}`}>
              {t(`thingsToDoInDamascus.narratives.${id}.title`)}
            </h2>
            <p className="m-0 text-sm leading-[1.6] text-800 sm:text-base">
              {t(`thingsToDoInDamascus.narratives.${id}.description`)}
            </p>
          </div>
        </section>
      ))}
    </div>
  )
}

export default DamascusNarratives
