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
