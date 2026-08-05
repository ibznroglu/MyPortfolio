import { createContext } from 'react';
import type { Language, Translation } from '../lib/translations';

export interface LanguageContextValue {
  language: Language;
  t: Translation;
}

// Kept in its own module so the provider file only exports a component,
// which is what React Fast Refresh needs to work reliably.
export const LanguageContext = createContext<LanguageContextValue | null>(null);
