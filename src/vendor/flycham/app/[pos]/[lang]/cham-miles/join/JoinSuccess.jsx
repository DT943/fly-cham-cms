"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { isKeyboardScrollBlockedTarget } from "../shared/keyboardScroll";

// Keys that would move the page.
const SCROLL_KEYS = new Set([
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  " ",
  "Spacebar",
]);

/**
 * JoinSuccess — the confirmation screen shown in place of the join form once the
 * early-bird request succeeds (see useJoinForm `submitted` + JoinStep). A circled
 * check, headline, tier label, welcome copy, tagline, and a "Return to Fly Cham"
 * link, revealed with a staggered fade/rise. Purely presentational + responsive;
 * the layout is a single centered column that works at every breakpoint.
 */

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const iconItem = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 18, delay: 0.05 },
  },
};

export default function JoinSuccess({ content, homeHref, isAr }) {
  // Freeze the page while the success screen is shown: no scroll up or down.
  // The cham-miles page is scroll-jacked, so two things are needed —
  //   1) preventDefault on wheel/touch/scroll-keys to stop native scrolling, and
  //   2) hold the module-wide scroll lock (`window.__scrollLockUntil`) so
  //      TiersSection's handlers stay "busy" and never snap to another step.
  // Both are torn down (and the previous lock restored) if this ever unmounts.
  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const prevLock = window.__scrollLockUntil ?? 0;
    const freeze = () => {
      // Far-future so it never lapses while this screen is mounted.
      window.__scrollLockUntil = performance.now() + 60 * 60 * 1000;
    };
    freeze();
    const blockScroll = (e) => {
      e.preventDefault();
      freeze();
    };
    const blockKeys = (e) => {
      if (isKeyboardScrollBlockedTarget(e.target)) return;
      if (SCROLL_KEYS.has(e.key)) {
        e.preventDefault();
        freeze();
      }
    };
    const opts = { passive: false, capture: true };
    window.addEventListener("wheel", blockScroll, opts);
    window.addEventListener("touchmove", blockScroll, opts);
    window.addEventListener("keydown", blockKeys, opts);
    return () => {
      window.__scrollLockUntil = prevLock;
      window.removeEventListener("wheel", blockScroll, opts);
      window.removeEventListener("touchmove", blockScroll, opts);
      window.removeEventListener("keydown", blockKeys, opts);
    };
  }, []);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      dir={isAr ? "rtl" : "ltr"}
      lang={isAr ? "ar" : undefined}
      className="cham-join-success pointer-events-auto flex w-full max-w-2xl flex-col items-center px-6 text-center"
    >
      <motion.span
        variants={iconItem}
        aria-hidden="true"
        className="cham-join-success__icon inline-flex items-center justify-center"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-14 w-14 sm:h-16 sm:w-16"
        >
          <circle cx="12" cy="12" r="10" stroke="#5393c8" strokeWidth="1.6" />
          <path
            d="M8 12.2l2.6 2.6L16 9.4"
            stroke="#5393c8"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.span>

      <motion.h2
        variants={item}
        className="cham-join-success__title m-0 mt-3 font-bold leading-[1.05] text-[#282826]"
        style={{ fontSize: "clamp(34px, 6vw, 64px)" }}
      >
        {content.title}
      </motion.h2>

      <motion.p
        variants={item}
        className="cham-join-success__subtitle m-0 font-bold text-(--cm-primary)"
        style={{ fontSize: "clamp(17px, 2.4vw, 26px)" }}
      >
        {content.subtitle}
      </motion.p>

      <motion.p
        variants={item}
        className="cham-join-success__desc m-0 mt-4 max-w-xl text-[#5f5f5c]"
        style={{ fontSize: "clamp(14px, 1.6vw, 18px)", lineHeight: 1.6 }}
      >
        {content.description}
      </motion.p>

      <motion.p
        variants={item}
        className="cham-join-success__tagline m-0 mt-5 font-semibold text-[#282826]"
        style={{ fontSize: "clamp(15px, 1.7vw, 19px)" }}
      >
        {content.tagline}
      </motion.p>

      <motion.div variants={item} className="mt-7">
        <Link
          href={homeHref}
          className="cham-join-success__cta inline-flex items-center justify-center rounded-lg bg-(--cm-primary) px-8 py-3.5 font-semibold text-(--cm-button-text) transition-opacity hover:opacity-90"
          style={{ fontSize: "clamp(15px, 1.6vw, 17px)" }}
        >
          {content.cta}
        </Link>
      </motion.div>
    </motion.div>
  );
}
