"use client";

import { createContext, useContext, useMemo } from "react";
import { useParams } from "next/navigation";
import { getBookingBoxContent } from "./index";

const BookingBoxContentContext = createContext(null);

export function BookingBoxContentProvider({ children, lang: langProp }) {
  const { lang: langParam } = useParams() ?? {};
  const lang = langProp ?? langParam;
  const content = useMemo(() => getBookingBoxContent(lang), [lang]);

  return (
    <BookingBoxContentContext.Provider value={content}>
      {children}
    </BookingBoxContentContext.Provider>
  );
}

export function useBookingBoxContent() {
  const content = useContext(BookingBoxContentContext);
  if (!content) {
    throw new Error(
      "useBookingBoxContent must be used within BookingBoxContentProvider",
    );
  }
  return content;
}

/** Safe hook for components that may render outside the provider (falls back to en). */
export function useBookingBoxContentOptional() {
  const content = useContext(BookingBoxContentContext);
  return content ?? getBookingBoxContent("en");
}
