import { renderHome } from './pages/home.mjs';

// Every page of the site. `path` is relative to the site root ('' = home).
export function pages() {
  return [{ path: '', html: renderHome() }];
}
