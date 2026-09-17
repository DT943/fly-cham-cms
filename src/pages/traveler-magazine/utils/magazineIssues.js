import coverOne from '../../../assets/images/traveler-magazine/cover-1.jpg'
import coverTwo from '../../../assets/images/traveler-magazine/cover-2.jpg'
import coverThree from '../../../assets/images/traveler-magazine/cover-3.jpg'

/** Years available in the "Explore Marhaba" selector, newest first. */
export const magazineYears = [2026, 2025]

export const MAGAZINE_VIEW_HREF = '/magazine-view'

/**
 * Marhaba magazine issues. Copy (month names, alt text) is translated via
 * `travelerMagazine.*`; the fields below are non-translatable references.
 */
export const magazineIssues = [
  { id: '2026-06', year: 2026, issue: 6, month: 'december', cover: coverOne, isNew: true, href: MAGAZINE_VIEW_HREF },
  { id: '2026-05', year: 2026, issue: 5, month: 'october', cover: coverTwo, href: MAGAZINE_VIEW_HREF },
  { id: '2026-04', year: 2026, issue: 4, month: 'august', cover: coverThree, href: MAGAZINE_VIEW_HREF },
  { id: '2026-03', year: 2026, issue: 3, month: 'june', cover: coverOne, href: MAGAZINE_VIEW_HREF },
  { id: '2026-02', year: 2026, issue: 2, month: 'april', cover: coverTwo, href: MAGAZINE_VIEW_HREF },
  { id: '2026-01', year: 2026, issue: 1, month: 'february', cover: coverThree, href: MAGAZINE_VIEW_HREF },
  { id: '2025-04', year: 2025, issue: 4, month: 'november', cover: coverThree, href: MAGAZINE_VIEW_HREF },
  { id: '2025-03', year: 2025, issue: 3, month: 'august', cover: coverTwo, href: MAGAZINE_VIEW_HREF },
  { id: '2025-02', year: 2025, issue: 2, month: 'may', cover: coverOne, href: MAGAZINE_VIEW_HREF },
  { id: '2025-01', year: 2025, issue: 1, month: 'february', cover: coverTwo, href: MAGAZINE_VIEW_HREF },
]

export const getIssuesForYear = (year) =>
  magazineIssues.filter((issue) => issue.year === year)
