"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ListIcon, XIcon } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'framer-motion';

import { useChamMilesContent, useChamMilesLang } from '../shared/ChamMilesContent';

const logo = '/cham-miles/logo.png';

export default function HeroHeader({ navLinks }) {
  const { a11y } = useChamMilesContent();
  const { isAr } = useChamMilesLang();
  const pathname = usePathname();
  const homeHref = useMemo(() => {
    const segments = (pathname || '').split('/').filter(Boolean);
    if (segments.length < 2) return '/';
    const [pos, lang] = segments;
    const cIndex = segments.indexOf('c');
    const cId = cIndex >= 0 ? segments[cIndex + 1] : undefined;
    return cId ? `/${pos}/${lang}/c/${cId}` : `/${pos}/${lang}`;
  }, [pathname]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [portalReady, setPortalReady] = useState(false);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  // Each header link is a page step: clicking it scrolls to the matching step
  // (handled by the `chamMilesGoTo` listeners in the hero + TiersSection).
  const goToStep = useCallback((item) => (e) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('chamMilesGoTo', { detail: item }));
    setMenuOpen(false);
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  // Keep the fixed mobile shell above the portaled overlay so the same logo /
  // toggle never jump — only the icon glyph swaps in place.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const shell = document.querySelector('.cham-miles-root .cm-hero-header.fixed');
    if (!shell) return;
    shell.classList.toggle('cm-hero-header--menu-open', menuOpen);
    return () => shell.classList.remove('cm-hero-header--menu-open');
  }, [menuOpen]);

  const menuOverlay = portalReady
    ? createPortal(
        <AnimatePresence>
          {menuOpen ? (
            <motion.div
              key="cm-mobile-menu"
              className="cm-hero-header__menu-overlay fixed inset-0 z-[100] md:hidden flex flex-col bg-(--cm-menu-bg)"
              dir={isAr ? 'rtl' : 'ltr'}
              lang={isAr ? 'ar' : undefined}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {/* Clears the fixed header row (logo + toggle stay in the shell above). */}
              <div className="cm-hero-header__menu-spacer shrink-0" aria-hidden="true" />
              <nav className="cm-hero-header__menu-nav flex flex-col px-[max(1.5rem,5.7vw)]">
                {navLinks.map((item, i) => (
                  <motion.button
                    key={item.label}
                    type="button"
                    onClick={goToStep(item)}
                    className="flex items-center gap-2 border-b border-white/10 py-4 text-start text-lg font-medium text-white/95"
                    initial={{ opacity: 0, x: isAr ? -24 : 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </nav>
            </motion.div>
          ) : null}
        </AnimatePresence>,
        document.body,
      )
    : null;

  return (
    <motion.header
      dir={isAr ? 'rtl' : 'ltr'}
      lang={isAr ? 'ar' : undefined}
      className={`cm-hero-header relative w-full z-10 flex items-center justify-between py-4${isAr ? " cm-hero-header--ar" : ""}${menuOpen ? " cm-hero-header--menu-open" : ""}`}
      initial={{ opacity: 0, y: -28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 1.4 }}
    >
      <div>
        <Link href={homeHref} aria-label={a11y.flyChamHome} className="flex items-center">
          <img src={logo} alt="Fly Cham" className="h-8 md:h-10 w-auto" />
        </Link>
      </div>

      {/* Desktop nav — flex + dir=rtl places logo on the right and links on the left */}
      <nav className="cm-hero-header__nav hidden md:flex items-center gap-6 lg:gap-7">
        {navLinks.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={goToStep(item)}
            className="cm-hero-header__nav-link flex items-center gap-1 text-(--cm-header-text)/95 text-xs lg:text-sm font-medium hover:opacity-80 transition-opacity"
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Mobile burger / close — same slot so the control never jumps */}
      <button
        type="button"
        aria-label={menuOpen ? a11y.closeMenu : a11y.openMenu}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
        className="md:hidden -me-1 p-1 text-(--cm-header-text)"
      >
        {menuOpen ? (
          <XIcon size={30} weight="bold" />
        ) : (
          <ListIcon size={30} weight="bold" />
        )}
      </button>

      {menuOverlay}
    </motion.header>
  );
}
