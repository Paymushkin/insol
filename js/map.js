(() => {
  const root = document.querySelector('[data-map]');
  if (!root) return;

  const lat = Number(root.dataset.lat) || 55.755814;
  const lng = Number(root.dataset.lng) || 37.617635;
  const zoom = Number(root.dataset.zoom) || 9;

  const init = () => {
    if (typeof ymaps === 'undefined') return;

    ymaps.ready(() => {
      const map = new ymaps.Map(root, {
        center: [lat, lng],
        zoom,
        controls: [],
      }, {
        suppressMapOpenBlock: true,
        yandexMapDisablePoiInteractivity: true,
        copyrightLogoVisible: false,
        copyrightProvidersVisible: false,
      });

      map.behaviors.disable([
        'scrollZoom',
        'dblClickZoom',
        'multiTouch',
        'rightMouseButtonMagnifier',
        'leftMouseButtonMagnifier',
      ]);

      [
        'zoomControl',
        'geolocationControl',
        'searchControl',
        'trafficControl',
        'typeSelector',
        'fullscreenControl',
        'rulerControl',
        'routeButtonControl',
      ].forEach((name) => map.controls.remove(name));

      map.container.fitToViewport();
      const syncSize = () => map.container.fitToViewport();
      window.addEventListener('resize', syncSize);
      if (typeof ResizeObserver !== 'undefined') {
        new ResizeObserver(syncSize).observe(root);
      }
    });
  };

  if (typeof ymaps !== 'undefined') {
    init();
    return;
  }

  window.addEventListener('load', init);
})();
