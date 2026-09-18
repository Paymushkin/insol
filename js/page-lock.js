(() => {
  const page = document.querySelector('.page');

  const sync = () => {
    if (!page) return;
    const menuOpen = document.querySelector('[data-burger][aria-expanded="true"]');
    const modalOpen = document.querySelector('[data-modal].is-open');
    page.classList.toggle('is-locked', Boolean(menuOpen || modalOpen));
  };

  window.__insolPageLock = { sync };
})();
