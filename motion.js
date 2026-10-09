// Entrance and scroll choreography. Everything here is decorative: the page is complete
// without it, and the inline head script plus a CSS fallback reveal content if this file
// never runs. Reduced-motion users never get the `motion` class, so none of this applies.
(() => {
  const root = document.documentElement;
  if (!root.classList.contains('motion')) return;

  // Split headings at <br> into masked lines so each line can rise into place.
  document.querySelectorAll('.hero h1, main h2').forEach(heading => {
    const lines = heading.innerHTML.split(/<br\s*\/?>/i);
    heading.innerHTML = lines
      .map((line, i) => `<span class="m-line"><span class="m-line-inner" style="--i:${i}">${line}</span></span>`)
      .join('');
    heading.dataset.m = 'lines';
  });

  // Groups whose children enter one after another.
  const groups = [
    ['.section-top', null],
    ['.about-grid > div:last-child', ':scope > p, :scope > .skills > span'],
    ['.career-track', ':scope > a'],
    ['.journey-heading .filters', ':scope > button'],
    ['.result-grid', ':scope > div'],
    ['.work-jump', ':scope > a'],
    ['.chapters', ':scope > button'],
    ['.portfolio-gallery', ':scope > .gallery-card'],
    ['.edu-grid', ':scope > article'],
    ['.contact-bottom', ':scope > *']
  ];
  // A group is observed as a whole and starts all its children together (staggered), so
  // items inside collapsed details or off-screen in a sideways gallery are never left hidden.
  groups.forEach(([groupSelector, childSelector]) => {
    document.querySelectorAll(groupSelector).forEach(group => {
      if (!childSelector) { group.dataset.m = 'rise'; return; }
      group.dataset.mGroup = '';
      group.querySelectorAll(childSelector).forEach((child, i) => {
        child.dataset.m = 'rise';
        child.dataset.mChild = '';
        child.style.setProperty('--i', Math.min(i, 6));
      });
    });
  });
  document.querySelectorAll('.career-track, #journey .entry').forEach(el => { el.dataset.mDraw = ''; });
  document.querySelectorAll('.project-lead, .video-frame, .gallery-tools, .contact .email, .timeline-note, .work-heading > div > p, .work-number')
    .forEach(el => { el.dataset.m = 'rise'; });

  // Once an entrance finishes, drop it so hover transforms and transitions work normally.
  document.addEventListener('animationend', event => {
    const el = event.target;
    if (el.dataset && el.dataset.m === 'rise' && event.animationName === 'm-rise') el.classList.add('m-done');
  });

  const pending = new Set();
  function start(el) {
    pending.delete(el);
    observer.unobserve(el);
    el.classList.add('m-in');
    if ('mGroup' in el.dataset) el.querySelectorAll('[data-m-child]').forEach(child => child.classList.add('m-in'));
  }
  const observer = new IntersectionObserver(items => {
    items.forEach(item => { if (item.isIntersecting) start(item.target); });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('[data-m], [data-m-draw], [data-m-group]').forEach(el => {
    if (el.closest('.hero') || 'mChild' in el.dataset) return;
    pending.add(el);
    observer.observe(el);
  });
  // Safety net for fast flings: anything already scrolled past starts at once.
  function sweep() {
    pending.forEach(el => {
      const box = el.getBoundingClientRect();
      if ((box.width || box.height) && box.bottom < innerHeight * 0.94) start(el);
    });
  }

  // Filtered-in timeline entries should not wait for another scroll.
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('#journey .entry').forEach(entry => entry.classList.add('m-in'));
  }));

  // Hero opening sequence starts after the first frame is painted.
  // __motion tells the head script's safety timer that the choreography is running.
  requestAnimationFrame(() => requestAnimationFrame(() => { root.classList.add('m-ready'); window.__motion = true; }));

  // Reading progress line under the header.
  const bar = document.createElement('div');
  bar.className = 'm-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  let frame = null;
  function update() {
    frame = null;
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
    if (pending.size) sweep();
  }
  addEventListener('scroll', () => { if (frame === null) frame = requestAnimationFrame(update); }, { passive: true });
  addEventListener('resize', update);
  update();
})();
