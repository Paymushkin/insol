(() => {
  const root = document.querySelector("[data-reviews]");
  if (!root || typeof Swiper === "undefined") return;

  const slider = root.querySelector(".reviews__slider");
  if (!slider) return;

  const wrapper = slider.querySelector(".swiper-wrapper");
  const originals = wrapper ? [...wrapper.children] : [];
  const uniqueCount = originals.length;

  if (uniqueCount && uniqueCount < 6) {
    originals.forEach((slide) => {
      wrapper.appendChild(slide.cloneNode(true));
    });
  }

  const totalEl = root.querySelector("[data-reviews-total]");
  const currentEl = root.querySelector("[data-reviews-current]");
  if (totalEl) totalEl.textContent = String(uniqueCount || 1);

  const pagePad = () => {
    const value = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--page-pad"));
    return Number.isFinite(value) ? value : 20;
  };

  const isMobile = (width) => width < 1024;
  const gapFor = (width) => (width < 1024 ? 10 : 0);

  const cardFor = (width) => {
    if (width >= 1280) return Math.min(920, width * 0.72);
    if (width >= 1024) return Math.min(720, width * 0.78);
    return Math.max(240, width - pagePad() - 48 - gapFor(width));
  };

  const slidesPerViewFor = () => {
    const width = slider.clientWidth;
    const gap = gapFor(width);
    return (width + gap) / (cardFor(width) + gap);
  };

  const applyLayout = (swiper) => {
    const width = slider.clientWidth;
    const mobile = isMobile(width);
    swiper.params.slidesPerView = slidesPerViewFor();
    swiper.params.spaceBetween = gapFor(width);
    swiper.params.centeredSlides = !mobile;
    swiper.params.slidesOffsetBefore = mobile ? pagePad() : 0;
    swiper.update();
  };

  const syncCounter = (swiper) => {
    if (!currentEl || !uniqueCount) return;
    currentEl.textContent = String((swiper.realIndex % uniqueCount) + 1);
  };

  const swiper = new Swiper(slider, {
    speed: 450,
    loop: true,
    centeredSlides: !isMobile(slider.clientWidth),
    slidesPerView: slidesPerViewFor(),
    spaceBetween: gapFor(slider.clientWidth),
    slidesOffsetBefore: isMobile(slider.clientWidth) ? pagePad() : 0,
    grabCursor: true,
    watchOverflow: false,
    navigation: {
      prevEl: root.querySelector(".reviews__prev"),
      nextEl: root.querySelector(".reviews__next"),
    },
    on: {
      init(instance) {
        syncCounter(instance);
      },
      slideChange(instance) {
        syncCounter(instance);
      },
      resize(instance) {
        applyLayout(instance);
      },
    },
  });
})();
