(() => {
  window.__insolTabs = {
    bind({ root, tabSelector, panelSelector, onActivate } = {}) {
      if (!root) return null;

      const tabs = [...root.querySelectorAll(tabSelector || '[data-tab]')];
      const panels = [...root.querySelectorAll(panelSelector || '[data-panel]')];
      if (!tabs.length || !panels.length) return null;

      const activate = (id) => {
        if (!id) return;

        tabs.forEach((tab) => {
          const active = tab.dataset.tab === id;
          tab.classList.toggle('is-active', active);
          tab.setAttribute('aria-selected', String(active));
        });

        let current = null;
        panels.forEach((panel) => {
          const active = panel.dataset.panel === id;
          panel.classList.toggle('is-active', active);
          panel.hidden = !active;
          if (active) current = panel;
        });

        onActivate?.(id, current);
      };

      tabs.forEach((tab) => {
        tab.addEventListener('click', () => activate(tab.dataset.tab));
      });

      const initial = panels.find((panel) => panel.classList.contains('is-active')) || panels[0];
      if (initial?.dataset.panel) activate(initial.dataset.panel);

      return { activate, tabs, panels };
    },
  };
})();
