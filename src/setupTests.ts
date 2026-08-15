// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// jsdom does not implement matchMedia, which the theme hook uses to follow the
// system preference. Reporting "no preference" keeps the dark default.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// jsdom does not implement IntersectionObserver. A stub that never reports an
// intersection keeps deferred work — the visitor counter's Firebase import —
// out of the test run entirely.
class NoopIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds: readonly number[] = [];
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: NoopIntersectionObserver,
});
