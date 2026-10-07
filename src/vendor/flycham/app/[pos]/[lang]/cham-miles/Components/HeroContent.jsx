"use client";

import { useCallback, useRef } from 'react';
import { motion, useTransform, useMotionValue } from 'framer-motion';
import { useParams } from 'next/navigation';
import { ANIMATION_CONFIG } from '../shared/constants';

const chamMilesLogo = '/cham-miles/cham-miles-logo.png';

export default function HeroContent({
    title,
    description,
    heroContainerVariants,
    onEnterAnimationComplete,
    scrollProgress,
    scale: scaleProp,
}) {
    const notifiedRef = useRef(false);
    const handleGroupRevealed = useCallback(() => {
        if (notifiedRef.current) return;
        notifiedRef.current = true;
        onEnterAnimationComplete?.();
    }, [onEnterAnimationComplete]);

    const fallback = useMotionValue(0);
    const progress = scrollProgress ?? fallback;
    const y = useTransform(progress, [0, 0.6, 0.85, 1], [0, -120, -200, -200]);
    // Scale can be driven from the parent (ChamMilesCanvasHero) via the `scale`
    // prop; when it isn't, fall back to this internal scroll-linked curve.
    const autoScale = useTransform(progress, [0, 0.6, 0.85, 1], [1, 0.9, 0.86, 0.86]);
    const scale = scaleProp ?? autoScale;

    const params = useParams();
    const langParam = params?.lang;
    const isAr = (Array.isArray(langParam) ? langParam[0] : langParam) === 'ar';

    // All hero elements share ONE entrance — no per-item sequential reveal.
    // A soft fade + gentle rise (in place), on the SAME delay, duration and ease
    // as the header and scroll indicator so the whole hero materialises in one
    // synchronized beat once the brand gradient settles.
    const introDelay =
        ANIMATION_CONFIG.gradientDelay + ANIMATION_CONFIG.gradientDuration + 0.1;

    return (
        <motion.div
            className={[
                'relative z-10 flex flex-col items-center justify-center text-center px-6 will-change-transform',
                // Content-sized stack — parent `.cm-hero-intro-center` flex-centers
                // it in the viewport from the first paint (not only after GSAP
                // scale-down). Avoid min-height / negative margins that shift
                // the visual center before the scrub starts.
                'cm-hero-mobile-min-h m-0 h-auto min-h-0 w-full py-0',
            ].join(' ')}
            variants={heroContainerVariants}
            initial="hidden"
            animate="visible"
            style={
                scrollProgress || scaleProp
                    ? { y, scale, willChange: 'transform', backfaceVisibility: 'hidden' }
                    : undefined
            }
        >
            {/* Logo → title → description, displayed all at once and revealed as
                a single synchronized soft fade + gentle rise group — same delay,
                duration and ease as the header + scroll indicator. */}
            <motion.div
                className="cm-hero-intro-stack flex flex-col items-center justify-center gap-4 max-md:gap-3 md:gap-7"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: ANIMATION_CONFIG.smoothEase, delay: introDelay }}
                onAnimationComplete={handleGroupRevealed}
                style={{ transformOrigin: '50% 50%' }}
            >
                <img
                    src={chamMilesLogo}
                    alt="ChamMiles"
                    className="cm-hero-intro-logo h-[52px] md:h-[72px] xl:h-[72px] 2xl:h-[84px] w-auto"
                />

                <h1
                    dir={isAr ? 'rtl' : 'ltr'}
                    lang={isAr ? 'ar' : undefined}
                    className={[
                        'cm-hero-intro-title text-(--cm-hero-text) font-semibold text-[32px] md:text-6xl xl:text-6xl 2xl:text-7xl tracking-tight leading-none',
                        isAr ? 'cm-hero-intro-title--ar' : '',
                    ].join(' ')}
                >
                    {title}
                </h1>

                <p
                    dir={isAr ? 'rtl' : 'ltr'}
                    lang={isAr ? 'ar' : undefined}
                    className={[
                        'cm-hero-intro-desc',
                        'max-w-[320px] md:max-w-[680px]   2xl:max-w-[680px]',
                        'text-(--cm-hero-text)/90 text-[15px] md:text-[18px] xl:text-[18px] 2xl:text-[20px] leading-snug',
                        isAr ? 'cm-hero-intro-desc--ar text-right' : 'text-center',
                    ].join(' ')}
                >
                    {description}
                </p>
            </motion.div>
        </motion.div>
    );
}
