/**
 * Horizontal inset so content lines up with the drawn header logo mark, not the
 * transparent padding in the 241×72 logo asset (23.5px before the mark, 59.5px
 * after — scaled with the logo box: <lg 160×44, lg 185×72, xl 241×72).
 *
 * Keep in sync with flychamadmin `LOGO_CONTENT_INSET_CLASS`.
 */
export const LOGO_CONTENT_INSET_CLASS =
  'ps-[21px] lg:ps-[18px] xl:ps-6 rtl:ps-[43px] rtl:lg:ps-[46px] rtl:xl:ps-[60px]'
