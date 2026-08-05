import { createContext } from 'react';

// Kept in its own module so the provider file only exports a component,
// which is what React Fast Refresh needs to work reliably.
export const LanguageContext = createContext(null);
