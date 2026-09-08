(() => {
  const root = document.querySelector('.hero__slider');
  if (!root || typeof Swiper === 'undefined') return;

  const pager = root.querySelector('.hero__pager');
  if (!pager) return;

  new Swiper(root, {
    speed: 450,
    slidesPerView: 1,
    grabCursor: true,
    watchSlidesProgress: true,
    pagination: {
      el: pager,
      clickable: true,
      bulletClass: 'hero__dot',
      bulletActiveClass: 'is-active',
      renderBullet(index, className) {
        return `<button type="button" class="${className}" aria-label="Слайд ${index + 1}"></button>`;
      },
    },
  });
})();
