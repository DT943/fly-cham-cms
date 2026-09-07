// src/hooks/useIsArabic.jsx
"use client";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";

export default function useIsArabic() {
  return (i18n?.language ?? "en").startsWith("ar");
}
