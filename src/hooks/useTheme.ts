import { useCallback, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

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
    const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark';

    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private mode: the theme still applies for this session.
    }

    // The browser cross-fades between the two states for us. Where the API is
    // missing, or the visitor asked for less motion, the theme simply changes.
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!document.startViewTransition || prefersReducedMotion) {
      setTheme(next);
      return;
    }

    // flushSync because startViewTransition snapshots the DOM when its callback
    // returns; a deferred React update would be missed.
    document.startViewTransition(() => flushSync(() => setTheme(next)));
  }, []);

  return { theme, toggleTheme };
};
