(() => {
  const modal = document.querySelector('[data-modal="demo"]');
  if (!modal) return;

  const dialog = modal.querySelector('.modal__dialog');
  const page = document.querySelector('.page');
  const closers = modal.querySelectorAll('[data-modal-close]');

  const open = () => {
    modal.classList.add('is-open');
    page.classList.add('is-locked');
    modal.setAttribute('aria-hidden', 'false');
    const focusable = dialog.querySelector('input, select, textarea, button');
    focusable?.focus();
  };

  const close = () => {
    modal.classList.remove('is-open');
    page.classList.remove('is-locked');
    modal.setAttribute('aria-hidden', 'true');
  };

  document.addEventListener('click', (event) => {
    const opener = event.target.closest('[data-modal-open="demo"]');
    if (!opener) return;
    event.preventDefault();
    open();
  });

  closers.forEach((btn) => btn.addEventListener('click', close));

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) close();
  });
})();
