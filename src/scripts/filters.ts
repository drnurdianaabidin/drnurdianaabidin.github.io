// Filtering on section pages: by type, by year and by search words.
// Cards that stay on screen glide to their new places, cards that leave
// fade out, and cards that arrive fade in. Nothing reloads.

const DURATION = 520;
const EASE = 'cubic-bezier(0.22, 0.61, 0.36, 1)';

export function initFilters() {
  const panel = document.querySelector<HTMLElement>('[data-filters]');
  const grid = document.querySelector<HTMLElement>('[data-grid]');
  if (!panel || !grid) return;
  panel.hidden = false;

  const cards = [...grid.querySelectorAll<HTMLElement>('[data-card]')];
  const buttons = [...panel.querySelectorAll<HTMLButtonElement>('[data-filter]')];
  const search = panel.querySelector<HTMLInputElement>('[data-search]');
  const results = document.querySelector<HTMLElement>('[data-results]');
  const empty = document.querySelector<HTMLElement>('[data-empty]');
  const clear = document.querySelector<HTMLButtonElement>('[data-clear]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const state = { type: '', year: '', q: '' };

  // Start from the address bar, so a filtered view can be shared as a link.
  const params = new URLSearchParams(location.search);
  state.type = params.get('type') ?? '';
  state.year = params.get('year') ?? '';
  state.q = params.get('q') ?? '';
  if (search) search.value = state.q;

  const matches = (card: HTMLElement) => {
    if (state.type && card.dataset.type !== state.type) return false;
    if (state.year && card.dataset.year !== state.year) return false;
    if (state.q) {
      const words = state.q.toLowerCase().split(/\s+/).filter(Boolean);
      const text = card.dataset.text ?? '';
      if (!words.every((w) => text.includes(w))) return false;
    }
    return true;
  };

  const syncButtons = () => {
    for (const button of buttons) {
      const key = button.dataset.filter as 'type' | 'year';
      button.setAttribute('aria-pressed', String(state[key] === (button.dataset.value ?? '')));
    }
  };

  const syncAddress = () => {
    const next = new URLSearchParams();
    if (state.type) next.set('type', state.type);
    if (state.year) next.set('year', state.year);
    if (state.q) next.set('q', state.q);
    const query = next.toString();
    history.replaceState(null, '', query ? `?${query}` : location.pathname);
  };

  let running: Animation[] = [];

  const apply = (animate: boolean) => {
    running.forEach((a) => a.cancel());
    running = [];

    const before = new Map(cards.filter((c) => !c.hidden).map((c) => [c, c.getBoundingClientRect()]));
    const shown = cards.filter(matches);
    const motion = animate && !reduceMotion.matches;

    const commit = () => {
      for (const card of cards) {
        card.hidden = !shown.includes(card);
        if (!card.hidden) card.querySelector('.reveal')?.classList.add('is-visible');
      }
      if (!motion) return;
      for (const card of shown) {
        const first = before.get(card);
        if (first) {
          const last = card.getBoundingClientRect();
          const dx = first.left - last.left;
          const dy = first.top - last.top;
          if (dx || dy) {
            running.push(
              card.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], {
                duration: DURATION,
                easing: EASE,
              })
            );
          }
        } else {
          running.push(
            card.animate(
              [
                { opacity: 0, transform: 'translateY(14px)' },
                { opacity: 1, transform: 'none' },
              ],
              { duration: DURATION, easing: EASE, delay: 80 }
            )
          );
        }
      }
    };

    const leaving = [...before.keys()].filter((c) => !shown.includes(c));
    if (motion && leaving.length) {
      const fades = leaving.map((card) =>
        card.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: 'ease-out', fill: 'forwards' })
      );
      running.push(...fades);
      Promise.all(fades.map((f) => f.finished))
        .then(() => {
          commit();
          fades.forEach((f) => f.cancel());
        })
        .catch(() => {});
    } else {
      commit();
    }

    if (results) {
      const n = shown.length;
      results.textContent =
        n === cards.length
          ? `${n} ${n === 1 ? 'entry' : 'entries'}`
          : `Showing ${n} of ${cards.length} ${cards.length === 1 ? 'entry' : 'entries'}`;
    }
    if (empty) empty.hidden = shown.length > 0;
    syncButtons();
  };

  for (const button of buttons) {
    button.addEventListener('click', () => {
      const key = button.dataset.filter as 'type' | 'year';
      state[key] = button.dataset.value ?? '';
      syncAddress();
      apply(true);
    });
  }

  let timer: number | undefined;
  search?.addEventListener('input', () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      state.q = search.value.trim();
      syncAddress();
      apply(true);
    }, 180);
  });

  clear?.addEventListener('click', () => {
    state.type = '';
    state.year = '';
    state.q = '';
    if (search) search.value = '';
    syncAddress();
    apply(true);
  });

  apply(false);
}
