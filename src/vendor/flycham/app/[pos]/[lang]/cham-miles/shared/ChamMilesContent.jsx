"use client";

import { createContext, useContext, useMemo } from "react";
import { useParams } from "next/navigation";
import { getChamMilesContent } from "../content";

const ChamMilesContentContext = createContext(null);

export function ChamMilesContentProvider({ children }) {
  const params = useParams();
  const langParam = params?.lang;
  const lang =
    (Array.isArray(langParam) ? langParam[0] : langParam) === "ar" ? "ar" : "en";

  const content = useMemo(() => getChamMilesContent(lang), [lang]);

  return (
    <ChamMilesContentContext.Provider value={content}>
      {children}
    </ChamMilesContentContext.Provider>
  );
}

export function useChamMilesLang() {
  const params = useParams();
  const langParam = params?.lang;
  const lang =
    (Array.isArray(langParam) ? langParam[0] : langParam) === "ar" ? "ar" : "en";
  return { lang, isAr: lang === "ar" };
}

export function useChamMilesContent() {
  const content = useContext(ChamMilesContentContext);
  if (!content) {
    throw new Error("useChamMilesContent must be used within ChamMilesContentProvider");
  }
  return content;
}
