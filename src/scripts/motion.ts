// Site-wide motion: scroll reveals, split headings, parallax and counters.
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Reveal on scroll. Clip-revealed elements are fully clipped (and so never
// "intersect"), so we watch their parent and reveal them through it.
const targets = new Map<Element, Element[]>();
const revealIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const list = targets.get(e.target) ?? [];
      const top = e.boundingClientRect.top;
      list.forEach((el) => {
        // For a watched parent, only reveal children that have actually reached the viewport.
        if (el === e.target || el.getBoundingClientRect().top < window.innerHeight * 0.92 || top < 0) el.classList.add('in');
      });
      const left = list.filter((el) => !el.classList.contains('in'));
      if (left.length) targets.set(e.target, left);
      else {
        targets.delete(e.target);
        revealIO.unobserve(e.target);
      }
    });
  },
  { rootMargin: '0px 0px -8% 0px', threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
);
document.querySelectorAll('[data-reveal], [data-split]').forEach((el) => {
  const watch = (el as HTMLElement).dataset.reveal === 'clip' ? el.parentElement! : el;
  targets.set(watch, [...(targets.get(watch) ?? []), el]);
});
targets.forEach((_, w) => revealIO.observe(w));

// Count-up numbers
const countIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target as HTMLElement;
      countIO.unobserve(el);
      const to = Number(el.dataset.countTo);
      const dec = Number(el.dataset.decimals ?? 0);
      if (reduce) return;
      const dur = 1600;
      const t0 = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / dur);
        const v = to * (1 - Math.pow(1 - t, 4));
        el.textContent = v.toFixed(dec);
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  },
  { threshold: 0.6 },
);
document.querySelectorAll('[data-count-to]').forEach((el) => countIO.observe(el));

// Parallax
if (!reduce) {
  const layers = [...document.querySelectorAll<HTMLElement>('[data-parallax]')];
  const imgs = [...document.querySelectorAll<HTMLElement>('[data-parallax-img]')];
  let ticking = false;
  const update = () => {
    const vh = window.innerHeight;
    layers.forEach((el) => {
      const speed = Number(el.dataset.parallax);
      el.style.transform = `translate3d(0, ${window.scrollY * speed}px, 0)`;
    });
    imgs.forEach((el) => {
      const r = el.parentElement!.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      const p = (r.top + r.height / 2 - vh / 2) / vh;
      el.style.transform = `translate3d(0, ${p * -40}px, 0)`;
    });
    ticking = false;
  };
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  update();
}
