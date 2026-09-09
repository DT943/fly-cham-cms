import { useTranslation } from 'react-i18next'
import Container from '../../../shared/components/Container.jsx'
import { damascusStats } from '../utils/damascusContent.js'

const DamascusQuickStats = () => {
  const { t } = useTranslation()

  return (
    <Container className="relative z-10 -mt-8 md:-mt-10 lg:-mt-12.5">
      <div className="grid grid-cols-1 gap-6 rounded-xl bg-white px-6 py-6 shadow-[0_10px_15px_rgba(0,0,0,0.05)] sm:grid-cols-2 lg:flex lg:h-25 lg:items-start lg:justify-between lg:gap-4 lg:px-10 lg:py-5">
        {damascusStats.map(({ id, icon: Icon }) => {
          const detail = t(`thingsToDoInDamascus.stats.${id}.detail`)

          return (
            <div key={id} className="flex items-center gap-4">
              <Icon size={32} className="shrink-0 text-primary-1" />
              <div className="flex flex-col gap-0.5">
                <p className="m-0 text-sm uppercase text-600">
                  {t(`thingsToDoInDamascus.stats.${id}.label`)}
                </p>
                <p className="m-0 text-xl font-semibold text-700">
                  {t(`thingsToDoInDamascus.stats.${id}.value`)}
                </p>
                {detail ? <p className="m-0 text-sm text-600">{detail}</p> : null}
              </div>
            </div>
          )
        })}
      </div>
    </Container>
  )
}

export default DamascusQuickStats
