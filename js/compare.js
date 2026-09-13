(() => {
  const root = document.querySelector('.compare');
  if (!root) return;

  const table = root.querySelector('.compare-table');
  const cardsRoot = root.querySelector('.compare-cards');
  if (!table || !cardsRoot) return;

  const formatPrice = (value) => String(value || '').replace(/\s/g, '\u00A0');

  const setComboPrice = (value) => {
    root.querySelectorAll('[data-compare-price="combo"]').forEach((node) => {
      node.innerHTML = formatPrice(value);
    });
  };

  const setComboTag = (tag) => {
    root.querySelectorAll('[data-compare-tag]').forEach((item) => {
      const active = item.dataset.compareTag === tag;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
  };

  const bindTags = (scope) => {
    scope.querySelectorAll('[data-compare-tag]').forEach((tag) => {
      tag.addEventListener('click', () => {
        setComboTag(tag.dataset.compareTag);
        if (tag.dataset.price) setComboPrice(tag.dataset.price);
      });
    });
  };

  const buildCards = () => {
    const plans = [...table.querySelectorAll('thead .compare-table__plan')];
    const rows = [...table.querySelectorAll('tbody tr')];
    const notes = [...table.querySelectorAll('.compare-table__note')];

    cardsRoot.innerHTML = '';

    plans.forEach((plan, index) => {
      const col = plan.dataset.compareCol || `plan-${index}`;
      const box = plan.querySelector('.compare-table__box');
      const name = plan.querySelector('.compare-table__plan-name');
      const price = plan.querySelector('.compare-table__price');
      const tags = plan.querySelector('.compare-table__tags');

      const card = document.createElement('article');
      card.className = 'compare-card';
      card.dataset.compareCol = col;

      if (box) {
        const image = box.cloneNode(true);
        image.className = 'compare-card__box';
        image.removeAttribute('width');
        image.removeAttribute('height');
        card.append(image);
      }

      if (name) {
        const title = document.createElement('p');
        title.className = 'compare-card__name';
        title.innerHTML = name.dataset.cardName || name.innerHTML;
        card.append(title);
      }

      if (price) {
        const cardPrice = document.createElement('p');
        cardPrice.className = 'compare-card__price';
        cardPrice.dataset.comparePrice = col;
        cardPrice.innerHTML = price.innerHTML;
        card.append(cardPrice);
      }

      const order = document.createElement('div');
      order.className = 'compare-card__order';
      const orderBtn = document.createElement('button');
      orderBtn.className = 'btn btn--s btn--red compare-card__btn';
      orderBtn.type = 'button';
      orderBtn.dataset.modalOpen = 'demo';
      orderBtn.textContent = 'Заказать';
      order.append(orderBtn);
      card.append(order);

      if (tags) {
        const cardTags = tags.cloneNode(true);
        cardTags.classList.add('compare-card__tags');
        card.append(cardTags);
      }

      const details = document.createElement('div');
      details.className = 'compare-card__details';

      rows.forEach((row) => {
        const label = row.querySelector('th');
        const cells = [...row.querySelectorAll('td')];
        const cell = cells[index];
        if (!label) return;

        const line = document.createElement('div');
        const isGroup = row.classList.contains('compare-table__group-row');
        line.className = isGroup ? 'compare-card__group' : 'compare-card__row';

        const left = document.createElement('div');
        left.className = 'compare-card__label';
        left.innerHTML = label.innerHTML;

        const right = document.createElement('div');
        right.className = 'compare-card__value';
        if (!isGroup) {
          right.innerHTML = cell ? cell.innerHTML : '';
        }

        line.append(left, right);

        details.append(line);
      });

      if (notes.length) {
        const notesWrap = document.createElement('div');
        notesWrap.className = 'compare-card__notes';
        notes.forEach((note) => {
          const item = document.createElement('p');
          item.className = 'compare-card__note';
          item.innerHTML = note.innerHTML;
          notesWrap.append(item);
        });
        details.append(notesWrap);
      }

      card.append(details);

      const toggle = document.createElement('button');
      toggle.className = 'compare-card__toggle';
      toggle.type = 'button';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.innerHTML = '<span class="compare-card__toggle-open">Детали</span><span class="compare-card__toggle-close">Свернуть</span>';
      card.append(toggle);

      cardsRoot.append(card);
    });
  };

  const bindAccordion = () => {
    cardsRoot.addEventListener('click', (event) => {
      const toggle = event.target.closest('.compare-card__toggle');
      if (!toggle) return;

      const card = toggle.closest('.compare-card');
      const willOpen = !card.classList.contains('is-open');

      cardsRoot.querySelectorAll('.compare-card').forEach((item) => {
        const open = item === card && willOpen;
        item.classList.toggle('is-open', open);
        const btn = item.querySelector('.compare-card__toggle');
        btn?.setAttribute('aria-expanded', String(open));
      });
    });
  };

  buildCards();
  bindTags(root);
  bindAccordion();
})();
