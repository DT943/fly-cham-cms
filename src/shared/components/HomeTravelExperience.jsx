import { ArrowRight, CaretRight } from '@phosphor-icons/react'
import Container from './Container.jsx'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'
import { typography } from '../../styles/typography.js'
import { CMS_TEXT_HOVER_CLASS, getTextStyleVars, colorVar } from '../../styles/cmsStyle.js'

/** Images come only from the CMS; an empty image URL renders no photo. */
const cardImage = (card) => card.image || ''

const CardCopy = ({ card, textStyle, linkProps, gapClass = 'gap-1.5', clamp = false }) => (
  <div className={`flex min-w-0 flex-col ${gapClass}`}>
    <h3
      className={`m-0 ${typography.itemTitle} ${CMS_TEXT_HOVER_CLASS}`}
      style={getTextStyleVars(textStyle, 'cardTitleColor', '700', 'semibold')}
    >
      <LinkedText text={card.title} {...linkProps} />
    </h3>
    <p
      className={`m-0 leading-relaxed ${typography.caption} ${clamp ? 'line-clamp-3' : ''} ${CMS_TEXT_HOVER_CLASS}`}
      style={getTextStyleVars(textStyle, 'cardDescriptionColor', '600', 'normal')}
    >
      <LinkedText text={card.description} {...linkProps} />
    </p>
  </div>
)

const LearnMoreLink = ({ href, label, textStyle, arrowBadgeBg, arrowColor, className = '' }) => (
  <LocalizedLink
    href={href || '#'}
    className={`group/lm relative inline-flex h-[34px] w-fit items-center overflow-hidden rounded-full no-underline ${typography.button} ${className}`}
  >
    <span
      aria-hidden
      className="absolute inset-y-0 start-0 w-[34px] rounded-full transition-[width] duration-300 ease-out group-hover/lm:w-full"
      style={{ backgroundColor: colorVar(arrowBadgeBg || 'primary-1') }}
    />
    <span className="relative z-10 flex size-[34px] shrink-0 items-center justify-center">
      <ArrowRight
        size={16}
        weight="bold"
        className="rtl:-scale-x-100"
        style={{ color: colorVar(arrowColor || '50') }}
      />
    </span>
    {label ? (
      <span
        className={`cms-lm-label relative z-10 pe-3 ps-2.5 transition-[color,font-weight] duration-300 ${CMS_TEXT_HOVER_CLASS}`}
        style={getTextStyleVars(textStyle, 'learnMoreColor', 'primary-1', 'semibold')}
      >
        {label}
      </span>
    ) : null}
  </LocalizedLink>
)

/** Mobile (< lg): image on top, content below. */
const StackCard = ({ card, image, cardBg, learnMoreLabel, textStyle, linkProps, arrowBadgeBg, arrowColor }) => (
  <article
    className="flex min-w-0 flex-col overflow-hidden rounded-2xl"
    style={{ backgroundColor: colorVar(cardBg) }}
  >
    {image ? (
      <div className="aspect-[16/9] w-full overflow-hidden">
        <img src={image} alt={card.imageAlt || ''} className="size-full object-cover" />
      </div>
    ) : null}
    <div className="flex flex-col gap-2.5 p-4">
      <CardCopy card={card} textStyle={textStyle} linkProps={linkProps} />
      <LearnMoreLink
        href={card.href}
        label={learnMoreLabel}
        textStyle={textStyle}
        arrowBadgeBg={arrowBadgeBg}
        arrowColor={arrowColor}
        className="mt-1"
      />
    </div>
  </article>
)

/** Desktop row card (right column) — compact height. */
const RowCard = ({ card, image, cardBg, learnMoreLabel, textStyle, linkProps, arrowBadgeBg, arrowColor }) => (
  <article
    className="grid min-h-[196px] min-w-0 flex-1 grid-cols-[30%_1fr] overflow-hidden rounded-2xl"
    style={{ backgroundColor: colorVar(cardBg) }}
  >
    <div className="relative min-h-0 min-w-0 overflow-hidden">
      {image ? (
        <img src={image} alt={card.imageAlt || ''} className="absolute inset-0 size-full object-cover" />
      ) : null}
    </div>
    <div className="flex min-w-0 flex-col gap-3 p-4 xl:p-5">
      <CardCopy card={card} textStyle={textStyle} linkProps={linkProps} clamp />
      <LearnMoreLink
        href={card.href}
        label={learnMoreLabel}
        textStyle={textStyle}
        arrowBadgeBg={arrowBadgeBg}
        arrowColor={arrowColor}
        className="mt-auto"
      />
    </div>
  </article>
)

/** Desktop featured — shorter image band, tighter content. */
const FeaturedCard = ({ card, image, cardBg, learnMoreLabel, textStyle, linkProps, arrowBadgeBg, arrowColor }) => (
  <article
    className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl"
    style={{ backgroundColor: colorVar(cardBg) }}
  >
    {image ? (
      <div className="relative min-h-[200px] w-full shrink-0 basis-[54%] overflow-hidden">
        <img src={image} alt={card.imageAlt || ''} className="absolute inset-0 size-full object-cover" />
      </div>
    ) : null}
    <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4 p-5 xl:p-6">
      <CardCopy card={card} textStyle={textStyle} linkProps={linkProps} gapClass="gap-2" />
      <LearnMoreLink
        href={card.href}
        label={learnMoreLabel}
        textStyle={textStyle}
        arrowBadgeBg={arrowBadgeBg}
        arrowColor={arrowColor}
        className="mt-auto"
      />
    </div>
  </article>
)

