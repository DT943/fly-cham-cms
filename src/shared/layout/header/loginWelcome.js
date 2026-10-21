/**
 * Welcome-panel visibility for the header log-in dropdown.
 *
 * The preferred field is `login.showWelcomePanel`. Older deployed CMS builds
 * strip unknown login keys on save, so we also persist a reserved benefit
 * (`_hideWelcomePanel`) that those builds already round-trip.
 */

export const HIDE_WELCOME_PANEL_ID = '_hideWelcomePanel'

export function loginShowsWelcomePanel(login) {
  if (!login) return true
  if (
    Array.isArray(login.benefits) &&
    login.benefits.some((item) => item?.id === HIDE_WELCOME_PANEL_ID)
  ) {
    return false
  }
  return login.showWelcomePanel !== false
}

export function visibleLoginBenefits(benefits) {
  return (Array.isArray(benefits) ? benefits : []).filter(
    (item) => item?.id !== HIDE_WELCOME_PANEL_ID,
  )
}
