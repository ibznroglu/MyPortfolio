// Case studies are addressable pages but not navigation items: they belong in
// the sitemap, not in the navbar. Keeping them out of routes.json is what makes
// that distinction explicit.
export const CASE_STUDY_SLUGS = ['vargeloglu-insaat'] as const;

export type CaseStudySlug = (typeof CASE_STUDY_SLUGS)[number];

export const isCaseStudySlug = (value: string): value is CaseStudySlug =>
  (CASE_STUDY_SLUGS as readonly string[]).includes(value);

export interface CaseStudyItem {
  term: string;
  text: string;
}

export interface CaseStudySection {
  heading: string;
  body?: string[];
  items?: CaseStudyItem[];
}

export interface CaseStudyMetric {
  label: string;
  value: string;
}

export interface CaseStudyContent {
  title: string;
  summary: string;
  role: string;
  stack: string;
  timeline: string;
  liveLabel: string;
  liveUrl: string;
  backLabel: string;
  metricsHeading: string;
  metrics: CaseStudyMetric[];
  sections: CaseStudySection[];
  roleLabel: string;
  stackLabel: string;
  timelineLabel: string;
}
