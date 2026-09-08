(() => {
  const PHONE_TEMPLATE = '+7 (___) ___-__-__';

  function applyPhoneMask(input) {
    const digits = input.value.replace(/\D/g, '').replace(/^8/, '7');
    let normalized = digits;
    if (!normalized.startsWith('7')) normalized = `7${normalized}`;
    normalized = normalized.slice(0, 11);

    let i = 0;
    const formatted = PHONE_TEMPLATE.replace(/_/g, () => normalized[i++] || '_');
    input.value = normalized.length > 1 ? formatted : '';
  }

  function showAlert(container, type, message) {
    if (!container) return;
    container.innerHTML = `
      <div class="alert alert--${type}" role="status">
        <span class="alert__icon">${type === 'success' ? '✓' : type === 'error' ? '×' : '!'}</span>
        <p>${message}</p>
      </div>
    `;
  }

  function validateForm(form) {
    let valid = true;
    const required = form.querySelectorAll('[required]');

    required.forEach((field) => {
      field.classList.remove('is-error');
      if (field.type === 'checkbox') {
        if (!field.checked) valid = false;
        return;
      }
      if (!String(field.value).trim() || field.value.includes('_')) {
        field.classList.add('is-error');
        valid = false;
      }
    });

    return valid;
  }

  function bindForm(form) {
    const alerts = form.querySelector('[data-alerts]');

    form.querySelectorAll('[data-phone]').forEach((input) => {
      input.addEventListener('input', () => applyPhoneMask(input));
      input.addEventListener('focus', () => {
        if (!input.value) input.value = PHONE_TEMPLATE;
      });
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!validateForm(form)) {
        showAlert(alerts, 'warning', 'Заполните все обязательные поля для отправки формы.');
        return;
      }

      showAlert(alerts, 'success', 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
      form.reset();
    });
  }

  document.querySelectorAll('[data-form]').forEach(bindForm);
})();
