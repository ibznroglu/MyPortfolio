import routes from './routes.json';
import type { Language } from './translations';

export const SITE_URL = 'https://isabezeniroglu.com';

export interface NavItem {
  key: 'home' | 'about' | 'skills' | 'projects' | 'contact';
  slug: string;
}

// English lives at the root, Turkish under /tr. Slugs live in routes.json so
// the router, the navbar and the sitemap generator all read one source.
export const NAV_ITEMS = routes as readonly NavItem[];

export const TR_PREFIX = '/tr';

export const isTurkishPath = (pathname: string): boolean =>
  pathname === TR_PREFIX || pathname.startsWith(`${TR_PREFIX}/`);

/** Builds the absolute path for a slug in the given language. */
export const localizedPath = (slug: string, language: Language): string => {
  const base = language === 'tr' ? TR_PREFIX : '';
  if (!slug) return base || '/';
  return `${base}/${slug}`;
};

/** Returns the current page's URL in the other language. */
export const swapLanguage = (pathname: string, language: Language): string => {
  const bare = isTurkishPath(pathname) ? pathname.slice(TR_PREFIX.length) || '/' : pathname;
  return localizedPath(bare.replace(/^\//, ''), language);
};
