document.querySelectorAll('.portfolio-gallery').forEach(gallery => {
  const buttons = [...document.querySelectorAll(`[data-gallery="${gallery.id}"]`)];
  function update() {
    const max = gallery.scrollWidth - gallery.clientWidth;
    buttons.forEach(button => { button.disabled = Number(button.dataset.step) < 0 ? gallery.scrollLeft <= 2 : gallery.scrollLeft >= max - 2; });
  }
  function move(direction) {
    const card = gallery.querySelector('.gallery-card');
    if (!card) return;
    const step = card.getBoundingClientRect().width + (parseFloat(getComputedStyle(gallery).gap) || 0);
    gallery.scrollBy({left: direction * step, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  }
  buttons.forEach(button => button.addEventListener('click', () => move(Number(button.dataset.step))));
  gallery.addEventListener('keydown', event => {
    if (event.target !== gallery || !['ArrowLeft','ArrowRight'].includes(event.key)) return;
    event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1);
  });
  gallery.addEventListener('scroll', update, {passive:true});
  window.addEventListener('resize', update);
  window.addEventListener('load', update);
  update();
});
