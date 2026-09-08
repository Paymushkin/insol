(() => {
  const burger = document.querySelector('[data-burger]');
  const panel = document.querySelector('[data-burger-panel]');
  const page = document.querySelector('.page');
  const header = document.querySelector('.header');
  if (!burger || !panel) return;

  const syncHeader = () => {
    if (!header) return;
    const scrolled = window.scrollY > 8;
    const menuOpen = burger.getAttribute('aria-expanded') === 'true';
    header.classList.toggle('header--scrolled', scrolled && !menuOpen);
  };

  const setOpen = (open) => {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    panel.classList.toggle('is-open', open);
    page.classList.toggle('is-locked', open);
    syncHeader();
  };

  const close = () => setOpen(false);

  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') === 'true';
    setOpen(!open);
  });

  panel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', close);
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });

  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });
})();
