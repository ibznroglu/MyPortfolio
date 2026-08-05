import { Suspense, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { LanguageProvider } from '../context/LanguageContext';
import Navbar from './navbar';
import Footer from './Footer';
import ErrorBoundary from './ErrorBoundary';
import RouteFallback from './RouteFallback';

/**
 * Shared shell for one language. The URL is the single source of truth for
 * the active language, so the <html lang> attribute is derived from it.
 */
const Layout = ({ language }) => {
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageProvider language={language}>
      <div className="min-h-screen bg-[#0a192f]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:rounded-lg focus:bg-pink-600 focus:px-4 focus:py-2 focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>

        <Navbar />

        <main id="main-content" tabIndex={-1} className="pt-20 focus:outline-none">
          <ErrorBoundary>
            <Suspense fallback={<RouteFallback />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </main>

        <Footer />
      </div>
    </LanguageProvider>
  );
};

export default Layout;
