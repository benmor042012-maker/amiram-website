// Free-quote form, shared by the home page and city pages.
// Client-side validation lives in assets/js/main.js; the markup works without JS
// (native `required` validation, plain multipart POST to the configured endpoint).
//
// TODO(Amiram): field `name`s must match what the existing form endpoint expects.
// Current names: name, phone, email, address, service, message, photo, consent.
import { SITE } from '../data/site.mjs';
import { esc } from '../lib.mjs';

export const SERVICE_OPTIONS = [
  'Roof Repair',
  'Roof Replacement',
  'New Roof Installation',
  'Roof Inspection',
  'Emergency Repair',
  'Commercial Roofing',
  'Other',
];

// One labelled field with an (initially empty) error slot referenced by aria-describedby.
function field({ id, label, required, hint, control }) {
  const req = required ? ' <span class="req">(required)</span>' : ' <span class="opt">(optional)</span>';
  const hintId = hint ? `${id}-hint` : '';
  return `<div class="field">
        <label for="${id}">${label}${req}</label>
        ${hint ? `<p class="hint" id="${hintId}">${hint}</p>` : ''}
        ${control(`${hintId} ${id}-error`.trim())}
        <p class="field-error" id="${id}-error" hidden></p>
      </div>`;
}

// `idPrefix` keeps ids unique if the form ever appears twice.
export function quoteForm({ idPrefix = 'q', city = '' } = {}) {
  const f = (name) => `${idPrefix}-${name}`;
  const { endpoint, maxPhotoMB } = SITE.form;
  const options = SERVICE_OPTIONS.map((o) => `<option>${esc(o)}</option>`).join('');

  return `<form class="quote-form" id="${f('form')}" action="${esc(endpoint)}" method="post" enctype="multipart/form-data"
      data-endpoint="${endpoint ? 'set' : ''}" data-max-photo-mb="${maxPhotoMB}" data-validate>
      <div class="form-summary" role="alert" tabindex="-1" hidden></div>
      ${endpoint ? '' : '<!-- TODO(Amiram): set SITE.form.endpoint in src/data/site.mjs so this form actually sends -->'}
      ${city ? `<input type="hidden" name="page_city" value="${esc(city)}">` : ''}
      ${field({ id: f('name'), label: 'Full name', required: true, control: (d) => `<input id="${f('name')}" name="name" type="text" autocomplete="name" required aria-describedby="${d}">` })}
      ${field({ id: f('phone'), label: 'Phone', required: true, control: (d) => `<input id="${f('phone')}" name="phone" type="tel" inputmode="tel" autocomplete="tel" required aria-describedby="${d}">` })}
      ${field({ id: f('email'), label: 'Email', required: false, control: (d) => `<input id="${f('email')}" name="email" type="email" autocomplete="email" aria-describedby="${d}">` })}
      ${field({ id: f('address'), label: 'Property address or ZIP code', required: true, hint: 'So we know where the roof is, e.g. 90046.', control: (d) => `<input id="${f('address')}" name="address" type="text" autocomplete="street-address" required aria-describedby="${d}">` })}
      ${field({ id: f('service'), label: 'Service needed', required: true, control: (d) => `<select id="${f('service')}" name="service" required aria-describedby="${d}"><option value="">Choose a service…</option>${options}</select>` })}
      ${field({ id: f('message'), label: 'Describe the problem', required: false, hint: 'For example: leak over the kitchen after rain, missing tiles, roof is 25 years old.', control: (d) => `<textarea id="${f('message')}" name="message" rows="4" aria-describedby="${d}"></textarea>` })}
      ${field({ id: f('photo'), label: 'Roof photo', required: false, hint: `An image file, up to ${maxPhotoMB} MB.`, control: (d) => `<input id="${f('photo')}" name="photo" type="file" accept="image/*" aria-describedby="${d}">` })}
      <div class="field">
        <!-- TODO(Amiram): confirm this matches the consent wording on the current live form -->
        <div class="consent">
          <input id="${f('consent')}" name="consent" type="checkbox" value="yes" required aria-describedby="${f('consent')}-error">
          <label for="${f('consent')}">I agree to be contacted about my request by phone, text or email. <span class="req">(required)</span></label>
        </div>
        <p class="field-error" id="${f('consent')}-error" hidden></p>
      </div>
      <button class="btn btn--primary" type="submit">Send My Free Quote Request</button>
      <p class="form-status" role="status" aria-live="polite"></p>
    </form>`;
}
