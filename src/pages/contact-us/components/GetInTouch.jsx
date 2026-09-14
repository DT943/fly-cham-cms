import { Clock } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import agentPhoto from '../../../assets/images/contact-us/ph2.png'
import Container from '../../../shared/components/Container.jsx'
import { typography } from '../../../styles/typography.js'
import { WEIGHT, colorVar } from '../../../styles/cmsStyle.js'
import SearchAnchor from '../../../shared/search/components/SearchAnchor.jsx'

const PHONE_DISPLAY = '+963 -11-2122222'
const PHONE_HREF = 'tel:+963112122222'

const cx = (...parts) => parts.filter(Boolean).join(' ')

const INNER_PADDING = {
  none: '',
  compact: 'py-6 md:py-10',
  default: 'py-8 md:py-14',
  spacious: 'py-10 md:py-20',
}

/**
 * Contact hotline block. With no props it matches Contact Us (full-bleed,
 * i18n copy, local photo). The CMS passes content + style and `contained={false}`
 * so it sits inside NewHelp's existing Container.
 */
const GetInTouch = ({
  title,
  label,
  phoneDisplay,
  phoneHref,
  hours,
  hoursMobile,
  note,
  image,
  imageAlt,
  showNote = true,
  noteColor = '700',
  showHours = true,
  showImage = true,
  showLabel = true,
  showPhone = true,
  showTitle = true,
  hoursColor = '700',
  labelColor = '700',
  phoneColor = 'primary-1',
  titleColor = '700',
  showSectionBg = true,
  sectionBg = '200',
  sectionPadding = 'default',
  phoneFontWeight = 'bold',
  titleFontWeight = 'bold',
  contained = true,
}) => {
  const { t } = useTranslation()

  const resolvedTitle = title ?? t('contact.getInTouch.title')
  const resolvedLabel = label ?? t('contact.getInTouch.label')
  const resolvedHours = hours ?? t('contact.getInTouch.hours')
  const resolvedHoursMobile = hoursMobile ?? (hours ? hours : t('contact.getInTouch.hoursMobile'))
  const resolvedNote = note ?? t('contact.getInTouch.note')
  const resolvedImage = image || agentPhoto
  const resolvedImageAlt = imageAlt ?? t('contact.getInTouch.imageAlt')
  const resolvedPhoneDisplay = phoneDisplay ?? PHONE_DISPLAY
  const resolvedPhoneHref = phoneHref ?? PHONE_HREF

  const body = (
    <div
      className={cx(
        'flex flex-col items-center text-center gap-3 md:gap-4',
        !contained && (INNER_PADDING[sectionPadding] || INNER_PADDING.default),
      )}
    >
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
      {showImage && resolvedImage && (
        <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-background p-1.5 shrink-0">
          <img
            src={resolvedImage}
            alt={resolvedImageAlt}
            className="w-full h-full rounded-full object-cover object-center"
          />
        </div>
      )}
      {showLabel && resolvedLabel && (
        <p
          className={cx(typography.body, 'font-medium m-0')}
          style={{ color: colorVar(labelColor) }}
        >
          {resolvedLabel}
        </p>
      )}
      {showPhone && resolvedPhoneDisplay && (
        <a
          href={resolvedPhoneHref}
          dir="ltr"
          className={cx(
            typography.pageTitle,
            WEIGHT[phoneFontWeight] || 'font-bold',
            'no-underline hover:underline leading-tight',
          )}
          style={{ color: colorVar(phoneColor) }}
        >
          {resolvedPhoneDisplay}
        </a>
      )}
      {showHours && (resolvedHours || resolvedHoursMobile) && (
        <p
          className={cx(
            typography.caption,
            'font-medium m-0 inline-flex items-center justify-center gap-1.5',
          )}
          style={{ color: colorVar(hoursColor) }}
        >
          <span className="md:hidden">{resolvedHoursMobile}</span>
          <span className="hidden md:inline">{resolvedHours}</span>
          <Clock size={14} weight="regular" className="shrink-0" />
        </p>
      )}
      {showNote && resolvedNote && (
        <p
          className={cx(typography.caption, 'm-0 w-full max-w-3xl leading-relaxed')}
          style={{ color: colorVar(noteColor) }}
        >
          {resolvedNote}
        </p>
      )}
    </div>
  )

  return (
    <SearchAnchor
      hit="contact-get-in-touch"
      as="section"
      className={cx('w-full', contained && 'mb-6 md:mb-10')}
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      {contained ? (
        <Container className={INNER_PADDING[sectionPadding] || INNER_PADDING.default}>
          {body}
        </Container>
      ) : (
        body
      )}
    </SearchAnchor>
  )
}

export default GetInTouch
