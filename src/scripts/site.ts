// Small behaviours shared by every page: the light and dark switch, the
// menu button on narrow screens, the header shadow and the quiet fade-in of
// content as it scrolls into view.

const root = document.documentElement;
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function currentTheme(): 'light' | 'dark' {
  const set = root.dataset.theme;
  if (set === 'light' || set === 'dark') return set;
  return prefersDark.matches ? 'dark' : 'light';
}

function labelToggles() {
  const next = currentTheme() === 'dark' ? 'Light' : 'Dark';
  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((button) => {
    const text = button.querySelector('[data-theme-label]');
    if (text) text.textContent = next;
    button.setAttribute('aria-label', `Switch to ${next.toLowerCase()} mode`);
  });
}

document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((button) => {
  button.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* private browsing: the choice lasts for this page only */
    }
    labelToggles();
  });
});
prefersDark.addEventListener('change', labelToggles);
labelToggles();

// Menu button on narrow screens
const menuButton = document.querySelector<HTMLButtonElement>('[data-menu-button]');
const menu = document.querySelector<HTMLElement>('[data-menu]');
if (menuButton && menu) {
  menuButton.hidden = false;
  const setOpen = (open: boolean) => {
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.querySelector('.menu-button__text')!.textContent = open ? 'Close' : 'Menu';
    if (open) menu.setAttribute('data-open', '');
    else menu.removeAttribute('data-open');
  };
  menuButton.addEventListener('click', () => setOpen(menuButton.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      menuButton.focus();
    }
  });
}

// A soft shadow under the header once the page has scrolled
const header = document.querySelector<HTMLElement>('[data-header]');
if (header) {
  const onScroll = () => header.toggleAttribute('data-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// Scroll reveal
const revealables = document.querySelectorAll<HTMLElement>('.reveal');
if (reduceMotion.matches || !('IntersectionObserver' in window)) {
  revealables.forEach((el) => el.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
  );
  revealables.forEach((el) => observer.observe(el));
}

// Figures that count up once when they come into view
const counters = document.querySelectorAll<HTMLElement>('[data-count]');
if (counters.length && !reduceMotion.matches && 'IntersectionObserver' in window) {
  const countObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        countObserver.unobserve(el);
        const target = Number(el.dataset.count);
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / 1400);
          el.textContent = String(Math.round(target * (1 - Math.pow(1 - t, 3))));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    },
    { threshold: 0.6 }
  );
  counters.forEach((el) => countObserver.observe(el));
}
