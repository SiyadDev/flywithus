// Shared motion plumbing:
// - one passive scroll listener, batched into a single requestAnimationFrame per frame
// - `whileVisible` starts/stops looping work only while an element is on screen
// - a site-wide "pause motion" switch (footer button), remembered per visitor

export const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

type Fn = () => void;
const scrollSubs = new Set<Fn>();
let queued = false;
const flush = () => {
  queued = false;
  scrollSubs.forEach((fn) => fn());
};
window.addEventListener(
  'scroll',
  () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(flush);
    }
  },
  { passive: true },
);

/** Run `fn` at most once per frame while scrolling (and once right away). */
export function onScroll(fn: Fn) {
  scrollSubs.add(fn);
  fn();
  return () => scrollSubs.delete(fn);
}

/** Call `start` when `el` scrolls into view and `stop` when it leaves. */
export function whileVisible(el: Element, start: Fn, stop: Fn, rootMargin = '0px') {
  let on = false;
  const io = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting && !on) {
        on = true;
        start();
      } else if (!e.isIntersecting && on) {
        on = false;
        stop();
      }
    },
    { rootMargin },
  );
  io.observe(el);
  return () => io.disconnect();
}

/* ── Pause motion ── */
const KEY = 'fwu-motion-paused';
const root = document.documentElement;
let paused = false;
try {
  paused = localStorage.getItem(KEY) === '1';
} catch {}
root.classList.toggle('motion-paused', paused);
const pauseSubs = new Set<(p: boolean) => void>();

export const motionPaused = () => paused || document.hidden;
export function setMotionPaused(p: boolean) {
  paused = p;
  root.classList.toggle('motion-paused', p);
  try {
    localStorage.setItem(KEY, p ? '1' : '0');
  } catch {}
  pauseSubs.forEach((fn) => fn(p));
}
export function onPauseChange(fn: (p: boolean) => void) {
  pauseSubs.add(fn);
  return () => pauseSubs.delete(fn);
}
