/** Map arrow keys to synthetic wheel deltas for the cham-miles scroll-jack flow. */
export function keyboardToWheelDelta(key) {
  if (key === 'ArrowUp' || key === 'ArrowLeft') return -100;
  if (key === 'ArrowDown' || key === 'ArrowRight') return 100;
  return null;
}

export function isKeyboardScrollBlockedTarget(target) {
  if (!target || typeof target !== 'object') return false;
  const tag = target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  if (target.isContentEditable) return true;
  return false;
}

export function dispatchSyntheticWheel(onWheel, deltaY) {
  onWheel({
    deltaY,
    preventDefault: () => {},
    stopPropagation: () => {},
  });
}
