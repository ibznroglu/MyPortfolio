import routes from './routes.json';
import { getBundle, type Language } from './translations';
import { CASE_STUDY_SLUGS, isCaseStudySlug } from './caseStudies';

export const SITE_URL = 'https://isabezeniroglu.com';

/**
 * Per-route title, description and URLs, in one place because two things need
 * them: the runtime, which updates the document after React mounts, and the
 * prerender step, which writes them into the HTML for crawlers that never run
 * JavaScript. Duplicating the formula would let the two drift apart silently.
 */
export interface PageMeta {
  title: string;
  description: string;
  canonical: string;
  alternates: { hreflang: string; href: string }[];
  /**
   * Source path of the preview image, or undefined for the site default. The
   * prerender step resolves it through the build manifest, since the built
   * filename carries a content hash nothing else can predict.
   */
  imageSource?: string;
  imageAlt?: string;
}

/** Matches scripts/generate-sitemap.js exactly, so the two never disagree. */
export const localizedHref = (slug: string, language: Language) => {
  const prefix = language === 'tr' ? '/tr' : '';
  if (!slug) return `${SITE_URL}${prefix || '/'}`;
  return `${SITE_URL}${prefix}/${slug}`;
};

export const pageMeta = (slug: string, language: Language): PageMeta => {
  const t = getBundle(language);
  const caseSlug = slug.startsWith('projects/') ? slug.slice('projects/'.length) : undefined;
  const caseStudy =
    caseSlug && isCaseStudySlug(caseSlug)
      ? (t.caseStudies as Record<string, { title: string; summary: string }>)[caseSlug]
      : undefined;

  const title = caseStudy
    ? `${caseStudy.title} | ${t.home.name}`
    : slug
      ? `${t.nav[slug as keyof typeof t.nav]} | ${t.home.name} — ${t.home.title}`
      : `${t.home.name} | ${t.home.title}`;

  // Only the home page and the case studies carry copy written to stand alone.
  // The rest fall back to the site description rather than to a sentence
  // stitched together from headings, which reads worse than saying less.
  const description = caseStudy ? caseStudy.summary : t.home.description;

  // A case study shows the work. Everything else shows the logo, which is the
  // right default for pages that are not about one project.
  const imageSource = caseSlug && caseStudy ? PROJECT_IMAGES[caseSlug] : undefined;

  return {
    title,
    description,
    imageSource,
    imageAlt: imageSource ? caseStudy?.title : undefined,
    canonical: localizedHref(slug, language),
    alternates: [
      { hreflang: 'en', href: localizedHref(slug, 'en') },
      { hreflang: 'tr', href: localizedHref(slug, 'tr') },
      { hreflang: 'x-default', href: localizedHref(slug, 'en') },
    ],
  };
};

/**
 * Case study slug to the screenshot the projects page already renders for it.
 * Kept here rather than read from data.ts because the prerender step needs the
 * source path, and importing data.ts would resolve these to bundled URLs.
 */
const PROJECT_IMAGES: Record<string, string> = {
  portfolio: 'src/assets/projects/portfolio.webp',
  'vargeloglu-insaat': 'src/assets/projects/vargelogluinsaat.webp',
  'gaming-pro-market': 'src/assets/projects/gamingpromarket.webp',
};

/** Every indexable slug, '' for the home page. */
export const ALL_SLUGS: string[] = [
  ...routes.map((route) => route.slug),
  ...CASE_STUDY_SLUGS.map((slug) => `projects/${slug}`),
];
