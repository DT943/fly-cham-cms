'use client';

import React, {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { InfoIcon } from '@phosphor-icons/react';
import { useParams } from 'next/navigation';
import useIsArabic from '@/hooks/useIsArabic';
import { isCalendarArabic } from '@/util/calendarI18n';
import { SEARCH_NESTED_MODAL_Z_INDEX } from '@/app/[pos]/[lang]/search-results/components/FlightResults/FlightResultsDesktop/constants';
import styles from './GuestBaggageInfo.module.css';

const VIEWPORT_PADDING = 12;
const GAP = 8;
/** Fallback height before the tip is measured (2–3 lines). */
const ESTIMATED_TIP_HEIGHT = 72;
const TOOLTIP_Z_INDEX = SEARCH_NESTED_MODAL_Z_INDEX + 100;

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function resolveHorizontalLeft(triggerRect, isRtl, maxWidth) {
  let left;
  if (isRtl) {
    left = triggerRect.right - maxWidth;
  } else {
    left = triggerRect.left;
  }
  return clamp(
    left,
    VIEWPORT_PADDING,
    window.innerWidth - VIEWPORT_PADDING - maxWidth
  );
}

/**
 * Pick top/bottom from free space, then clamp fully into the viewport.
 * @param {'auto' | 'top' | 'bottom'} placement
 */
function computeTooltipCoords(triggerRect, isRtl, placement, tipHeight) {
  const maxWidth = Math.min(280, window.innerWidth - VIEWPORT_PADDING * 2);
  const height = tipHeight || ESTIMATED_TIP_HEIGHT;
  const spaceBelow = window.innerHeight - triggerRect.bottom - VIEWPORT_PADDING;
  const spaceAbove = triggerRect.top - VIEWPORT_PADDING;

  let placeAbove;
  if (placement === 'top') {
    placeAbove = true;
  } else if (placement === 'bottom') {
    placeAbove = false;
  } else if (spaceBelow >= height + GAP) {
    placeAbove = false;
  } else if (spaceAbove >= height + GAP) {
    placeAbove = true;
  } else {
    placeAbove = spaceAbove > spaceBelow;
  }

  let top = placeAbove
    ? triggerRect.top - GAP - height
    : triggerRect.bottom + GAP;

  top = clamp(
    top,
    VIEWPORT_PADDING,
    window.innerHeight - VIEWPORT_PADDING - height
  );

  return {
    top,
    left: resolveHorizontalLeft(triggerRect, isRtl, maxWidth),
    maxWidth,
  };
}

function useCanHover() {
  const [canHover, setCanHover] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const sync = () => setCanHover(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return canHover;
}

/**
 * Info icon with portaled baggage tooltip.
 * Hover/focus on fine pointers; tap toggle on touch / coarse pointers.
 */
export default function GuestBaggageInfo({ content, placement = 'auto' }) {
  const tooltipId = useId();
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState(null);
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const canHover = useCanHover();
  const { lang } = useParams();
  const isArabic = useIsArabic();
  const isRtl = isCalendarArabic(lang) || isArabic;

  const updateCoords = useCallback(
    (measuredHeight) => {
      if (!triggerRef.current) return;
      const tipHeight =
        measuredHeight ??
        tooltipRef.current?.offsetHeight ??
        ESTIMATED_TIP_HEIGHT;
      setCoords(
        computeTooltipCoords(
          triggerRef.current.getBoundingClientRect(),
          isRtl,
          placement,
          tipHeight
        )
      );
    },
    [isRtl, placement]
  );

  const showTooltip = useCallback(() => {
    updateCoords();
    setOpen(true);
  }, [updateCoords]);

  const hideTooltip = useCallback(() => {
    setOpen(false);
    setCoords(null);
  }, []);

  const toggleTooltip = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (open) {
        hideTooltip();
      } else {
        showTooltip();
      }
    },
    [open, hideTooltip, showTooltip]
  );

  // Re-measure after paint so the tip never sits off-screen (mobile sheets).
  useLayoutEffect(() => {
    if (!open || !tooltipRef.current) return;
    updateCoords(tooltipRef.current.offsetHeight);
  }, [open, content, updateCoords]);

  useEffect(() => {
    if (!open) return undefined;

    const handleReposition = () => updateCoords();
    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleReposition, true);

    return () => {
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition, true);
    };
  }, [open, updateCoords]);

  // Outside tap closes on touch UIs; delay so the opening tap does not dismiss.
  useEffect(() => {
    if (!open || canHover) return undefined;

    let remove = () => {};
    const timer = window.setTimeout(() => {
      const handlePointerDown = (event) => {
        if (triggerRef.current?.contains(event.target)) return;
        if (tooltipRef.current?.contains(event.target)) return;
        hideTooltip();
      };
      document.addEventListener('pointerdown', handlePointerDown, true);
      remove = () =>
        document.removeEventListener('pointerdown', handlePointerDown, true);
    }, 0);

    return () => {
      window.clearTimeout(timer);
      remove();
    };
  }, [open, canHover, hideTooltip]);

  if (!content) return null;

  const portaledTooltip =
    open &&
    coords &&
    typeof document !== 'undefined' &&
    createPortal(
      <span
        ref={tooltipRef}
        id={tooltipId}
        role="tooltip"
        dir={isRtl ? 'rtl' : 'ltr'}
        className={`${styles.tooltipFixed} ${isRtl ? styles.tooltipFixedRtl : ''}`}
        style={{
          top: coords.top,
          left: coords.left,
          maxWidth: coords.maxWidth,
          zIndex: TOOLTIP_Z_INDEX,
        }}
      >
        {content}
      </span>,
      document.body
    );

  return (
    <>
      <span
        className={styles.tooltipRoot}
        onMouseEnter={canHover ? showTooltip : undefined}
        onMouseLeave={canHover ? hideTooltip : undefined}
        onFocus={canHover ? showTooltip : undefined}
        onBlur={canHover ? hideTooltip : undefined}
      >
        <button
          ref={triggerRef}
          type="button"
          className={styles.tooltipTrigger}
          aria-label="Baggage allowance information"
          aria-describedby={open ? tooltipId : undefined}
          aria-expanded={!canHover ? open : undefined}
          onClick={canHover ? undefined : toggleTooltip}
          onPointerDown={(event) => {
            // Keep MobModal / parent Dialog from treating this as an outside press.
            if (!canHover) event.stopPropagation();
          }}
        >
          <InfoIcon size={16} weight="fill" className={styles.tooltipIcon} aria-hidden />
        </button>
      </span>
      {portaledTooltip}
    </>
  );
}
