const reveals = [...document.querySelectorAll('.reveal')];
if ('IntersectionObserver' in window) {
  document.documentElement.classList.add('js');
  const observer = new IntersectionObserver(items => {
    items.forEach(item => {
      if (item.isIntersecting) {
        item.target.classList.add('visible');
        observer.unobserve(item.target);
      }
    });
  }, { threshold: 0.08 });
  reveals.forEach(el => observer.observe(el));
}

const filters = [...document.querySelectorAll('[data-filter]')];
const entries = [...document.querySelectorAll('.entry')];
function filterEntries(category) {
  filters.forEach(button => {
    const selected = button.dataset.filter === category;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  entries.forEach(entry => {
    entry.hidden = category !== 'all' && entry.dataset.category !== category;
    if (!entry.hidden) entry.classList.add('visible');
  });
}
filters.forEach(button => {
  const total = button.dataset.filter === 'all' ? entries.length : entries.filter(entry => entry.dataset.category === button.dataset.filter).length;
  if (button.insertAdjacentHTML) button.insertAdjacentHTML('beforeend', `<span class="count" aria-label="共 ${total} 筆">${total}</span>`);
  button.addEventListener('click', () => filterEntries(button.dataset.filter));
});

function openEntry(id) {
  const entry = entries.find(item => item.id === id);
  if (!entry) return false;
  filterEntries('all');
  entry.open = true;
  entry.classList.add('visible');
  return true;
}
document.querySelectorAll('[data-open]').forEach(link => {
  link.addEventListener('click', () => openEntry(link.dataset.open));
});
function revealHash() {
  let id;
  try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
  if (openEntry(id)) {
    requestAnimationFrame(() => document.getElementById(id).scrollIntoView({ block: 'start', behavior: 'instant' }));
  }
}
window.addEventListener('hashchange', revealHash);
revealHash();

const video = document.querySelector('video');
const chapters = [...document.querySelectorAll('[data-seek]')];
if (video && chapters.length) {
  function updateChapter() {
    let active = chapters[0];
    chapters.forEach(button => {
      if (video.currentTime >= Number(button.dataset.seek)) active = button;
    });
    chapters.forEach(button => {
      const selected = button === active;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    const label = document.querySelector('#chapter-name');
    if (label) label.textContent = active.textContent.replace(/\d\d:\d\d|↗/g, '').trim();
  }
  let pendingSeek = null;
  function playChapter(time) {
    video.currentTime = time;
    updateChapter();
    const playback = video.play();
    if (playback) playback.catch(() => {});
  }
  video.addEventListener('loadedmetadata', () => {
    if (pendingSeek !== null) {
      const time = pendingSeek;
      pendingSeek = null;
      playChapter(time);
    }
  });
  chapters.forEach(button => button.addEventListener('click', () => {
    const time = Number(button.dataset.seek);
    if (video.readyState >= 1) playChapter(time);
    else { pendingSeek = time; video.load(); }
  }));
  video.addEventListener('timeupdate', updateChapter);
  updateChapter();
}

// Use the rendered hero boundary so resizing and direct links stay in sync.
const siteHeader = document.querySelector('header');
const homeHero = document.querySelector('.hero');
if (siteHeader && homeHero) {
  let headerFramePending = false;
  function updateHeaderTheme() {
    siteHeader.classList.toggle('is-scrolled', homeHero.getBoundingClientRect().bottom <= siteHeader.offsetHeight);
    headerFramePending = false;
  }
  function scheduleHeaderTheme() {
    if (headerFramePending) return;
    headerFramePending = true;
    requestAnimationFrame(updateHeaderTheme);
  }
  window.addEventListener('scroll', scheduleHeaderTheme, { passive: true });
  window.addEventListener('resize', scheduleHeaderTheme);
  window.addEventListener('pageshow', updateHeaderTheme);
  updateHeaderTheme();
}
