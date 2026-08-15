import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useVisitorTracking } from '../hooks/useVisitorTracking';
import { socialLinks } from '../data/socialLinks';
import { resume } from '../data/resume';

const FOCUS_RING =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft';

const Footer = () => {
  const { t, language } = useLanguage();
  const countRef = useRef<HTMLParagraphElement>(null);
  // Browsers without IntersectionObserver simply load it straight away, decided
  // at mount so the effect never has to setState synchronously.
  const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined');
  const { totalVisitors, status } = useVisitorTracking(inView);

  // The Firebase SDK is fetched only once the counter is actually on screen,
  // so no route pays for it during first paint.
  //
  // Observation waits for load. Route chunks are lazy, and RouteFallback fills
  // the same section-shell every page does, so while a chunk is in flight the
  // document is exactly one viewport tall and this footer sits at the fold —
  // visible, and enough to trigger an observer that mounted before the page it
  // belongs to. By load the real content has laid out and the footer is where
  // it actually ends up.
  useEffect(() => {
    const node = countRef.current;
    if (!node || inView) return undefined;

    let observer: IntersectionObserver | undefined;

    const observe = () => {
      observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setInView(true);
      });
      observer.observe(node);
    };

    if (document.readyState === 'complete') {
      observe();
      return () => observer?.disconnect();
    }

    window.addEventListener('load', observe, { once: true });
    return () => {
      window.removeEventListener('load', observe);
      observer?.disconnect();
    };
  }, [inView]);

  // The height sits on the element rather than the inner row: --footer-h has to
  // account for the border too, or every section-shell page overflows by a pixel.
  return (
    <footer className="h-16 border-t border-hairline/5 bg-surface">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="min-w-0">
          <p className="truncate text-xs text-muted">
            © {new Date().getFullYear()} İsa Bezeniroğlu
          </p>
          {/* Rendered even while idle so the observer has something to watch;
              the figure itself appears only once it is real. */}
          <p ref={countRef} className="truncate text-xs text-muted">
            {status === 'ready'
              ? `${totalVisitors.toLocaleString(language)} ${t.visitor.footer}`
              : '\u00A0'}
          </p>
        </div>

        <div className="flex items-center gap-1">
          {/* Hidden from lg up, where the fixed rail in navbar.tsx shows the
              same three links. */}
          <ul className="flex list-none items-center p-0 lg:hidden">
            {socialLinks.map(({ id, label, href, Icon, external }) => (
              <li key={id}>
                <a
                  href={href}
                  aria-label={label}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  className={`block rounded-lg p-3 text-body transition-colors hover:text-accent-soft ${FOCUS_RING}`}
                >
                  <Icon size={20} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>

          {/* Labelled, not an icon. This is the highest-value action a
              recruiter can take and it used to sit unnamed among the social
              links, behind a generic person glyph. */}
          <a
            href={resume.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`whitespace-nowrap rounded-lg border border-accent/40 px-3 py-2 text-xs font-semibold text-accent-soft transition-colors hover:border-accent hover:bg-accent/10 ${FOCUS_RING}`}
          >
            {t.footer.cv}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
