(() => {
  const root = document.querySelector('[data-screenshots]');
  if (!root || !window.__insolTabs) return;

  const swipers = new Map();

  const createSwiper = (panel) => {
    if (typeof Swiper === 'undefined') return null;

    const id = panel.dataset.panel;
    if (!id) return null;
    if (swipers.has(id)) return swipers.get(id);

    const slider = panel.querySelector('.screenshots__slider');
    if (!slider) return null;

    try {
      const swiper = new Swiper(slider, {
        speed: 400,
        rewind: true,
        slidesPerView: 1,
        autoHeight: true,
        grabCursor: true,
        preventClicks: false,
        preventClicksPropagation: false,
        navigation: {
          prevEl: slider.querySelector('.screenshots__prev'),
          nextEl: slider.querySelector('.screenshots__next'),
        },
        pagination: {
          el: slider.querySelector('.screenshots__pager'),
          clickable: true,
          bulletClass: 'screenshots__dot',
          bulletActiveClass: 'is-active',
        },
      });
      swipers.set(id, swiper);
      return swiper;
    } catch (error) {
      return null;
    }
  };

  window.__insolTabs.bind({
    root,
    tabSelector: '.screenshots__tab',
    panelSelector: '.screenshots__panel',
    onActivate(_id, panel) {
      if (!panel) return;
      requestAnimationFrame(() => {
        const swiper = createSwiper(panel);
        swiper?.update();
      });
    },
  });
})();
