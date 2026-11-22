(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Entradas suaves al hacer scroll.
  const items = document.querySelectorAll('.reveal');
  if (reduce.matches || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    items.forEach((el) => io.observe(el));
  }

  // Menú móvil.
  const btn = document.querySelector('.nav__menu');
  const menu = document.getElementById('mobileMenu');
  if (btn && menu) {
    const setOpen = (open) => {
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      menu.hidden = !open;
    };
    btn.addEventListener('click', () => setOpen(menu.hidden));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  }

  // Botón de compra deshabilitado (ejercicio sin venta real).
  document.querySelectorAll('[aria-disabled="true"]').forEach((a) =>
    a.addEventListener('click', (e) => e.preventDefault())
  );
})();

// Giro del reloj: la secuencia de fotogramas avanza con el scroll dentro de la sección fija.
(() => {
  const section = document.querySelector('.spin');
  if (!section) return;
  const canvas = section.querySelector('.spin__canvas');
  const ctx = canvas.getContext('2d');
  const steps = [...section.querySelectorAll('.spin__steps li')];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FRAMES = 120;
  const frames = new Array(FRAMES);
  let drawn = -1, ticking = false, loading = false;

  const size = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    drawn = -1;
  };
  const draw = (i) => {
    let img = frames[i];
    for (let d = 1; (!img || !img.complete) && d < FRAMES; d++) img = frames[i - d];
    if (!img || !img.complete || !img.naturalWidth) return;
    const cw = canvas.width, ch = canvas.height, r = img.naturalWidth / img.naturalHeight;
    let w, h;
    if (r > cw / ch) { h = ch; w = ch * r; } else { w = cw; h = cw / r; }
    const x = window.innerWidth < 768 ? (cw - w) * 0.5 : (cw - w) / 2;
    ctx.drawImage(img, x, (ch - h) / 2, w, h);
    drawn = i;
  };
  const progress = () => {
    const total = section.offsetHeight - window.innerHeight;
    return Math.min(1, Math.max(0, (window.scrollY - section.offsetTop) / total));
  };
  const update = () => {
    ticking = false;
    const p = progress();
    const i = Math.round(p * (FRAMES - 1));
    if (i !== drawn) draw(i);
    const active = Math.min(steps.length - 1, Math.floor(p * steps.length));
    steps.forEach((li, k) => li.classList.toggle('is-active', k === active));
  };
  const load = (list) => list.forEach((n) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => { if (drawn < 0 || reduce) reduce ? draw(n - 1) : update(); };
    img.src = `assets/frames/f${String(n).padStart(3, '0')}.webp`;
    frames[n - 1] = img;
  });

  size();
  window.addEventListener('resize', () => { size(); reduce ? draw(FRAMES - 1) : update(); });

  if (reduce) { load([FRAMES]); return; }   // movimiento reducido: solo el primer plano final

  // Carga los fotogramas recién cuando la sección se acerca, para no frenar el hero.
  new IntersectionObserver((entries, io) => {
    if (entries[0].isIntersecting && !loading) {
      loading = true;
      load(Array.from({ length: FRAMES }, (_, k) => k + 1));
      io.disconnect();
    }
  }, { rootMargin: '100% 0px' }).observe(section);

  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
})();
