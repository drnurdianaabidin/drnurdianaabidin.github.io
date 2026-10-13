// The home page background: points drifting slowly and joining up when they
// come close, like a molecular or neural network. It is decoration only.
//
// - On phones, and for visitors who ask for reduced motion, it draws one
//   still frame and stops.
// - It pauses when it is off screen or the tab is hidden.
// - A button lets visitors pause and resume it.

type Node = { x: number; y: number; vx: number; vy: number; r: number; violet: boolean };

export function initHero() {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-hero-canvas]');
  const pause = document.querySelector<HTMLButtonElement>('[data-hero-pause]');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const small = window.matchMedia('(max-width: 760px)');
  let nodes: Node[] = [];
  let width = 0;
  let height = 0;
  let frame = 0;
  let running = false;
  let userPaused = false;
  let onScreen = true;
  const pointer = { x: -9999, y: -9999 };
  const LINK = 140;

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(small.matches ? 28 : 90, Math.round((width * height) / 15000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      r: 1.2 + Math.random() * 1.8,
      violet: Math.random() < 0.35,
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d = Math.hypot(dx, dy);
        if (d < LINK) {
          ctx.strokeStyle = `rgba(154, 220, 214, ${(1 - d / LINK) * 0.28})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      const pd = Math.hypot(a.x - pointer.x, a.y - pointer.y);
      if (pd < 170) {
        ctx.strokeStyle = `rgba(195, 186, 242, ${(1 - pd / 170) * 0.45})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(pointer.x, pointer.y);
        ctx.stroke();
      }
    }
    for (const n of nodes) {
      ctx.fillStyle = n.violet ? 'rgba(195, 186, 242, 0.9)' : 'rgba(154, 220, 214, 0.9)';
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const step = () => {
    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < -20) n.x = width + 20;
      if (n.x > width + 20) n.x = -20;
      if (n.y < -20) n.y = height + 20;
      if (n.y > height + 20) n.y = -20;
    }
    draw();
    frame = requestAnimationFrame(step);
  };

  const animated = () => !reduceMotion.matches && !small.matches;

  const update = () => {
    const shouldRun = animated() && !userPaused && onScreen && document.visibilityState === 'visible';
    if (shouldRun && !running) {
      running = true;
      frame = requestAnimationFrame(step);
    } else if (!shouldRun && running) {
      running = false;
      cancelAnimationFrame(frame);
    }
    if (pause) {
      pause.hidden = !animated();
      pause.setAttribute('aria-pressed', String(userPaused));
      pause.querySelector('[data-hero-pause-label]')!.textContent = userPaused ? 'Play background' : 'Pause background';
    }
  };

  resize();
  draw();
  update();

  new ResizeObserver(() => {
    resize();
    draw();
  }).observe(canvas);
  new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    update();
  }).observe(canvas);
  document.addEventListener('visibilitychange', update);
  reduceMotion.addEventListener('change', update);
  small.addEventListener('change', () => {
    resize();
    draw();
    update();
  });
  pause?.addEventListener('click', () => {
    userPaused = !userPaused;
    update();
  });
  canvas.parentElement?.addEventListener('pointermove', (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
  });
  canvas.parentElement?.addEventListener('pointerleave', () => {
    pointer.x = -9999;
    pointer.y = -9999;
  });
}
