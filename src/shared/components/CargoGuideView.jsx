import { typography } from '../../styles/typography.js'
import { CMS_TEXT_HOVER_CLASS, getTextStyleVars } from '../../styles/cmsStyle.js'
import LinkedText from './backlinks/LinkedText.jsx'
import CargoGuideFlipbook from '../../pages/cargo-guide/components/CargoGuideFlipbook.jsx'

const cx = (...parts) => parts.filter(Boolean).join(' ')

/**
 * CMS "cargo-guide-view" — title, description, and the cargo brochure flipbook.
 * Pages may be full covers or left/right halves of a spread image.
 */
const CargoGuideView = ({
  title = '',
  description = '',
  pages = [],
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
  ...textStyle
}) => {
  const bookPages = (Array.isArray(pages) ? pages : []).filter((page) => page?.src)

  if (!title && !description && !bookPages.length) return null

  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {title || description ? (
        <header className="flex flex-col gap-3 md:gap-3">
          {title ? (
            <h1
              className={cx('m-0 font-bold leading-tight lg:text-[44px]', typography.pageTitle, CMS_TEXT_HOVER_CLASS)}
              style={getTextStyleVars(textStyle, 'titleColor', 'primary-1', 'semibold')}
            >
              <LinkedText text={title} {...linkProps} />
            </h1>
          ) : null}
          {description ? (
            <p
              className={cx('m-0 max-w-180 text-base md:text-lg', CMS_TEXT_HOVER_CLASS)}
              style={getTextStyleVars(textStyle, 'descriptionColor', '700', 'normal')}
            >
              <LinkedText text={description} {...linkProps} />
            </p>
          ) : null}
        </header>
      ) : null}

      {bookPages.length ? (
        <section className="mt-0">
          <CargoGuideFlipbook pages={bookPages} />
        </section>
      ) : null}
    </div>
  )
}

export default CargoGuideView
