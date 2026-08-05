import { useMemo, type ReactNode } from 'react';
import { LanguageContext } from './languageContext';
import { getBundle, type Language } from '../lib/translations';

interface Props {
  language: Language;
  children: ReactNode;
}

/**
 * The active language comes from the URL, so this provider only maps it to
 * the matching translation bundle.
 */
const LanguageProvider = ({ language, children }: Props) => {
  const value = useMemo(() => ({ language, t: getBundle(language) }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export default LanguageProvider;
