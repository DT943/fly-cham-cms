import { Clock } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import agentPhoto from '../../../assets/images/contact-us/ph2.png'
import Container from '../../../shared/components/Container.jsx'
import { typography } from '../../../styles/typography.js'
import {
  colorVar,
  getTextStyleVars,
  CMS_TEXT_HOVER_CLASS,
} from '../../../styles/cmsStyle.js'
import SearchAnchor from '../../../shared/search/components/SearchAnchor.jsx'
import LinkedText from '../../../shared/components/backlinks/LinkedText.jsx'

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
 * Contact hotline block. The band is always viewport-wide (it breaks out of
 * any parent Container). Inner copy stays in Container so it lines up with
 * the page. `contained` only adds the static-page bottom margin.
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
  titleColorHover,
  titleFontWeightHover,
  labelColorHover,
  labelFontWeightHover,
  phoneColorHover,
  phoneFontWeightHover,
  hoursColorHover,
  hoursFontWeightHover,
  noteColorHover,
  noteFontWeightHover,
  contained = true,
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
}) => {
  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }
  const titleStyleKeys = {
    titleColor,
    titleFontWeight,
    titleColorHover,
    titleFontWeightHover,
  }
  const labelStyleKeys = {
    labelColor,
    labelColorHover,
    labelFontWeightHover,
  }
  const phoneStyleKeys = {
    phoneColor,
    phoneFontWeight,
    phoneColorHover,
    phoneFontWeightHover,
  }
  const hoursStyleKeys = {
    hoursColor,
    hoursColorHover,
    hoursFontWeightHover,
  }
  const noteStyleKeys = {
    noteColor,
    noteColorHover,
    noteFontWeightHover,
  }
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
    <div className="flex flex-col items-center text-center gap-3 md:gap-4">
      {showTitle && resolvedTitle && (
        <h2
          className={cx(typography.sectionTitle, 'm-0', CMS_TEXT_HOVER_CLASS)}
          style={getTextStyleVars(titleStyleKeys, 'titleColor', '700', 'bold')}
        >
          <LinkedText text={resolvedTitle} {...linkProps} />
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
          className={cx(typography.body, 'font-medium m-0', CMS_TEXT_HOVER_CLASS)}
          style={getTextStyleVars(labelStyleKeys, 'labelColor', '700', 'medium')}
        >
          <LinkedText text={resolvedLabel} {...linkProps} />
        </p>
      )}
      {showPhone && resolvedPhoneDisplay && (
        <a
          href={resolvedPhoneHref}
          dir="ltr"
          className={cx(
            typography.pageTitle,
            'no-underline hover:underline leading-tight',
            CMS_TEXT_HOVER_CLASS,
          )}
          style={getTextStyleVars(phoneStyleKeys, 'phoneColor', 'primary-1', 'bold')}
        >
          {resolvedPhoneDisplay}
        </a>
      )}
      {showHours && (resolvedHours || resolvedHoursMobile) && (
        <p
          className={cx(
            typography.caption,
            'font-medium m-0 inline-flex items-center justify-center gap-1.5',
            CMS_TEXT_HOVER_CLASS,
          )}
          style={getTextStyleVars(hoursStyleKeys, 'hoursColor', '700', 'medium')}
        >
          <span className="md:hidden">
            <LinkedText text={resolvedHoursMobile} {...linkProps} />
          </span>
          <span className="hidden md:inline">
            <LinkedText text={resolvedHours} {...linkProps} />
          </span>
          <Clock size={14} weight="regular" className="shrink-0" />
        </p>
      )}
      {showNote && resolvedNote && (
        <p
          className={cx(
            typography.caption,
            'm-0 w-full max-w-3xl leading-relaxed',
            CMS_TEXT_HOVER_CLASS,
          )}
          style={getTextStyleVars(noteStyleKeys, 'noteColor', '700', 'normal')}
        >
          <LinkedText text={resolvedNote} {...linkProps} />
        </p>
      )}
    </div>
  )

  return (
    <SearchAnchor
      hit="contact-get-in-touch"
      as="section"
      className={cx(
        'relative w-screen max-w-[100vw] ml-[calc(50%-50vw)]',
        contained && 'mb-6 md:mb-10',
      )}
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      <Container className={INNER_PADDING[sectionPadding] || INNER_PADDING.default}>
        {body}
      </Container>
    </SearchAnchor>
  )
}

export default GetInTouch
