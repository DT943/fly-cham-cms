"use client";

/**
 * useCanvasFrames
 * ---------------
 * Owns the <canvas> image-sequence rendering for the hero: preloads every
 * frame, sizes the canvas to the viewport in device pixels, and paints the
 * frame that matches the current scrubbed index with `object-fit: cover`
 * behaviour. The GSAP timeline (useHeroScrollTimeline) drives which frame is
 * shown by tweening `frameStateRef` and calling the paint closure exposed on
 * `drawCurrentFrameRef` — both refs are owned by the component and shared here.
 *
 * Returns `{ ready }`, a one-shot flag that flips true once every frame has
 * finished decoding (used to drop the loading spinner). No per-frame React
 * state — everything the render loop touches lives in refs.
 */

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { IMAGE_URLS, LAST_FRAME } from "./heroConfig";

export function useCanvasFrames({ canvasRef, frameStateRef, drawCurrentFrameRef }) {
  const ctxRef = useRef(null);
  const imagesRef = useRef([]); // HTMLImageElement[] indexed 0..LAST_FRAME
  const firstLoadedRef = useRef(null); // first image that finished decoding
  const lastDrawnRef = useRef(-1); // last frame index actually painted

  // The only state: a one-shot "all frames ready" flag to drop the spinner.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    ctxRef.current = canvas.getContext("2d");

    const images = imagesRef.current;

    // Draw one image with `object-fit: cover` behaviour into the (device-pixel)
    // canvas: scale to fill, center, crop the overflow — never stretch.
    // Skip clearRect: frames are full-bleed opaque, and clearing first flashes
    // the brand-gradient backdrop for one paint (most visible at the last frame
    // when the swipe gate snaps scroll and scrub redraws rapidly).
    const drawCover = (img) => {
      const ctx = ctxRef.current;
      if (!ctx || !img) return;
      const iw = img.naturalWidth || img.width;
      const ih = img.naturalHeight || img.height;
      if (!iw || !ih) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const scale = Math.max(cw / iw, ch / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (cw - dw) / 2;
      const dy = (ch - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);
    };

    // Paint the frame that matches the current scrubbed index. `force` bypasses
    // the "same frame" guard (used on resize so the current frame re-fits).
    const drawCurrentFrame = (force) => {
      let idx = Math.round(frameStateRef.current.frame);
      if (idx < 0) idx = 0;
      else if (idx > LAST_FRAME) idx = LAST_FRAME;
      if (!force && idx === lastDrawnRef.current) return;

      const img = images[idx];
      if (img && img.complete && (img.naturalWidth || img.width)) {
        drawCover(img);
        lastDrawnRef.current = idx;
      } else if (firstLoadedRef.current) {
        // Target frame not decoded yet — show the nearest available frame so the
        // canvas is never blank. Don't latch lastDrawnRef so it repaints once the
        // real frame arrives.
        drawCover(firstLoadedRef.current);
      }
    };
    // Expose for the ScrollTrigger effect.
    drawCurrentFrameRef.current = drawCurrentFrame;

    // Size the canvas to the viewport in device pixels for crisp output, then
    // repaint the current frame. Capped DPR keeps huge retina/mobile canvases
    // from thrashing the GPU.
    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctxRef.current = canvas.getContext("2d");
      drawCurrentFrame(true);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("orientationchange", resizeCanvas);

    // ── Preload every frame ───────────────────────────────────────────────
    let cancelled = false;
    let loadedCount = 0;
    IMAGE_URLS.forEach((url, i) => {
      const img = new Image();
      img.decoding = "async";
      const done = () => {
        if (cancelled) return;
        loadedCount += 1;
        if (!firstLoadedRef.current && img.naturalWidth) firstLoadedRef.current = img;
        // Draw the first frame the instant it (or any frame) is available so the
        // canvas shows content immediately instead of the bare backdrop.
        if (i === 0 || lastDrawnRef.current === -1) drawCurrentFrame(true);
        if (loadedCount === IMAGE_URLS.length) {
          setReady(true);
          drawCurrentFrame(true);
          // Layout/measurements may have shifted while images decoded.
          ScrollTrigger.refresh();
        }
      };
      img.onload = done;
      img.onerror = done; // count errors too so `ready` can't hang
      img.src = url;
      images[i] = img;
    });

    return () => {
      cancelled = true;
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("orientationchange", resizeCanvas);
      drawCurrentFrameRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ready };
}
