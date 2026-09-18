(() => {
  const root = document.querySelector("[data-cases]");
  if (!root || typeof Swiper === "undefined") return;

  const slider = root.querySelector(".cases__slider");
  const logos = [...root.querySelectorAll("[data-cases-logo]")];
  const pager = root.querySelector(".cases__pager");
  if (!slider) return;

  const syncLogos = (index) => {
    logos.forEach((logo, i) => {
      const active = i === index;
      logo.classList.toggle("is-active", active);
      if (active) {
        logo.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
      }
    });
  };

  const mountPager = () => {
    if (!pager) return;
    const visual = slider.querySelector(".swiper-slide-active .cases__visual");
    if (visual && pager.parentElement !== visual) {
      visual.appendChild(pager);
    }
  };

  const swiper = new Swiper(slider, {
    speed: 400,
    rewind: true,
    slidesPerView: 1,
    autoHeight: true,
    grabCursor: true,
    navigation: {
      prevEl: slider.querySelector(".cases__prev"),
      nextEl: slider.querySelector(".cases__next"),
    },
    pagination: pager
      ? {
          el: pager,
          clickable: true,
          bulletClass: "cases__dot",
          bulletActiveClass: "is-active",
        }
      : undefined,
    on: {
      init() {
        mountPager();
        syncLogos(this.realIndex);
      },
      slideChange() {
        mountPager();
        syncLogos(this.realIndex);
        this.updateAutoHeight(200);
      },
    },
  });

  logos.forEach((logo) => {
    logo.addEventListener("click", () => {
      const index = Number(logo.dataset.casesLogo);
      if (Number.isNaN(index)) return;
      swiper.slideTo(index);
    });
  });
})();
