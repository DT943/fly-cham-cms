import en from "./en";
import ar from "./ar";

const CONTENT_BY_LANG = { en, ar };

export function getChamMilesContent(lang) {
  return CONTENT_BY_LANG[lang === "ar" ? "ar" : "en"];
}

export { en, ar };
