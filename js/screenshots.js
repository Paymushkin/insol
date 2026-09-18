(() => {
  const root = document.querySelector('[data-screenshots]');
  if (!root) return;

  const tabs = [...root.querySelectorAll('.screenshots__tab')];
  const panels = [...root.querySelectorAll('.screenshots__panel')];
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

  const activate = (id) => {
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

    if (!current) return;

    requestAnimationFrame(() => {
      const swiper = createSwiper(current);
      if (!swiper) return;
      swiper.update();
    });
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => activate(tab.dataset.tab));
  });

  const initial = panels.find((panel) => panel.classList.contains('is-active')) || panels[0];
  if (initial) createSwiper(initial);
})();
