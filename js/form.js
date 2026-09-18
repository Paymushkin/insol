(() => {
  const PHONE_MASK = '+7 (999) 999-99-99';
  const PHONE_PLACEHOLDER = '+7 (___) ___-__-__';

  function buildMaskedValue(digits) {
    let i = 0;
    return PHONE_MASK.replace(/9/g, () => (i < digits.length ? digits[i++] : '_'));
  }

  function extractDigits(value) {
    let digits = String(value || '').replace(/\D/g, '');
    if (digits.startsWith('8')) digits = `7${digits.slice(1)}`;
    if (digits.startsWith('7')) digits = digits.slice(1);
    return digits.slice(0, 10);
  }

  function caretAfterDigits(masked, digitCount) {
    if (digitCount <= 0) {
      const first = masked.indexOf('_');
      return first === -1 ? masked.length : first;
    }
    let seen = 0;
    for (let i = 0; i < masked.length; i += 1) {
      if (/\d/.test(masked[i]) && i > 3) {
        seen += 1;
        if (seen === digitCount) return i + 1;
      }
    }
    const next = masked.indexOf('_');
    return next === -1 ? masked.length : next;
  }

  function applyPhoneMask(input, rawDigits) {
    const digits = rawDigits ?? extractDigits(input.value);
    const masked = buildMaskedValue(digits);
    input.value = digits.length ? masked : '';
    return { digits, masked };
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

  function isPhoneComplete(value) {
    const digits = extractDigits(value);
    return digits.length === 10 && !String(value).includes('_');
  }

  function isEmailValid(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
  }

  function validateCaptcha(field) {
    const expected = field.dataset.captchaAnswer || '11';
    return String(field.value || '').trim() === String(expected);
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
      if (field.hasAttribute('data-phone')) {
        if (!isPhoneComplete(field.value)) {
          field.classList.add('is-error');
          valid = false;
        }
        return;
      }
      if (field.type === 'email' || field.name === 'email') {
        if (!isEmailValid(field.value)) {
          field.classList.add('is-error');
          valid = false;
        }
        return;
      }
      if (field.name === 'captcha') {
        if (!validateCaptcha(field)) {
          field.classList.add('is-error');
          valid = false;
        }
        return;
      }
      if (!String(field.value).trim()) {
        field.classList.add('is-error');
        valid = false;
      }
    });

    return valid;
  }

  function bindPhone(input) {
    input.setAttribute('inputmode', 'tel');
    input.setAttribute('autocomplete', 'tel');
    if (!input.placeholder) input.placeholder = PHONE_PLACEHOLDER;

    input.addEventListener('focus', () => {
      if (!input.value) {
        input.value = PHONE_PLACEHOLDER;
        requestAnimationFrame(() => {
          const pos = input.value.indexOf('_');
          input.setSelectionRange(pos, pos);
        });
      }
    });

    input.addEventListener('blur', () => {
      if (!extractDigits(input.value).length || input.value.includes('_')) {
        input.value = '';
      }
    });

    input.addEventListener('keydown', (event) => {
      if (event.key !== 'Backspace' && event.key !== 'Delete') return;
      const start = input.selectionStart ?? 0;
      const end = input.selectionEnd ?? 0;
      if (start !== end) return;

      event.preventDefault();
      let digits = extractDigits(input.value);
      if (!digits.length) return;

      if (event.key === 'Backspace') {
        let countBefore = 0;
        for (let i = 0; i < start; i += 1) {
          if (/\d/.test(input.value[i]) && i > 3) countBefore += 1;
        }
        if (countBefore === 0) return;
        digits = digits.slice(0, countBefore - 1) + digits.slice(countBefore);
      } else {
        let countBefore = 0;
        for (let i = 0; i < start; i += 1) {
          if (/\d/.test(input.value[i]) && i > 3) countBefore += 1;
        }
        digits = digits.slice(0, countBefore) + digits.slice(countBefore + 1);
      }

      const { masked } = applyPhoneMask(input, digits);
      if (!digits.length) {
        input.value = PHONE_PLACEHOLDER;
        const pos = input.value.indexOf('_');
        input.setSelectionRange(pos, pos);
        return;
      }
      const pos = caretAfterDigits(masked, digits.length);
      input.setSelectionRange(pos, pos);
    });

    input.addEventListener('input', () => {
      const digits = extractDigits(input.value);
      const { masked } = applyPhoneMask(input, digits);
      if (!digits.length) {
        input.value = PHONE_PLACEHOLDER;
        const pos = input.value.indexOf('_');
        input.setSelectionRange(pos, pos);
        return;
      }
      const pos = caretAfterDigits(masked, digits.length);
      input.setSelectionRange(pos, pos);
    });

    input.addEventListener('paste', (event) => {
      event.preventDefault();
      const pasted = (event.clipboardData || window.clipboardData).getData('text');
      const digits = extractDigits(pasted);
      const { masked } = applyPhoneMask(input, digits);
      if (!digits.length) {
        input.value = PHONE_PLACEHOLDER;
        const pos = input.value.indexOf('_');
        input.setSelectionRange(pos, pos);
        return;
      }
      const pos = caretAfterDigits(masked, digits.length);
      input.setSelectionRange(pos, pos);
    });
  }

  function bindForm(form) {
    const alerts = form.querySelector('[data-alerts]');

    form.querySelectorAll('[data-phone]').forEach(bindPhone);

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