/**
 * CMS-driven Home Travel Experience — header (title, subtitle, explore link) +
 * mobile stacked cards / desktop featured card (cards[0]) with a column of row
 * cards. Same markup as pages/home/components/HomeTravelExperience.jsx; colours,
 * weights and hover come from the CMS style with defaults equal to the source.
 * Only the Learn More / Explore links are anchors, so backlinks apply to the
 * header and card copy.
 */
const HomeTravelExperience = ({
  title = '',
  subtitle = '',
  exploreLabel = '',
  exploreHref = '/travel-experience',
  learnMoreLabel = '',
  cards = [],
  showSectionBg = false,
  sectionBg = '100',
  cardBg = '50',
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
  titleColor = '700',
  titleFontWeight = 'semibold',
  titleColorHover = '700',
  titleFontWeightHover = 'semibold',
  subtitleColor = '600',
  subtitleFontWeight = 'normal',
  subtitleColorHover = '600',
  subtitleFontWeightHover = 'normal',
  ctaColor = 'primary-1',
  ctaFontWeight = 'semibold',
  ctaColorHover = 'primary-1',
  ctaFontWeightHover = 'semibold',
  cardTitleColor = '700',
  cardTitleFontWeight = 'semibold',
  cardTitleColorHover = '700',
  cardTitleFontWeightHover = 'semibold',
  cardDescriptionColor = '600',
  cardDescriptionFontWeight = 'normal',
  cardDescriptionColorHover = '600',
  cardDescriptionFontWeightHover = 'normal',
  learnMoreColor = 'primary-1',
  learnMoreFontWeight = 'semibold',
  learnMoreColorHover = '50',
  learnMoreFontWeightHover = 'semibold',
  arrowBadgeBg = 'primary-1',
  arrowColor = '50',
}) => {
  const textStyle = {
    titleColor,
    titleFontWeight,
    titleColorHover,
    titleFontWeightHover,
    subtitleColor,
    subtitleFontWeight,
    subtitleColorHover,
    subtitleFontWeightHover,
    ctaColor,
    ctaFontWeight,
    ctaColorHover,
    ctaFontWeightHover,
    cardTitleColor,
    cardTitleFontWeight,
    cardTitleColorHover,
    cardTitleFontWeightHover,
    cardDescriptionColor,
    cardDescriptionFontWeight,
    cardDescriptionColorHover,
    cardDescriptionFontWeightHover,
    learnMoreColor,
    learnMoreFontWeight,
    learnMoreColorHover:
      learnMoreColorHover && learnMoreColorHover !== learnMoreColor
        ? learnMoreColorHover
        : '50',
    learnMoreFontWeightHover,
  }
  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }

  const list = (Array.isArray(cards) ? cards : []).map((card) => ({
    card,
    image: cardImage(card),
  }))
  if (!title && !subtitle && !list.length) return null

  const [featured, ...rest] = list
  const cardProps = { cardBg, learnMoreLabel, textStyle, linkProps, arrowBadgeBg, arrowColor }

  return (
    <section
      className="w-full min-w-0"
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      <Container className="flex min-w-0 flex-col gap-5 md:gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div className="flex max-w-3xl flex-col gap-1.5 md:gap-2">
            {title ? (
              <h2
                className={`m-0 break-words ${typography.sectionTitle} lg:text-[32px] ${CMS_TEXT_HOVER_CLASS}`}
                style={getTextStyleVars(textStyle, 'titleColor', '700', 'semibold')}
              >
                <LinkedText text={title} {...linkProps} />
              </h2>
            ) : null}
            {subtitle ? (
              <p
                className={`m-0 leading-relaxed break-words ${typography.sectionDescription} ${CMS_TEXT_HOVER_CLASS}`}
                style={getTextStyleVars(textStyle, 'subtitleColor', '600', 'normal')}
              >
                <LinkedText text={subtitle} {...linkProps} />
              </p>
            ) : null}
          </div>
          {exploreLabel ? (
            <LocalizedLink
              href={exploreHref || '#'}
              className={`inline-flex shrink-0 cursor-pointer items-center gap-1 no-underline ${typography.caption}`}
              style={getTextStyleVars(textStyle, 'ctaColor', 'primary-1', 'semibold')}
            >
              {exploreLabel}
              <CaretRight size={14} weight="bold" className="rtl:-scale-x-100" />
            </LocalizedLink>
          ) : null}
        </div>

        {list.length ? (
          <>
            <div className="flex min-w-0 flex-col gap-3 lg:hidden">
              {list.map(({ card, image }, index) => (
                <StackCard key={card.id || index} card={card} image={image} {...cardProps} />
              ))}
            </div>

            <div className="hidden min-w-0 gap-4 lg:grid lg:grid-cols-2 lg:items-stretch xl:gap-5">
              <FeaturedCard card={featured.card} image={featured.image} {...cardProps} />
              <div className="flex min-h-0 min-w-0 flex-col gap-3">
                {rest.map(({ card, image }, index) => (
                  <RowCard key={card.id || index} card={card} image={image} {...cardProps} />
                ))}
              </div>
            </div>
          </>
        ) : null}
      </Container>
    </section>
  )
}

export default HomeTravelExperience
