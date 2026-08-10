import { useEffect } from 'react';
import { NAV_ITEMS, SITE_URL, localizedPath } from '../lib/navigation';
import type { Language } from '../lib/translations';
import { isCaseStudySlug } from '../lib/caseStudies';

const MANAGED = 'data-managed-meta';

const setLink = (rel: string, href: string, hreflang?: string) => {
  const link = document.createElement('link');
  link.rel = rel;
  link.href = href;
  link.setAttribute(MANAGED, 'true');
  if (hreflang) link.hreflang = hreflang;
  document.head.appendChild(link);
};

const setMeta = (selector: string, attribute: string, value: string) => {
  document.querySelector(selector)?.setAttribute(attribute, value);
};

/**
 * Keeps the canonical URL, hreflang alternates and title in sync with the
 * route. Without this every route would inherit the canonical baked into
 * index.html and claim to be the home page.
 */
export const useDocumentMeta = (slug: string, language: Language, title: string) => {
  useEffect(() => {
    document.title = title;

    const canonical = `${SITE_URL}${localizedPath(slug, language)}`;
    setMeta('link[rel="canonical"]', 'href', canonical);
    setMeta('meta[property="og:url"]', 'content', canonical);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[property="og:locale"]', 'content', language === 'tr' ? 'tr_TR' : 'en_US');

    document.querySelectorAll(`[${MANAGED}]`).forEach((node) => node.remove());

    const english = `${SITE_URL}${localizedPath(slug, 'en')}`;
    setLink('alternate', english, 'en');
    setLink('alternate', `${SITE_URL}${localizedPath(slug, 'tr')}`, 'tr');
    setLink('alternate', english, 'x-default');

    return () => {
      document.querySelectorAll(`[${MANAGED}]`).forEach((node) => node.remove());
    };
  }, [slug, language, title]);
};

/**
 * Maps a pathname back to the slug the router matched, '' for the home page.
 * Case studies live under /projects/<slug>, so the full two-segment path is
 * kept — otherwise every case study would canonicalise to /projects.
 */
export const slugFromPathname = (pathname: string): string => {
  const bare = pathname.replace(/^\/(tr)?\/?/, '').replace(/\/$/, '');
  const [first, second] = bare.split('/');

  if (first === 'projects' && second && isCaseStudySlug(second)) {
    return `projects/${second}`;
  }

  return NAV_ITEMS.some((item) => item.slug === first) ? first : '';
};
