(() => {
  const openText = "Показать всё";
  const closeText = "Скрыть";

  document.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-clients-more-toggle]");
    if (!btn) return;

    const root = btn.closest("[data-clients-more]");
    if (!root) return;

    const label = root.querySelector("[data-clients-more-label]");
    const open = root.classList.toggle("is-open");

    btn.setAttribute("aria-expanded", String(open));
    if (label) label.textContent = open ? closeText : openText;
  });

  const sliderRoot = document.querySelector("[data-clients-slider]");
  const slider = sliderRoot && sliderRoot.querySelector(".clients__slider");
  const list = sliderRoot && sliderRoot.querySelector(".clients__list");
  const progress = sliderRoot && sliderRoot.querySelector("[data-clients-progress]");
  if (!sliderRoot || !slider || !list || typeof Swiper === "undefined") return;

  const mq = window.matchMedia("(max-width: 1024px)");
  let swiper = null;

  const enable = () => {
    if (swiper) return;

    slider.classList.add("swiper");
    list.classList.add("swiper-wrapper");
    list.querySelectorAll(".clients__item").forEach((item) => {
      item.classList.add("swiper-slide");
    });

    swiper = new Swiper(slider, {
      speed: 450,
      slidesPerView: 2,
      spaceBetween: 16,
      loop: true,
      grabCursor: true,
      autoplay: {
        delay: 3200,
        disableOnInteraction: false,
      },
      breakpoints: {
        480: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 4,
          spaceBetween: 24,
        },
        1024: {
          slidesPerView: 5,
          spaceBetween: 24,
        },
      },
      on: {
        autoplayTimeLeft(s, time, ratio) {
          if (progress) progress.style.transform = `scaleX(${1 - ratio})`;
        },
      },
    });
  };

  const disable = () => {
    if (!swiper) return;
    swiper.destroy(true, true);
    swiper = null;
    slider.classList.remove("swiper");
    list.classList.remove("swiper-wrapper");
    list.querySelectorAll(".clients__item").forEach((item) => {
      item.classList.remove("swiper-slide");
    });
    if (progress) progress.style.transform = "scaleX(0)";
  };

  const sync = () => {
    if (mq.matches) enable();
    else disable();
  };

  sync();
  mq.addEventListener("change", sync);
})();
