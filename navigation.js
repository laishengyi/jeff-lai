const mobileMenu = document.querySelector('.mobile-menu');
if (mobileMenu) {
  const summary = mobileMenu.querySelector('summary');
  mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { mobileMenu.open = false; }));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && mobileMenu.open) { mobileMenu.open = false; summary.focus(); }
  });
  document.addEventListener('click', event => {
    if (mobileMenu.open && !mobileMenu.contains(event.target)) mobileMenu.open = false;
  });
  window.matchMedia('(min-width: 1024px)').addEventListener('change', event => {
    if (event.matches) mobileMenu.open = false;
  });
}

// Highlight the section actually in view, including after anchor navigation.
if (mobileMenu) {
  const sectionLinks = [...mobileMenu.querySelectorAll('.menu-section')];
  const sections = [...document.querySelectorAll('main section[id]')];
  let queued = false;
  function updateCurrentSection() {
    const boundary = (document.querySelector('header')?.offsetHeight || 64) + 100;
    let current = '';
    sections.forEach(section => { if (section.getBoundingClientRect().top <= boundary) current = section.id; });
    sectionLinks.forEach(link => {
      if (link.getAttribute('href') === '#' + current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    queued = false;
  }
  function scheduleSectionUpdate() {
    if (!queued) { queued = true; requestAnimationFrame(updateCurrentSection); }
  }
  window.addEventListener('scroll', scheduleSectionUpdate, {passive:true});
  window.addEventListener('resize', scheduleSectionUpdate);
  window.addEventListener('hashchange', scheduleSectionUpdate);
  window.addEventListener('pageshow', scheduleSectionUpdate);
  updateCurrentSection();
}
