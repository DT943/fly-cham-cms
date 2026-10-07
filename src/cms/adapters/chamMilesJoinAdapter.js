import { pickContent, resolveCmsAsset } from './pick.js'

/**
 * Map a CMS "cham-miles-join" block to <ChamMilesJoin /> props.
 *
 * Stores the flat editor shape (cms2 ChamMilesJoin — strings + titleOptions /
 * legalLinks / socialLinks lists); the shared view normalises it against its
 * defaults. Images render only from CMS URLs. Style = theme colours.
 */
export function chamMilesJoinProps(block, lang) {
  const content = pickContent(block.content, lang)
  return {
    content: {
      ...content,
      backgroundImage: resolveCmsAsset(content.backgroundImage),
      footerLogo: resolveCmsAsset(content.footerLogo),
    },
    style: block.style || {},
    lang: lang === 'ar' ? 'ar' : 'en',
  }
}
