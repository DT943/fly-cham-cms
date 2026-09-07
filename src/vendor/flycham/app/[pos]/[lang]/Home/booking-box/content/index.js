import en from "./en";
import ar from "./ar";

const CONTENT_BY_LANG = { en, ar };

export function getBookingBoxContent(lang) {
  const code = String(lang || "en")
    .toLowerCase()
    .slice(0, 2);
  return CONTENT_BY_LANG[code === "ar" ? "ar" : "en"];
}

export { en, ar };
