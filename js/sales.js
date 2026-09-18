(() => {
  const root = document.querySelector("[data-sales]");
  if (!root) return;

  const cards = () => [...root.querySelectorAll("[data-sales-card]")];

  const activate = (card) => {
    cards().forEach((item) => {
      const active = item === card;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
  };

  cards().forEach((card) => {
    card.setAttribute("role", "button");
    card.setAttribute("aria-pressed", String(card.classList.contains("is-active")));
  });

  root.addEventListener("click", (event) => {
    const card = event.target.closest("[data-sales-card]");
    if (!card) return;
    activate(card);
  });

  root.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const card = event.target.closest("[data-sales-card]");
    if (!card) return;
    event.preventDefault();
    activate(card);
  });
})();
