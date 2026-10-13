import { typography } from '../../styles/typography.js'
import { CMS_TEXT_HOVER_CLASS, getButtonStyle, getTextStyleVars } from '../../styles/cmsStyle.js'
import LinkedText from './backlinks/LinkedText.jsx'
import MagazineFlipBook from '../../pages/magazine-view/components/MagazineFlipBook.jsx'

const cx = (...parts) => parts.filter(Boolean).join(' ')

/**
 * Marhaba magazine viewer: title, description, and the page-flip book.
 */
const MagazineView = ({
  title = '',
  description = '',
  prevLabel = '',
  nextLabel = '',
  downloadLabel = '',
  pageOfLabel = '',
  spreadOfLabel = '',
  fullscreenLabel = '',
  exitFullscreenLabel = '',
  pdfUrl = '',
  pdfFilename = '',
  buttonBg = 'secondary',
  buttonHoverBg,
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
  const bookPages = (Array.isArray(pages) ? pages : [])
    .filter((page) => page?.src)
    .map((page) => ({ id: page.id, src: page.src, alt: page.alt || '' }))

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

  const downloadBtn = getButtonStyle(
    { ...textStyle, buttonBg, buttonHoverBg },
    {
      bgKey: 'buttonBg',
      bgHoverKey: 'buttonHoverBg',
      bgFallback: 'secondary',
      bgHoverFallback: 'secondary-800',
      textKey: 'buttonText',
      textFallback: 'btn',
      weightFallback: 'semibold',
    },
  )

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {title || description ? (
        <header className="flex flex-col gap-2 md:gap-3">
          {title ? (
            <h1
              className={cx(
                'm-0 leading-tight',
                typography.pageTitle,
                CMS_TEXT_HOVER_CLASS,
              )}
              style={getTextStyleVars(textStyle, 'titleColor', 'primary-1', 'semibold')}
            >
              <LinkedText text={title} {...linkProps} />
            </h1>
          ) : null}
          {description ? (
            <p
              className={cx(
                'm-0 leading-relaxed',
                typography.sectionDescription,
                CMS_TEXT_HOVER_CLASS,
              )}
              style={getTextStyleVars(textStyle, 'descriptionColor', '700', 'normal')}
            >
              <LinkedText text={description} {...linkProps} />
            </p>
          ) : null}
        </header>
      ) : null}

      <MagazineFlipBook
        pages={bookPages}
        pdfUrl={pdfUrl}
        pdfFilename={pdfFilename}
        labels={{
          prev: prevLabel,
          next: nextLabel,
          download: downloadLabel,
          pageOf: pageOfLabel,
          spreadOf: spreadOfLabel,
          fullscreen: fullscreenLabel,
          exitFullscreen: exitFullscreenLabel,
        }}
        downloadClassName={downloadBtn.className}
        downloadStyle={downloadBtn.style}
      />
    </div>
  )
}

export default MagazineView
