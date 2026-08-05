// Route slugs are shared between the router and the navbar so the two can
// never drift apart. English lives at the root, Turkish under /tr.
export const NAV_ITEMS = [
  { key: 'home', slug: '' },
  { key: 'about', slug: 'about' },
  { key: 'skills', slug: 'skills' },
  { key: 'projects', slug: 'projects' },
  { key: 'contact', slug: 'contact' },
];

export const TR_PREFIX = '/tr';

export const isTurkishPath = (pathname) =>
  pathname === TR_PREFIX || pathname.startsWith(`${TR_PREFIX}/`);

/** Builds the absolute path for a slug in the given language. */
export const localizedPath = (slug, language) => {
  const base = language === 'tr' ? TR_PREFIX : '';
  if (!slug) return base || '/';
  return `${base}/${slug}`;
};

/** Returns the current page's URL in the other language. */
export const swapLanguage = (pathname, language) => {
  const bare = isTurkishPath(pathname) ? pathname.slice(TR_PREFIX.length) || '/' : pathname;
  const slug = bare.replace(/^\//, '');
  return localizedPath(slug, language);
};
