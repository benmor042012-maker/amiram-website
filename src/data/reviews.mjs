// Customer reviews shown in "What Our Customers Say".
//
// TODO(Amiram): EVERYTHING BELOW IS PLACEHOLDER DATA. Replace with real reviews copied
// verbatim (with permission) from your Google Business Profile / Yelp, then set
// `placeholder: false` on each one and fill in `summary`. Never publish invented reviews.
// While `placeholder: true`, the card is visibly labelled "Placeholder" on the page.

// Overall rating. Leave null until you have the real numbers; the JSON-LD
// aggregateRating is only emitted when both values are real (placeholder: false).
export const REVIEW_SUMMARY = {
  placeholder: true,
  rating: null, // e.g. 4.9  (TODO(Amiram): real average from Google/Yelp)
  count: null, // e.g. 87   (TODO(Amiram): real review count)
  // TODO(Amiram): link to your Google Business Profile reviews page
  profileUrl: null,
};

const placeholder = (n, source) => ({
  placeholder: true,
  name: `Customer name ${n}`,
  city: 'City',
  rating: null, // 1–5
  text: 'Placeholder — paste a real customer review here, word for word.',
  source, // 'Google' | 'Yelp'
});

export const REVIEWS = [
  placeholder(1, 'Google'),
  placeholder(2, 'Google'),
  placeholder(3, 'Yelp'),
  placeholder(4, 'Google'),
  placeholder(5, 'Yelp'),
  placeholder(6, 'Google'),
];
