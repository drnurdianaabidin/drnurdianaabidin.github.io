// Small behaviours shared by every page: the light and dark switch and the
// quiet fade-in of content as it scrolls into view.

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
