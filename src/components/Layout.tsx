import { Suspense, useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import LanguageProvider from '../context/LanguageProvider';
import Navbar from './navbar';
import Footer from './Footer';
import ErrorBoundary from './ErrorBoundary';
import RouteFallback from './RouteFallback';
import RouteReady from './RouteReady';
import type { Language } from '../lib/translations';
import { useDocumentMeta, slugFromPathname } from '../hooks/useDocumentMeta';
import { getBundle } from '../lib/translations';

/**
 * Shared shell for one language. The URL is the single source of truth for
 * the active language, so the <html lang> attribute is derived from it.
 */
const Layout = ({ language }: { language: Language }) => {
  const { pathname } = useLocation();
  // Latched, not reset per navigation: once any route has rendered, the
  // footer sits wherever the content puts it and stays trustworthy.
  const [routeReady, setRouteReady] = useState(false);
  const markRouteReady = useCallback(() => setRouteReady(true), []);
  const slug = slugFromPathname(pathname);
  const t = getBundle(language);
  const caseSlug = slug.startsWith('projects/') ? slug.slice('projects/'.length) : undefined;
  const caseStudy = caseSlug
    ? (t.caseStudies as Record<string, { title: string } | undefined>)[caseSlug]
    : undefined;

  const pageTitle = caseStudy
    ? `${caseStudy.title} | ${t.home.name}`
    : slug
      ? `${t.nav[slug as keyof typeof t.nav]} | ${t.home.name} — ${t.home.title}`
      : `${t.home.name} | ${t.home.title}`;

  useDocumentMeta(slug, language, pageTitle);
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageProvider language={language}>
      <div className="min-h-screen bg-surface">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:font-semibold focus:text-heading"
        >
          Skip to content
        </a>

        <Navbar />

        <main id="main-content" tabIndex={-1} className="pt-20 focus:outline-none">
          <ErrorBoundary key={pathname} language={language}>
            <Suspense fallback={<RouteFallback />}>
              <RouteReady onReady={markRouteReady} />
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </main>

        <Footer routeReady={routeReady} />
      </div>
    </LanguageProvider>
  );
};

export default Layout;
