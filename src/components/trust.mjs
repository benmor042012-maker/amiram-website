// Trust & social-proof sections: reviews, before/after projects, family note, warranty.
import { REVIEWS, REVIEW_SUMMARY } from '../data/reviews.mjs';
import { PROJECTS } from '../data/projects.mjs';
import { FAMILY, WARRANTY, OC_BADGE } from '../data/trust.mjs';
import { esc } from '../lib.mjs';

const placeholderTag = '<span class="placeholder-tag">Placeholder</span>';

// ★★★★☆ with an accessible label. `rating` null = not yet provided.
function stars(rating) {
  if (rating == null) return '<span class="stars stars--empty" role="img" aria-label="Rating not yet provided">☆☆☆☆☆</span>';
  const full = Math.round(rating);
  return `<span class="stars" role="img" aria-label="Rated ${rating} out of 5">${'★'.repeat(full)}${'☆'.repeat(5 - full)}</span>`;
}

function summaryLine() {
  const { placeholder, rating, count, profileUrl } = REVIEW_SUMMARY;
  if (placeholder || rating == null || count == null) {
    return `<!-- TODO(Amiram): set the real rating and review count in src/data/reviews.mjs -->
    <p class="reviews__summary">${placeholderTag} X.X ★ from N reviews</p>`;
  }
  const text = `${rating.toFixed(1)} ★ from ${count} reviews`;
  return `<p class="reviews__summary">${profileUrl ? `<a href="${esc(profileUrl)}" target="_blank" rel="noopener">${text}</a>` : text}</p>`;
}

export function reviewsSection() {
  const cards = REVIEWS.map(
    (r) => `<li class="review card">
        ${r.placeholder ? placeholderTag : ''}
        ${stars(r.rating)}
        <blockquote><p>${esc(r.text)}</p></blockquote>
        <p class="review__meta"><strong>${esc(r.name)}</strong>, ${esc(r.city)} <span class="review__source">via ${esc(r.source)}</span></p>
      </li>`,
  ).join('\n      ');
  return `<section id="reviews" class="section section--alt" aria-labelledby="reviews-title">
  <div class="container">
    <!-- TODO(Amiram): all reviews below are placeholders — replace with real reviews in src/data/reviews.mjs -->
    <h2 id="reviews-title">What Our Customers Say</h2>
    ${summaryLine()}
    <ul class="reviews" role="list">
      ${cards}
    </ul>
  </div>
</section>`;
}

function caption(p) {
  const parts = [p.service, p.city, p.duration].filter(Boolean);
  if (parts.length) return `<figcaption>${parts.map(esc).join(' · ')}</figcaption>`;
  return `<!-- TODO(Amiram): add service, city and duration for this project in src/data/projects.mjs -->
        <figcaption>${placeholderTag} Service · City · Duration</figcaption>`;
}

export function projectsSection() {
  const items = PROJECTS.map(
    (p) => `<figure class="project">
        <div class="project__pair">
          <div class="project__img"><img src="${esc(p.before.src)}" alt="${esc(p.before.alt)}" width="600" height="400" loading="lazy" decoding="async"><span class="project__label">Before</span></div>
          <div class="project__img"><img src="${esc(p.after.src)}" alt="${esc(p.after.alt)}" width="600" height="400" loading="lazy" decoding="async"><span class="project__label">After</span></div>
        </div>
        ${caption(p)}
      </figure>`,
  ).join('\n      ');
  return `<section id="projects" class="section section--alt" aria-labelledby="projects-title">
  <div class="container">
    <h2 id="projects-title">Before &amp; After</h2>
    <div class="projects">
      ${items}
    </div>
  </div>
</section>`;
}

export function familySection() {
  return `<section id="family" class="section" aria-labelledby="family-title">
  <div class="container family">
    <img class="family__photo" src="${esc(FAMILY.photo.src)}" alt="${esc(FAMILY.photo.alt)}" width="800" height="600" loading="lazy" decoding="async">
    <div>
      <h2 id="family-title">Meet the Family</h2>
      ${FAMILY.placeholder ? `<!-- TODO(Amiram): write the owner note and add a real photo in src/data/trust.mjs -->\n      ${placeholderTag}` : ''}
      <p>${esc(FAMILY.note)}</p>
      ${FAMILY.signature ? `<p class="family__sig">— ${esc(FAMILY.signature)}</p>` : ''}
    </div>
  </div>
</section>`;
}

function list(items, emptyText) {
  if (!items.length) return `<p>${placeholderTag} ${emptyText}</p>`;
  return `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
}

export function warrantySection() {
  const badge = OC_BADGE.confirmed
    ? `<img class="badge" src="${esc(OC_BADGE.src)}" alt="${esc(OC_BADGE.label)} badge" width="${OC_BADGE.width}" height="${OC_BADGE.height}" loading="lazy">`
    : '<!-- TODO(Amiram): Owens Corning contractor badge slot — hidden until OC_BADGE.confirmed is true in src/data/trust.mjs -->';
  return `<section id="warranty" class="section section--alt" aria-labelledby="warranty-title">
  <div class="container">
    <h2 id="warranty-title">${esc(WARRANTY.name)}</h2>
    <!-- TODO(Amiram): fill in what the warranty covers and excludes in src/data/trust.mjs -->
    <div class="warranty">
      <div class="card">
        <h3>What's covered</h3>
        ${list(WARRANTY.covers, 'Coverage details coming soon — ask us for the full warranty terms.')}
      </div>
      <div class="card">
        <h3>What's not covered</h3>
        ${list(WARRANTY.excludes, 'Exclusions coming soon — ask us for the full warranty terms.')}
      </div>
    </div>
    ${WARRANTY.documentUrl ? `<p><a href="${esc(WARRANTY.documentUrl)}">Read the full warranty terms</a></p>` : ''}
    ${badge}
  </div>
</section>`;
}
