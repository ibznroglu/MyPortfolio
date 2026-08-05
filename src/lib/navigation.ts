import type { Language } from './translations';

export interface NavItem {
  key: 'home' | 'about' | 'skills' | 'projects' | 'contact';
  slug: string;
}

// Route slugs are shared between the router and the navbar so the two can
// never drift apart. English lives at the root, Turkish under /tr.
export const NAV_ITEMS: readonly NavItem[] = [
  { key: 'home', slug: '' },
  { key: 'about', slug: 'about' },
  { key: 'skills', slug: 'skills' },
  { key: 'projects', slug: 'projects' },
  { key: 'contact', slug: 'contact' },
];

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
