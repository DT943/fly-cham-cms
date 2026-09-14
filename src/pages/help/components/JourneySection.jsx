import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'
import {
  ALIGN,
  WEIGHT,
  RADIUS,
  SECTION_PADDING,
  GRID_COLS,
  COLUMN_GAP,
  colorVar,
} from '../../../styles/cmsStyle.js'
import {
  journeySteps as defaultSteps,
  resolveJourneyStepIcon,
} from '../utils/journeySteps.js'
import JourneyStep from './JourneyStep.jsx'
import SearchAnchor from '../../../shared/search/components/SearchAnchor.jsx'

const cx = (...parts) => parts.filter(Boolean).join(' ')

const PANEL_PADDING = {
  none: '',
  compact: 'px-4 py-4 sm:px-6 sm:py-6',
  default: 'px-4 py-6 sm:px-8 sm:py-10 md:px-10 md:py-12',
  spacious: 'px-6 py-8 sm:px-12 sm:py-14 md:px-14 md:py-16',
}

/**
 * Journey steps grid. With no props, copy and steps come from i18n (Help.jsx).
 * The CMS passes title, subtitle, steps, and style tokens.
 */
const JourneySection = ({
  title,
  subtitle,
  steps,
  showIcon = true,
  columns = 4,
  columnGap = 'default',
  iconBg = '100',
  iconColor = '700',
  linkColor = 'primary-1',
  showTitle = true,
  showHeader = true,
  showSubtitle = true,
  titleAlign,
  titleColor = '700',
  titleFontWeight = 'bold',
  subtitleColor = '600',
  stepTitleColor = '700',
  stepTitleFontWeight = 'semibold',
  panelBg = 'background',
  showPanelBg = true,
  panelRadius = 'xl',
  panelPadding = 'default',
  sectionBg = '100',
  showSectionBg = false,
  sectionPadding = 'default',
}) => {
  const { t } = useTranslation()

  const resolvedTitle = title ?? t('help.journey.title')
  const resolvedSubtitle = subtitle ?? t('help.journey.subtitle')
  const resolvedSteps = steps ?? defaultSteps.map((step) => ({
    id: step.id,
    icon: resolveJourneyStepIcon(step.icon),
    title: t(`help.journey.steps.${step.id}.title`),
    links: step.linkKeys.map((linkKey) => ({
      text: t(`help.journey.steps.${step.id}.links.${linkKey}`),
    })),
  }))

  const colKey = String(columns)
  const headerVisible = showHeader && (showTitle || showSubtitle)

  return (
    <SearchAnchor
      hit="help-journey"
      as="section"
      className={cx(
        SECTION_PADDING[sectionPadding],
        showSectionBg && 'rounded-2xl px-4 md:px-6',
      )}
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      <div
        className={cx(
          RADIUS[panelRadius] || RADIUS.xl,
          PANEL_PADDING[panelPadding] || PANEL_PADDING.default,
        )}
        style={showPanelBg ? { backgroundColor: colorVar(panelBg) } : undefined}
      >
        {headerVisible && (
          <div className={cx('flex flex-col gap-2 mb-6 md:mb-7', ALIGN[titleAlign])}>
            {showTitle && resolvedTitle && (
              <h2
                className={cx(
                  typography.sectionTitle,
                  WEIGHT[titleFontWeight] || 'font-bold',
                  'm-0',
                )}
                style={{ color: colorVar(titleColor) }}
              >
                {resolvedTitle}
              </h2>
            )}
            {showSubtitle && resolvedSubtitle && (
              <p
                className={cx(typography.sectionDescription, 'm-0 max-w-4xl')}
                style={{ color: colorVar(subtitleColor) }}
              >
                {resolvedSubtitle}
              </p>
            )}
          </div>
        )}
        <div
          className={cx(
            'grid',
            GRID_COLS[colKey] || GRID_COLS[4],
            COLUMN_GAP[columnGap] || COLUMN_GAP.default,
          )}
        >
          {resolvedSteps.map((step) => (
            <JourneyStep
              key={step.id || step.title}
              icon={step.icon}
              stepLabel={step.title}
              links={step.links}
              showIcon={showIcon}
              iconBg={iconBg}
              iconColor={iconColor}
              linkColor={linkColor}
              stepTitleColor={stepTitleColor}
              stepTitleFontWeight={stepTitleFontWeight}
            />
          ))}
        </div>
      </div>
    </SearchAnchor>
  )
}

export default JourneySection
