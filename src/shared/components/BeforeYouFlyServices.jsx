import { ArrowRight } from '@phosphor-icons/react'
import { CMS_TEXT_HOVER_CLASS, getTextStyleVars, colorVar } from '../../styles/cmsStyle.js'
import { typography } from '../../styles/typography.js'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'
import seatSelectionPhoto from '../../assets/images/before-you-fly/seat-selection.png'
import manageBookingPhoto from '../../assets/images/before-you-fly/manage-booking.png'
import yaMarhabaPhoto from '../../assets/images/before-you-fly/ya-marhaba.png'
import limousinePhoto from '../../assets/images/before-you-fly/limousine.png'
import unaccompaniedMinorPhoto from '../../assets/images/before-you-fly/unaccompanied-minor.png'
import oxygenPhoto from '../../assets/images/before-you-fly/oxygen.png'

/** Seed images keyed by row id — mirror the cms2 defaults so an un-uploaded row previews. */
const IMAGE_BY_ID = {
  seatSelection: seatSelectionPhoto,
  manageBooking: manageBookingPhoto,
  allowedBaggage: manageBookingPhoto,
  paymentMethods: manageBookingPhoto,
  yaMarhaba: yaMarhabaPhoto,
  limousine: limousinePhoto,
  unaccompaniedMinor: unaccompaniedMinorPhoto,
  oxygenCylinder: oxygenPhoto,
  prohibitedItems: oxygenPhoto,
}

const IMAGE_RADIUS = {
  none: 'rounded-none',
  lg: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
}

const SECTION_PADDING = {
  tight: 'py-4 md:py-6',
  default: 'py-6 md:py-10',
  loose: 'py-10 md:py-16',
}

const cx = (...parts) => parts.filter(Boolean).join(' ')

/**
 * Before-you-fly service rows (optional header + a stacked list of photo +
 * title + description + CTA). CMS-driven: colours/weights/hover, image corners
 * and the section background are all controllable, with defaults matching the
 * source design. Falls back to the bundled photos keyed by `id` when no image
 * is uploaded.
 */
const BeforeYouFlyServices = ({
  title = '',
  subtitle = '',
  learnMore = '',
  items = [],
  showHeader = true,
  showTitle = true,
  showSubtitle = true,
  imageRadius = '2xl',
  sectionPadding = 'default',
  showSectionBg = false,
  sectionBg = '100',
  dividerColor = '200',
  arrowBadgeBg = 'primary-1',
  arrowColor = '50',
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
  ...textStyle
}) => {
  if (!items.length) return null

  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }
  const radiusClass = IMAGE_RADIUS[imageRadius] || IMAGE_RADIUS['2xl']
  const headerVisible =
    showHeader && ((showTitle && title) || (showSubtitle && subtitle))

  const inner = (
    <section className="flex flex-col">
      {headerVisible ? (
        <div className="flex flex-col gap-2 pb-8 md:pb-10">
          {showTitle && title ? (
            <h2
              className={cx('m-0', typography.sectionTitle, CMS_TEXT_HOVER_CLASS)}
              style={getTextStyleVars(textStyle, 'titleColor', '700', 'semibold')}
            >
              <LinkedText text={title} {...linkProps} />
            </h2>
          ) : null}
          {showSubtitle && subtitle ? (
            <p
              className={cx('m-0', typography.sectionDescription, CMS_TEXT_HOVER_CLASS)}
              style={getTextStyleVars(textStyle, 'subtitleColor', '700', 'normal')}
            >
              <LinkedText text={subtitle} {...linkProps} />
            </p>
          ) : null}
        </div>
      ) : null}

      {items.map((item, index) => {
        const src = item.image || IMAGE_BY_ID[item.id] || IMAGE_BY_ID.manageBooking
        const cta = item.cta || learnMore
        return (
          <article
            key={item.id || index}
            className="flex flex-col gap-4 border-b py-6 sm:flex-row sm:items-center sm:gap-12"
            style={{ borderColor: colorVar(dividerColor) }}
          >
            <img
              src={src}
              alt={item.imageAlt || ''}
              className={cx('h-48 w-full shrink-0 object-cover sm:h-43 sm:w-82', radiusClass)}
            />
            <div className="flex flex-1 flex-col items-start gap-4">
              <div className="flex flex-col gap-1.5">
                <h3
                  className={cx('m-0 text-xl', CMS_TEXT_HOVER_CLASS)}
                  style={getTextStyleVars(textStyle, 'cardTitleColor', '700', 'semibold')}
                >
                  <LinkedText text={item.title} {...linkProps} />
                </h3>
                <p
                  className={cx('m-0 text-sm leading-relaxed', CMS_TEXT_HOVER_CLASS)}
                  style={getTextStyleVars(textStyle, 'cardDescriptionColor', '900', 'normal')}
                >
                  <LinkedText text={item.description} {...linkProps} />
                </p>
              </div>
              <LocalizedLink
                href={item.href || '#'}
                className={cx(
                  'inline-flex w-fit items-center gap-2.5 text-sm no-underline',
                  CMS_TEXT_HOVER_CLASS,
                )}
                style={getTextStyleVars(textStyle, 'learnMoreColor', 'primary-1', 'semibold')}
              >
                <span
                  className="flex size-[34px] shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: colorVar(arrowBadgeBg) }}
                >
                  <ArrowRight
                    size={16}
                    weight="bold"
                    className="rtl:-scale-x-100"
                    style={{ color: colorVar(arrowColor) }}
                  />
                </span>
                {cta || ''}
              </LocalizedLink>
            </div>
          </article>
        )
      })}
    </section>
  )

  const sectionClass = cx(
    SECTION_PADDING[sectionPadding] || '',
    showSectionBg ? 'rounded-2xl px-4 md:px-6' : '',
  )

  if (!sectionClass) return inner
  return (
    <div className={sectionClass} style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}>
      {inner}
    </div>
  )
}

export default BeforeYouFlyServices
