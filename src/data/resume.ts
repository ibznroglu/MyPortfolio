import type { Language } from '../lib/translations';

/** Keep the English URL stable for existing bookmarks; select the CV by site language. */
export const resume: Record<Language, { href: string }> = {
  en: { href: '/isa_bezeniroglu_resume.pdf' },
  tr: { href: '/isa_bezeniroglu_F-TR.pdf' },
};
