(() => {
  const modal = document.querySelector('[data-modal="demo"]');
  if (!modal) return;

  const dialog = modal.querySelector('.modal__dialog');
  const page = document.querySelector('.page');
  const openers = document.querySelectorAll('[data-modal-open="demo"]');
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

  openers.forEach((btn) => btn.addEventListener('click', (event) => {
    event.preventDefault();
    open();
  }));

  closers.forEach((btn) => btn.addEventListener('click', close));

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) close();
  });
})();
