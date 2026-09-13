(() => {
  const root = document.querySelector('[data-description-tabs]');
  if (!root) return;

  const tabs = [...root.querySelectorAll('[data-tab]')];
  const panels = [...root.querySelectorAll('[data-panel]')];

  const activate = (id) => {
    tabs.forEach((tab) => {
      const active = tab.dataset.tab === id;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
    });

    panels.forEach((panel) => {
      const active = panel.dataset.panel === id;
      panel.classList.toggle('is-active', active);
      panel.hidden = !active;
    });
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => activate(tab.dataset.tab));
  });
})();
