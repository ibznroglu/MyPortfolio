import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useVisitorTracking } from '../hooks/useVisitorTracking';
import { socialLinks } from '../data/socialLinks';

const FOCUS_RING =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft';

// Mirrors the desktop social rail in navbar.tsx, which is hidden below lg.
const Footer = () => {
  const { t, language } = useLanguage();
  const countRef = useRef<HTMLParagraphElement>(null);
  // Browsers without IntersectionObserver simply load it straight away, decided
  // at mount so the effect never has to setState synchronously.
  const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined');
  const { totalVisitors, status } = useVisitorTracking(inView);

  // The Firebase SDK is fetched only once the counter is actually on screen,
  // so no route pays for it during first paint.
  useEffect(() => {
    const node = countRef.current;
    if (!node || inView) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setInView(true);
      },
      { rootMargin: '200px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [inView]);

  return (
    <footer className="lg:hidden h-16 border-t border-hairline/5 bg-surface">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="min-w-0">
          <p className="truncate text-xs text-muted">
            © {new Date().getFullYear()} İsa Bezeniroğlu
          </p>
          {/* Rendered even while idle so the observer has something to watch;
              the figure itself appears only once it is real. */}
          <p ref={countRef} className="truncate text-xs text-muted">
            {status === 'ready'
              ? `${totalVisitors.toLocaleString(language)} ${t.visitor.total}`
              : '\u00A0'}
          </p>
        </div>

        <ul className="flex items-center list-none p-0">
          {socialLinks.map(({ id, label, href, Icon, external }) => (
            <li key={id}>
              <a
                href={href}
                aria-label={label}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                className={`block rounded-lg p-3 text-body hover:text-accent-soft transition-colors ${FOCUS_RING}`}
              >
                <Icon size={20} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
