(() => {
  const hero = document.querySelector('.hero');
  const portrait = document.querySelector('.hero-portrait');
  if (!hero || !portrait) return;
  const backdrop = document.querySelector('.jeff-backdrop');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = null;
  function render() {
    frame = null;
    const box = hero.getBoundingClientRect();
    const headerHeight = document.querySelector('header')?.offsetHeight || 0;
    const progress = reduced.matches ? 0 : Math.max(0, Math.min(1, (headerHeight - box.top) / Math.max(box.height, 1)));
    if (backdrop) backdrop.style.setProperty('--letter-shift', `${(48 * progress).toFixed(2)}px`);
    portrait.style.setProperty('--portrait-shift', `${(-64 * progress).toFixed(2)}px`);
    portrait.style.setProperty('--portrait-scale', (1 + 0.04 * progress).toFixed(4));
    portrait.style.setProperty('--portrait-tilt', `${(-3 * progress).toFixed(2)}deg`);
    portrait.style.setProperty('--portrait-shadow-y', `${(10 + 34 * progress).toFixed(2)}px`);
    portrait.style.setProperty('--portrait-shadow-blur', `${(14 + 36 * progress).toFixed(2)}px`);
  }
  function schedule() { if (frame === null) frame = requestAnimationFrame(render); }
  function syncPreference() {
    window.removeEventListener('scroll', schedule);
    if (!reduced.matches) window.addEventListener('scroll', schedule, {passive:true});
    schedule();
  }
  reduced.addEventListener('change', syncPreference);
  window.addEventListener('resize', schedule);
  window.addEventListener('pageshow', schedule);
  syncPreference();
})();
