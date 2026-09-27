// Family Roofing Inc. — site behavior (progressive enhancement; the site works without JS).

// Footer copyright year: always the current year, even if the site isn't rebuilt.
document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });

// Promotion: remove it once its end date (Los Angeles time) has passed.
(function hideExpiredPromo() {
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' }); // YYYY-MM-DD
  document.querySelectorAll('[data-promo-end]').forEach((el) => {
    if (today > el.dataset.promoEnd) el.remove();
  });
})();
