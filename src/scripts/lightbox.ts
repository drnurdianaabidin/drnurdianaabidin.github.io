// Full-screen photo viewer for galleries.

export function initLightbox() {
  const dialog = document.querySelector<HTMLDialogElement>('[data-lightbox]');
  const gallery = document.querySelector<HTMLElement>('[data-gallery]');
  if (!dialog || !gallery || typeof dialog.showModal !== 'function') return;

  const links = [...gallery.querySelectorAll<HTMLAnchorElement>('a[data-index]')];
  const img = dialog.querySelector<HTMLImageElement>('[data-img]')!;
  const caption = dialog.querySelector<HTMLElement>('[data-caption]')!;
  const count = dialog.querySelector<HTMLElement>('[data-count]')!;
  const stage = dialog.querySelector<HTMLElement>('[data-stage]')!;
  const prev = dialog.querySelector<HTMLButtonElement>('[data-prev]')!;
  const next = dialog.querySelector<HTMLButtonElement>('[data-next]')!;
  const close = dialog.querySelector<HTMLButtonElement>('[data-close]')!;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let current = 0;
  let opener: HTMLElement | null = null;

  const preload = (i: number) => {
    const link = links[(i + links.length) % links.length];
    if (!link) return;
    const pre = new Image();
    pre.sizes = '100vw';
    pre.srcset = link.dataset.srcset ?? '';
    pre.src = link.href;
  };

  const show = (i: number, animate = true) => {
    current = (i + links.length) % links.length;
    const link = links[current];
    const swap = () => {
      img.sizes = '100vw';
      img.srcset = link.dataset.srcset ?? '';
      img.src = link.href;
      img.alt = link.dataset.alt ?? '';
      caption.textContent = link.dataset.caption || link.dataset.alt || '';
      count.textContent = `${current + 1} / ${links.length}`;
      img.classList.remove('is-changing');
    };
    if (animate && !reduceMotion.matches && dialog.open) {
      img.classList.add('is-changing');
      window.setTimeout(swap, 220);
    } else {
      swap();
    }
    preload(current + 1);
    preload(current - 1);
  };

  const single = links.length < 2;
  prev.hidden = single;
  next.hidden = single;

  links.forEach((link, i) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      opener = link;
      show(i, false);
      dialog.showModal();
      close.focus();
    });
  });

  prev.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));
  close.addEventListener('click', () => dialog.close());

  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      show(current - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      show(current + 1);
    }
  });

  dialog.addEventListener('close', () => {
    document.documentElement.style.overflow = '';
    opener?.focus();
  });
  dialog.addEventListener('click', (event) => {
    if (event.target === stage) dialog.close();
  });

  const lock = new MutationObserver(() => {
    document.documentElement.style.overflow = dialog.open ? 'hidden' : '';
  });
  lock.observe(dialog, { attributes: true, attributeFilter: ['open'] });

  // Swipe on touch screens
  let startX = 0;
  let startY = 0;
  let tracking = false;
  stage.addEventListener(
    'touchstart',
    (event) => {
      if (event.touches.length !== 1) return;
      tracking = true;
      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
    },
    { passive: true }
  );
  stage.addEventListener(
    'touchend',
    (event) => {
      if (!tracking) return;
      tracking = false;
      const dx = event.changedTouches[0].clientX - startX;
      const dy = event.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        show(current + (dx < 0 ? 1 : -1));
      }
    },
    { passive: true }
  );
}
