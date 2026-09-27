// Small helpers shared by templates.
import { SITE } from './data/site.mjs';

const DAY_NAMES = { Mo: 'Mon', Tu: 'Tue', We: 'Wed', Th: 'Thu', Fr: 'Fri', Sa: 'Sat', Su: 'Sun' };
const DAY_ORDER = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const SCHEMA_DAYS = { Mo: 'Monday', Tu: 'Tuesday', We: 'Wednesday', Th: 'Thursday', Fr: 'Friday', Sa: 'Saturday', Su: 'Sunday' };

// HTML-escape text and attribute values.
export const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// "08:00" -> "8:00am"
function time12(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, '0')}${h < 12 ? 'am' : 'pm'}`;
}

// "Mo".."Su" list -> "Mon–Fri" / "Sat" / "Mon, Wed"
function dayRange(days) {
  const idx = days.map((d) => DAY_ORDER.indexOf(d)).sort((a, b) => a - b);
  const contiguous = idx.every((v, i) => i === 0 || v === idx[i - 1] + 1);
  if (idx.length > 1 && contiguous) return `${DAY_NAMES[DAY_ORDER[idx[0]]]}–${DAY_NAMES[DAY_ORDER[idx.at(-1)]]}`;
  return idx.map((i) => DAY_NAMES[DAY_ORDER[i]]).join(', ');
}

// Human-readable lines, including closed days, e.g. ["Mon–Fri: 8:00am – 5:00pm", "Sat–Sun: Closed"]
export function hoursLines(hours = SITE.hours) {
  const lines = hours.map((h) => `${dayRange(h.days)}: ${time12(h.open)} – ${time12(h.close)}`);
  const open = new Set(hours.flatMap((h) => h.days));
  const closed = DAY_ORDER.filter((d) => !open.has(d));
  if (closed.length) lines.push(`${dayRange(closed)}: Closed`);
  return lines;
}

// schema.org OpeningHoursSpecification[]
export function openingHoursSchema(hours = SITE.hours) {
  return hours.map((h) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: h.days.map((d) => SCHEMA_DAYS[d]),
    opens: h.open,
    closes: h.close,
  }));
}

// Today's date in Los Angeles as YYYY-MM-DD.
export const todayInLA = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' });

// Is the promotion live? (The browser re-checks this so it hides after endDate without a rebuild.)
export const promoActive = (promo = SITE.promo) => promo.enabled && (!promo.endDate || todayInLA() <= promo.endDate);
