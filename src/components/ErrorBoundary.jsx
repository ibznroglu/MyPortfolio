import { Component } from 'react';

/**
 * Catches render-time errors so a single broken section cannot blank the page.
 * Class syntax is required: React has no hook equivalent for error boundaries.
 *
 * The copy is kept local on purpose. Reading it through the translation layer
 * would make the fallback depend on the very system that might have failed.
 */
const MESSAGES = {
  en: {
    title: 'Something went wrong',
    body: 'This section failed to load. Reloading the page usually fixes it.',
    action: 'Reload',
  },
  tr: {
    title: 'Bir şeyler ters gitti',
    body: 'Bu bölüm yüklenemedi. Sayfayı yenilemek genellikle sorunu çözer.',
    action: 'Yenile',
  },
};

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Unhandled render error:', error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    const copy = MESSAGES[this.props.language] ?? MESSAGES.en;

    return (
      <section className="section-shell flex items-center justify-center bg-[#0a192f] px-6 text-center">
        <div className="max-w-md">
          <h1 className="text-2xl font-bold text-[#ccd6f6]">{copy.title}</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-gray-400">{copy.body}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-8 rounded-lg bg-pink-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400"
          >
            {copy.action}
          </button>
        </div>
      </section>
    );
  }
}

export default ErrorBoundary;
