import { Component, type ErrorInfo, type ReactNode } from 'react';
import type { Language } from '../lib/translations';

/**
 * Copy for the fallback below, kept local on purpose: reading it through the
 * translation layer would make the fallback depend on the very system that
 * might have failed.
 *
 * Two lines rather than one sentence — what happened, then where to go if the
 * button does not help. As a single run it wrapped after the last word in
 * Turkish and left "çözer." alone on the second line.
 *
 * Neither line promises that reloading works. This boundary catches a chunk
 * that failed to arrive, which a reload does fix, and a render error, which
 * reproduces exactly — and it cannot tell them apart, so it should not claim
 * to. The button already carries the action; what the copy can add is an
 * honest way out for when the action fails.
 */
const MESSAGES: Record<Language, { title: string; body: [string, string]; action: string }> = {
  en: {
    title: 'Something went wrong',
    body: [
      'This section failed to load.',
      "If reloading doesn't help, the rest of the site still works.",
    ],
    action: 'Reload',
  },
  tr: {
    title: 'Bir şeyler ters gitti',
    body: [
      'Bu bölüm yüklenemedi.',
      'Yenilemek çözmezse, sitenin geri kalanı çalışmaya devam ediyor.',
    ],
    action: 'Yenile',
  },
};

interface Props {
  language: Language;
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Catches render-time errors so a single broken section cannot blank the page.
 * Class syntax is required: React has no hook equivalent for error boundaries.
 */
class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled render error:', error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    const copy = MESSAGES[this.props.language] ?? MESSAGES.en;

    return (
      <section className="section-shell flex items-center justify-center bg-surface px-6 text-center">
        <div className="max-w-md">
          <h1 className="text-2xl font-bold text-heading">{copy.title}</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-body">
            {copy.body.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-8 rounded-lg bg-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft"
          >
            {copy.action}
          </button>
        </div>
      </section>
    );
  }
}

export default ErrorBoundary;
