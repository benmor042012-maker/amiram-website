// Family Roofing Inc. — site behavior (progressive enhancement; the site works without JS).

// Mobile menu toggle (disclosure pattern): aria-expanded, Escape closes and returns focus.
(function navToggle() {
  const btn = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  if (!btn || !nav) return;
  const set = (open) => { btn.setAttribute('aria-expanded', String(open)); nav.classList.toggle('is-open', open); };
  btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { set(false); btn.focus(); }
  });
})();

// Footer copyright year: always the current year, even if the site isn't rebuilt.
document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });

// Promotion: remove it once its end date (Los Angeles time) has passed.
(function hideExpiredPromo() {
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' }); // YYYY-MM-DD
  document.querySelectorAll('[data-promo-end]').forEach((el) => {
    if (today > el.dataset.promoEnd) el.remove();
  });
})();

// Quote form: accessible client-side validation.
// Errors are shown next to each field (aria-invalid + aria-describedby) and listed in
// a summary that receives focus, so screen-reader users hear what to fix.
document.querySelectorAll('form[data-validate]').forEach((form) => {
  form.noValidate = true; // we show our own messages; without JS the browser's run instead
  const summary = form.querySelector('.form-summary');
  const status = form.querySelector('.form-status');
  const maxBytes = Number(form.dataset.maxPhotoMb || 10) * 1024 * 1024;

  const rules = {
    name: (v) => (v.trim().length < 2 ? 'Please enter your full name.' : ''),
    phone: (v) => {
      const digits = v.replace(/\D/g, '');
      if (!digits) return 'Please enter your phone number.';
      return digits.length < 10 || digits.length > 11 ? 'Please enter a valid 10-digit phone number, e.g. (323) 688-8088.' : '';
    },
    email: (v) => (v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Please enter a valid email address, e.g. name@example.com.' : ''),
    address: (v) => {
      const t = v.trim();
      if (!t) return 'Please enter the property address or ZIP code.';
      return /^\d+$/.test(t) && !/^\d{5}$/.test(t) ? 'ZIP codes have 5 digits, e.g. 90046.' : '';
    },
    service: (v) => (!v ? 'Please choose the service you need.' : ''),
    photo: (_, el) => {
      const file = el.files && el.files[0];
      if (!file) return '';
      if (!file.type.startsWith('image/')) return 'The roof photo must be an image file (JPG, PNG, HEIC…).';
      return file.size > maxBytes ? `The roof photo is too large. Please choose an image under ${form.dataset.maxPhotoMb} MB.` : '';
    },
    consent: (_, el) => (!el.checked ? 'Please agree to be contacted so we can reply to your request.' : ''),
  };

  function check(el) {
    const rule = rules[el.name];
    if (!rule) return '';
    const msg = rule(el.value, el);
    const errEl = document.getElementById(`${el.id}-error`);
    if (errEl) { errEl.textContent = msg; errEl.hidden = !msg; }
    if (msg) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
    return msg;
  }

  // Re-check a field once the user leaves it, but only after it has been flagged.
  form.addEventListener('change', (e) => { if (e.target.name in rules) check(e.target); });
  form.addEventListener('focusout', (e) => { if (e.target.getAttribute('aria-invalid')) check(e.target); });

  form.addEventListener('submit', (e) => {
    const errors = [];
    form.querySelectorAll('input, select, textarea').forEach((el) => {
      const msg = check(el);
      if (msg) errors.push({ el, msg });
    });

    if (errors.length) {
      e.preventDefault();
      summary.innerHTML = `<strong>Please fix ${errors.length === 1 ? '1 problem' : `${errors.length} problems`}:</strong><ul>${errors
        .map(({ el, msg }) => `<li><a href="#${el.id}">${msg}</a></li>`).join('')}</ul>`;
      summary.hidden = false;
      summary.focus();
      return;
    }
    summary.hidden = true;

    // No endpoint configured yet: don't lose the lead silently.
    if (!form.dataset.endpoint) {
      e.preventDefault();
      const tel = document.querySelector('a[href^="tel:"]');
      status.textContent = `Online requests aren't connected yet. Please call us${tel ? ` at ${tel.textContent.replace(/^Call\s*/, '')}` : ''} — we'll be happy to help.`;
      return;
    }
    status.textContent = 'Sending your request…';
  });
});
