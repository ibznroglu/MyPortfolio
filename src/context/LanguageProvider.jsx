import { useMemo } from 'react';
import { LanguageContext } from './languageContext';
import { getBundle } from '../lib/translations';

/**
 * The active language comes from the URL, so this provider only maps it to
 * the matching translation bundle.
 */
const LanguageProvider = ({ language, children }) => {
  const value = useMemo(() => ({ language, t: getBundle(language) }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export default LanguageProvider;
