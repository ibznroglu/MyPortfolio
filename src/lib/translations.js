import en from '../locales/en.json';
import tr from '../locales/tr.json';

export const DEFAULT_LANGUAGE = 'en';

/** Recursively fills gaps in `bundle` with values from `fallback`. */
const withFallback = (fallback, bundle) => {
  const merged = { ...fallback };

  for (const [key, value] of Object.entries(bundle)) {
    merged[key] =
      value && typeof value === 'object' && !Array.isArray(value)
        ? withFallback(fallback[key] ?? {}, value)
        : value;
  }

  return merged;
};

// A missing translation falls back to English instead of rendering `undefined`.
export const bundles = {
  en,
  tr: withFallback(en, tr),
};

export const getBundle = (language) => bundles[language] ?? bundles[DEFAULT_LANGUAGE];
