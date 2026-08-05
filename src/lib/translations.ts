import en from '../locales/en.json';
import tr from '../locales/tr.json';

export const LANGUAGES = ['en', 'tr'] as const;
export type Language = (typeof LANGUAGES)[number];

// English is the reference bundle, so its shape defines the contract.
export type Translation = typeof en;

export const DEFAULT_LANGUAGE: Language = 'en';

export const isLanguage = (value: string): value is Language =>
  (LANGUAGES as readonly string[]).includes(value);

/** Recursively fills gaps in `bundle` with values from `fallback`. */
const withFallback = <T>(fallback: T, bundle: unknown): T => {
  const merged = { ...fallback } as Record<string, unknown>;
  const source = (bundle ?? {}) as Record<string, unknown>;

  for (const [key, value] of Object.entries(source)) {
    merged[key] =
      value && typeof value === 'object' && !Array.isArray(value)
        ? withFallback((merged[key] ?? {}) as unknown, value)
        : value;
  }

  return merged as T;
};

// A missing translation falls back to English instead of rendering `undefined`.
export const bundles: Record<Language, Translation> = {
  en,
  tr: withFallback<Translation>(en, tr),
};

export const getBundle = (language: Language): Translation =>
  bundles[language] ?? bundles[DEFAULT_LANGUAGE];
