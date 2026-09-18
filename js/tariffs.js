(() => {
  const bindRoot = (root) => {
    if (!root || root.dataset.tariffsReady) return;
    root.dataset.tariffsReady = "1";

    const cards = [...root.querySelectorAll("[data-tariff-card]")];

    const setOpen = (card, open) => {
      card.classList.toggle("is-open", open);
      const toggle = card.querySelector("[data-tariff-toggle]");
      if (toggle) toggle.setAttribute("aria-expanded", String(open));
    };

    cards.forEach((card) => {
      const toggle = card.querySelector("[data-tariff-toggle]");
      if (toggle) toggle.setAttribute("aria-expanded", String(card.classList.contains("is-open")));
    });

    root.addEventListener("click", (event) => {
      const toggle = event.target.closest("[data-tariff-toggle]");
      const collapse = event.target.closest("[data-tariff-collapse]");
      const card = event.target.closest("[data-tariff-card]");
      if (!card || !root.contains(card)) return;

      if (toggle) {
        const willOpen = !card.classList.contains("is-open");
        cards.forEach((item) => setOpen(item, item === card && willOpen));
      }

      if (collapse) setOpen(card, false);
    });

    const period = root.querySelector("[data-editions-period]");
    if (period) {
      const applyPeriod = () => {
        const key = period.value === "month" ? "priceMonth" : "priceYear";
        root.querySelectorAll("[data-price-year]").forEach((node) => {
          const next = key === "priceMonth" ? node.dataset.priceMonth : node.dataset.priceYear;
          if (next) node.textContent = next;
        });
      };
      period.addEventListener("change", applyPeriod);
      applyPeriod();
    }

    const slider = root.querySelector(".tariffs-solutions__slider");
    if (!slider || typeof Swiper === "undefined") return;

    const mq = window.matchMedia("(min-width: 1024px)");
    let swiper = null;

    const enable = () => {
      if (swiper) return;
      swiper = new Swiper(slider, {
        speed: 400,
        slidesPerView: 6,
        spaceBetween: 20,
        watchOverflow: true,
        navigation: {
          prevEl: root.querySelector(".tariffs-solutions__prev"),
          nextEl: root.querySelector(".tariffs-solutions__next"),
        },
        breakpoints: {
          1024: { slidesPerView: 4, spaceBetween: 20 },
          1280: { slidesPerView: 5, spaceBetween: 20 },
          1440: { slidesPerView: 6, spaceBetween: 20 },
        },
      });
    };

    const disable = () => {
      if (!swiper) return;
      swiper.destroy(true, true);
      swiper = null;
    };

    const sync = () => {
      if (mq.matches) enable();
      else disable();
    };

    sync();
    mq.addEventListener("change", sync);
  };

  document.querySelectorAll("[data-tariffs]").forEach(bindRoot);
})();
