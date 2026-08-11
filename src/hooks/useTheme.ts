import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

/** Reads what theme-init.js already applied, so the two never disagree. */
const currentTheme = (): Theme =>
  document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(currentTheme);

  // Until the visitor makes a choice, follow the system. Once they have chosen,
  // that choice wins — changing the OS setting should not override an explicit
  // preference.
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: light)');

    const followSystem = (event: MediaQueryListEvent) => {
      if (localStorage.getItem(STORAGE_KEY)) return;
      setTheme(event.matches ? 'light' : 'dark');
    };

    media.addEventListener('change', followSystem);
    return () => media.removeEventListener('change', followSystem);
  }, []);

  useEffect(() => {
    if (theme === 'light') document.documentElement.setAttribute('data-theme', 'light');
    else document.documentElement.removeAttribute('data-theme');
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Private mode: the theme still applies for this session.
      }
      return next;
    });
  }, []);

  return { theme, toggleTheme };
};
