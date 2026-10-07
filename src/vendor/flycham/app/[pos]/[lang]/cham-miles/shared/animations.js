/** Framer Motion variants shared by the cham-miles canvas hero. */

export const getHeroContainerVariants = (gradientEndDelay) => ({
  hidden: {},
  visible: { transition: { delayChildren: gradientEndDelay + 0.1 } },
});
