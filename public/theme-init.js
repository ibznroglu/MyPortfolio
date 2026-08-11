/*
 * Runs before React so the correct theme is on <html> at first paint. A page
 * that renders dark and then flips to light is worse than either theme.
 *
 * This lives in its own file rather than inline in index.html because the CSP
 * allows `script-src 'self'` only; an inline block would need either
 * 'unsafe-inline' or a hash that drifts every time the script is edited.
 */
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    var theme = stored === 'light' || stored === 'dark' ? stored : prefersLight ? 'light' : 'dark';

    if (theme === 'light') document.documentElement.setAttribute('data-theme', 'light');
  } catch {
    // Private mode can throw on localStorage; the dark default is already correct.
  }
})();
