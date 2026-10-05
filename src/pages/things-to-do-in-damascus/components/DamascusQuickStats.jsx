import { useTranslation } from 'react-i18next'
import Container from '../../../shared/components/Container.jsx'

/**
 * Destination quick-stats.
 * - `tiles`: 2×2 centered tiles for the mobile white sheet
 * - `card`: floating white card for desktop
 * - `responsive` (default): both, toggled by breakpoint (CMS / standalone)
 */
const DestinationQuickStats = ({ i18nKey, stats, variant = 'responsive' }) => {
  const { t } = useTranslation()

  const items = stats.map(({ id, icon: Icon }) => {
    const detail = t(`${i18nKey}.stats.${id}.detail`, { defaultValue: '' })
    return { id, Icon, detail }
  })

  const tiles = (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {items.map(({ id, Icon, detail }) => (
        <div
          key={id}
          className="flex flex-col items-center gap-2 rounded-xl bg-100 px-3 py-4 text-center"
        >
          <Icon size={32} className="shrink-0 text-primary-1" />
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="m-0 text-xs uppercase text-600 sm:text-sm">
              {t(`${i18nKey}.stats.${id}.label`)}
            </p>
            <p className="m-0 text-base font-semibold text-700 sm:text-xl">
              {t(`${i18nKey}.stats.${id}.value`)}
            </p>
            {detail ? (
              <p className="m-0 text-xs text-600 sm:text-sm">{detail}</p>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  )

  const card = (
    <Container className="relative z-10 -mt-12.5">
      <div className="flex w-full items-start justify-between rounded-xl bg-white px-10 py-5 ">
        {items.map(({ id, Icon, detail }) => (
          <div key={id} className="flex items-center gap-4 text-start">
            <Icon size={32} className="size-8 shrink-0 text-primary-1" />
            <div className="flex min-w-0 flex-col gap-0.5">
              <p className="m-0 text-sm font-normal uppercase text-600">
                {t(`${i18nKey}.stats.${id}.label`)}
              </p>
              <p className="m-0 text-xl font-semibold text-700">
                {t(`${i18nKey}.stats.${id}.value`)}
              </p>
              {detail ? (
                <p className="m-0 text-sm font-normal text-600">{detail}</p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </Container>
  )

  if (variant === 'tiles') return tiles
  if (variant === 'card') return card

  return (
    <>
      <div className="lg:hidden">{tiles}</div>
      <div className="hidden lg:block">{card}</div>
    </>
  )
}

export default DestinationQuickStats
