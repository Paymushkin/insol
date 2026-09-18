(() => {
  const root = document.querySelector('[data-description-tabs]');
  if (!root || !window.__insolTabs) return;

  window.__insolTabs.bind({ root });
})();
