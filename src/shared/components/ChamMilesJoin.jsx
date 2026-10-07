import ChamMilesJoinView from './cham-miles-join/ChamMilesJoinView.jsx'
import LocalizedLink from './LocalizedLink.jsx'
import { resolveCmsHref } from '../../cms/adapters/pick.js'

const resolveHref = (href) => resolveCmsHref(href) || ''

/** Early-bird sign-up (same endpoint as flychamwebsite's /cham-miles join step). */
async function submitJoin(payload) {
  const { postProfileData } = await import('../../vendor/flycham/services/Api/apiService.js')
  return postProfileData('/member/early-bird', payload)
}

/**
 * CMS block "cham-miles-join" — the full-screen Cham Miles join step
 * (title, Create an Account card, success screen, footer bar). The view is
 * shared with the admin preview (cms2 ChamMilesJoin/view).
 */
const ChamMilesJoin = ({ content, style, lang }) => (
  <ChamMilesJoinView
    content={content}
    style={style}
    lang={lang}
    resolveHref={resolveHref}
    LinkComponent={LocalizedLink}
    onSubmit={submitJoin}
  />
)

export default ChamMilesJoin
