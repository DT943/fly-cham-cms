import {
  CMS_TEXT_HOVER_CLASS,
  colorVar,
  getTextStyleVars,
} from '../../styles/cmsStyle.js'
import LinkedText from './backlinks/LinkedText.jsx'
import DealCard from './deals/DealCard.jsx'
import DealsCarousel from './deals/DealsCarousel.jsx'
import { DEAL_CARD_WIDTH, SECTION_PADDING_CLASS } from './deals/dealsStyle.js'

// Figma: 22px / 1.4 on mobile, 28px from desktop; 20px → 34px above the cards.
const TITLE_SIZE = 'text-[22px] leading-[1.4] lg:text-[28px] lg:leading-[normal]'

/**
 * CMS "service-deals" block (Figma 40951:24562 / mobile 40954:91358): title +
 * baggage / seat / other service deal cards with a live countdown tag and route
 * list. Carousel with arrows on desktop, stacked on phones. Mirrors cms2
 * ServiceDealsPanel.
 */
const ServiceDeals = ({ content, style = {}, lang = 'en' }) => {
  const deals = content?.deals || []
  if (!content?.title && !deals.length) return null

  const linkProps = {
    links: content.links || [],
    enabled: style.showLinks !== false,
    linkColor: style.linkColor,
    linkHoverColor: style.linkHoverColor,
    linkFontWeight: style.linkFontWeight,
    linkUnderline: style.linkUnderline,
    linkItalic: style.linkItalic,
  }
  const mobileLayout = style.mobileLayout === 'carousel' ? 'carousel' : 'stack'

  return (
    <section
      className={SECTION_PADDING_CLASS[style.sectionPadding] || ''}
      style={style.showSectionBg ? { backgroundColor: colorVar(style.sectionBg || '100') } : undefined}
    >
      <div className="flex flex-col gap-5 lg:gap-[34px]">
        {content.title ? (
          <h2
            className={`m-0 ${TITLE_SIZE} ${CMS_TEXT_HOVER_CLASS}`}
            style={getTextStyleVars(style, 'titleColor', '700', 'semibold')}
          >
            <LinkedText text={content.title} {...linkProps} />
          </h2>
        ) : null}
        {deals.length ? (
          <DealsCarousel
            count={deals.length}
            mobileLayout={mobileLayout}
            showArrows={style.showArrows !== false}
            showDots={style.showDots === true}
            arrowColor={style.arrowColor}
            dotColor={style.dotColor}
          >
            {deals.map((deal, index) => (
              <DealCard
                key={deal.id || index}
                variant="service"
                deal={deal}
                fareText={deal.fareText}
                buttonLabel={content.buttonLabel}
                endsInLabel={content.endsInLabel}
                lang={lang}
                textStyle={style}
                linkProps={linkProps}
                widthClass={DEAL_CARD_WIDTH[mobileLayout]}
                badgeBgFallback="secondary-1"
                badgeTextFallback="white"
              />
            ))}
          </DealsCarousel>
        ) : null}
      </div>
    </section>
  )
}

export default ServiceDeals
