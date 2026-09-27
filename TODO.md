# TODO list for Amiram

Every item is also marked in the code as `TODO(Amiram)`. Run
`grep -rn "TODO(Amiram)" src` to find them. After editing, run `npm run build`.

## Blocking — do before launch

1. **Quote form endpoint** (`src/data/site.mjs` → `form.endpoint`). Until set, the form
   validates but tells visitors to call. It must match the endpoint the current live form
   posts to; field names are `name, phone, email, address, service, message, photo, consent`
   (+ `page_city` on city pages). The endpoint must accept `multipart/form-data` file uploads
   up to 10 MB.
2. **Reviews** (`src/data/reviews.mjs`): replace all 6 placeholder cards with real reviews
   copied word-for-word from Google/Yelp, and set the real rating + review count. The
   `aggregateRating` schema appears automatically only after that.
3. **Hours** (`src/data/site.mjs` → `hours`). The old header said Mon–Sun and the footer
   said "Saturday - Closed". The current default is daily 8:00am–5:00pm. Confirm it.
4. **Promotion** (`src/data/site.mjs` → `promo`): the real offer text, its terms, and the end
   date (currently a placeholder of 2026-12-31). Set `enabled: false` if there's no promo.
5. **Old URLs / redirects** (`src/static/_redirects`): export the full list of URLs from the
   current WordPress site and map each one, so existing Google rankings aren't lost.
6. **Brand**: the real logo (SVG + PNG ≥112px for Google), brand colors and fonts
   (`src/static/assets/css/style.css` `:root` tokens). These couldn't be read from the
   live site.

## Content

7. **Email**: confirm `office@familyroofinginc.com` is monitored (the old mailto went to `ami@`).
8. **Address**: decide whether to publish `1444 N Poinsettia Pl Apt 219, Los Angeles, CA 90046`.
   The site currently shows "Serving Los Angeles & Ventura County".
9. **Free inspection response time** (`inspectionHours` in `site.mjs`): the hero shows "Free Roof
   Inspection within N hours" once it's set.
10. **Before/after projects** (`src/data/projects.mjs`): real photos, plus service, city,
    duration and descriptive alt text for each.
11. **Meet the Family** (`src/data/trust.mjs`): a real photo and a short owner note.
12. **Warranty** (`src/data/trust.mjs`): what the Limited Lifetime Warranty covers and
    excludes, and who issues it.
13. **Owens Corning badge** (`src/data/trust.mjs`): confirm the contractor status, add the
    official badge file, and set `confirmed: true`.
14. **FAQ answers** (`src/data/faq.mjs`): insurance claims, job duration, emergency response
    time; optionally a typical cost range and the inspection timeframe.
15. **City pages** (`src/data/cities.mjs`): review or rewrite the 4 draft intros; confirm the
    full service-area city list.
16. **Consent text** on the form: confirm it matches the wording on the current form.
17. **priceRange** in the schema (`$$` for now).
18. **Share image** `og-image.jpg`: replace the branded placeholder with a real photo
    (1200×630).
19. **CSLB link**: optionally deep-link to the license detail page once you've verified it.
