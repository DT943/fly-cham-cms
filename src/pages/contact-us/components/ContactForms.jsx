import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'
import {
  ALIGN,
  SECTION_PADDING,
  CARD_GAP,
  GRID_COLS,
  CMS_TEXT_HOVER_CLASS,
  colorVar,
  getButtonStyle,
  getTextStyleVars,
} from '../../../styles/cmsStyle.js'
import {
  contactForms as defaultForms,
  resolveContactFormHref,
  resolveContactFormIcon,
} from '../utils/contactForms.jsx'
import ContactFormCard from './ContactFormCard.jsx'
import SearchAnchor from '../../../shared/search/components/SearchAnchor.jsx'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'
import LinkedText from '../../../shared/components/backlinks/LinkedText.jsx'

const cx = (...parts) => parts.filter(Boolean).join(' ')

const BUTTON_ALIGN = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
}

const ContactForms = ({
  title,
  subtitle,
  forms,
  buttonLabel,
  buttonHref,
  showHeader = true,
  showTitle = true,
  showSubtitle = true,
  showButton = true,
  showSectionBg = false,
  sectionBg = '100',
  sectionPadding = 'default',
  titleColor = '700',
  titleFontWeight = 'semibold',
  titleColorHover,
  titleFontWeightHover,
  subtitleColor = '700',
  subtitleFontWeight = 'normal',
  subtitleColorHover,
  subtitleFontWeightHover,
  titleAlign = 'left',
  buttonAlign = 'center',
  columns,
  cardGap,
  buttonText = 'primary-1',
  buttonTextFontWeight = 'semibold',
  buttonTextHover,
  buttonTextFontWeightHover,
  buttonBg = 'background',
  buttonHoverBg,
  buttonBorderColor = 'primary-1',
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
  ...cardStyle
}) => {
  const { t } = useTranslation()

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
  const subtitleStyleKeys = {
    subtitleColor,
    subtitleFontWeight,
    subtitleColorHover,
    subtitleFontWeightHover,
  }
  const buttonStyle = getButtonStyle(
    {
      buttonBg,
      buttonHoverBg,
      buttonText,
      buttonTextFontWeight,
      buttonTextHover,
      buttonTextFontWeightHover,
    },
    {
      bgKey: 'buttonBg',
      bgHoverKey: 'buttonHoverBg',
      bgFallback: 'background',
      bgHoverFallback: '100',
      textKey: 'buttonText',
      textFallback: 'primary-1',
      weightFallback: 'semibold',
    },
  )

  const resolvedTitle = title ?? t('contact.forms.title')
  const resolvedSubtitle = subtitle ?? t('contact.forms.subtitle')
  const resolvedButtonLabel = buttonLabel ?? t('contact.forms.viewAll')
  const resolvedButtonHref = buttonHref ?? '/help/contact-us/forms'
  const resolvedForms =
    forms ??
    defaultForms.map((form) => ({
      id: form.id,
      icon: resolveContactFormIcon(form.icon),
      href: resolveContactFormHref(form),
      title: t(`contact.forms.items.${form.id}.title`),
      description: t(`contact.forms.items.${form.id}.description`),
    }))

  const showTitleRow = showTitle && resolvedTitle
  const showSubtitleRow = showSubtitle && resolvedSubtitle
  const headerVisible = showHeader && (showTitleRow || showSubtitleRow)
  const buttonVisible = showButton && resolvedButtonLabel

  const gridColsClass = columns
    ? GRID_COLS[String(columns)] || GRID_COLS[4]
    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  const gapClass = cardGap ? CARD_GAP[cardGap] || CARD_GAP.default : 'gap-3 md:gap-5'

  return (
    <SearchAnchor
      hit="contact-forms"
      as="section"
      className={cx(
        'flex flex-col gap-4 md:gap-6',
        SECTION_PADDING[sectionPadding],
        showSectionBg && 'rounded-2xl px-4 md:px-6',
      )}
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      {headerVisible && (
        <div className={cx('flex flex-col gap-2', ALIGN[titleAlign])}>
          {showTitleRow && (
            <h2
              className={cx(typography.sectionTitle, 'm-0', CMS_TEXT_HOVER_CLASS)}
              style={getTextStyleVars(titleStyleKeys, 'titleColor', '700', 'semibold')}
            >
              <LinkedText text={resolvedTitle} {...linkProps} />
            </h2>
          )}
          {showSubtitleRow && (
            <p
              className={cx(typography.sectionDescription, 'm-0', CMS_TEXT_HOVER_CLASS)}
              style={getTextStyleVars(subtitleStyleKeys, 'subtitleColor', '700', 'normal')}
            >
              <LinkedText text={resolvedSubtitle} {...linkProps} />
            </p>
          )}
        </div>
      )}
      <div className={cx('grid', gridColsClass, gapClass)}>
        {resolvedForms.map((form) => (
          <ContactFormCard
            key={form.id || form.title}
            icon={form.icon}
            href={form.href}
            title={form.title}
            description={form.description}
            {...cardStyle}
          />
        ))}
      </div>
      {buttonVisible && (
        <div className={cx('flex', BUTTON_ALIGN[buttonAlign] || 'justify-center')}>
          <LocalizedLink
            href={resolvedButtonHref}
            className={cx(
              typography.button,
              'mt-0 md:mt-4 no-underline rounded-lg border px-10 py-3',
              buttonStyle.className,
            )}
            style={{
              ...buttonStyle.style,
              borderColor: colorVar(buttonBorderColor),
            }}
          >
            {resolvedButtonLabel}
          </LocalizedLink>
        </div>
      )}
    </SearchAnchor>
  )
}

export default ContactForms
