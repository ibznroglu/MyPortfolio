import { useEffect, useRef, useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { HiMoon, HiSun } from 'react-icons/hi';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';
import Logo from '../assets/logo.webp';
import { socialLinks } from '../data/socialLinks';
import { NAV_ITEMS, localizedPath, swapLanguage } from '../lib/navigation';
import type { Language } from '../lib/translations';

const FOCUS_RING =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  // The panel stays mounted so it can slide, so `inert` is what keeps it out of
  // the tab order and the accessibility tree while it is off screen. React 18
  // does not pass the attribute through, hence the ref.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    if (isMenuOpen) panel.removeAttribute('inert');
    else panel.setAttribute('inert', '');
  }, [isMenuOpen]);

  // Close on Escape and lock background scroll while the overlay is open.
  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false);
    };

    // Captured now so cleanup never reads a ref that may have changed since.
    const toggleButton = toggleRef.current;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    // Focus the panel rather than its first link. Moving focus onto a link makes
    // iOS Safari treat it as keyboard focus and paint the focus ring on a tap,
    // and a disclosure menu is expected to hand focus to the container anyway —
    // Tab then reaches the first item naturally.
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      toggleButton?.focus();
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-lg transition-colors duration-300 ${FOCUS_RING} ${
      isActive
        ? 'bg-accent text-white shadow-lg shadow-accent/50'
        : 'text-body hover:text-accent-soft hover:bg-raised'
    }`;

  // Deliberately the same pill the desktop nav uses, so the two menus read as
  // one design rather than two.
  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block rounded-lg px-4 py-3 text-[15px] transition-colors ${FOCUS_RING} ${
      isActive
        ? 'bg-accent text-white shadow-lg shadow-accent/40'
        : 'text-body hover:bg-hairline/5 hover:text-accent-soft'
    }`;

  const langLinkClass = (code: Language) =>
    `px-3 py-1 rounded text-sm font-semibold transition-colors ${FOCUS_RING} ${
      language === code
        ? 'bg-accent text-white'
        : 'border border-hairline/15 bg-raised text-body hover:border-accent/40 hover:text-heading'
    }`;

  return (
    <>
      <header className="fixed top-0 w-full h-[80px] flex justify-between items-center px-4 sm:px-6 bg-header/95 backdrop-blur-sm text-body z-50 border-b border-accent/20">
        <Link
          to={localizedPath('', language)}
          aria-label={t.nav.home}
          className={`rounded-lg ${FOCUS_RING}`}
        >
          <img
            src={Logo}
            data-logo
            alt=""
            width="48"
            height="48"
            className="w-12 h-12 hover:scale-110 transition-transform duration-300"
          />
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-1 list-none p-0">
            {NAV_ITEMS.map(({ key, slug }) => (
              <li key={key}>
                <NavLink to={localizedPath(slug, language)} end={!slug} className={navLinkClass}>
                  {t.nav[key]}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? t.theme.toLight : t.theme.toDark}
            className={`rounded-lg p-2 text-xl text-body transition-colors hover:text-accent-soft ${FOCUS_RING}`}
          >
            {theme === 'dark' ? <HiSun aria-hidden="true" /> : <HiMoon aria-hidden="true" />}
          </button>

          <div className="flex gap-2" role="group" aria-label="Language">
            <Link
              to={swapLanguage(pathname, 'en')}
              onClick={closeMenu}
              hrefLang="en"
              aria-current={language === 'en' ? 'true' : undefined}
              className={langLinkClass('en')}
            >
              EN
            </Link>
            <Link
              to={swapLanguage(pathname, 'tr')}
              onClick={closeMenu}
              hrefLang="tr"
              aria-current={language === 'tr' ? 'true' : undefined}
              className={langLinkClass('tr')}
            >
              TR
            </Link>
          </div>

          <button
            type="button"
            ref={toggleRef}
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            className={`md:hidden -mr-2 flex items-center gap-2 rounded-lg p-2 text-body transition-colors hover:text-accent-soft ${FOCUS_RING}`}
          >
            <span className="text-xl" aria-hidden="true">
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </span>
            {/* The word is the accessible name. A bare glyph is measurably
                less likely to be tapped, and the old aria-label was hardcoded
                English on an otherwise bilingual site. */}
            <span className="text-sm font-semibold">{t.nav.menu}</span>
          </button>
        </div>
      </header>

      {/* A dimmed scrim rather than a blur: blurred page content stays legible
          enough to compete with the menu in front of it. */}
      <div
        onClick={closeMenu}
        aria-hidden="true"
        className={`fixed inset-x-0 bottom-0 top-[80px] z-40 bg-black/50 transition-opacity duration-200 md:hidden ${
          isMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <nav
        id="mobile-menu"
        ref={panelRef}
        tabIndex={-1}
        aria-label="Mobile"
        className={`fixed right-3 top-[88px] z-40 w-[min(15rem,72vw)] origin-top-right rounded-2xl border border-hairline/10 bg-raised p-2 shadow-2xl outline-none transition-all duration-200 md:hidden ${
          isMenuOpen ? 'scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'
        }`}
      >
        <ul className="list-none space-y-0.5 p-0">
          {NAV_ITEMS.map(({ key, slug }) => (
            <li key={key}>
              <NavLink
                to={localizedPath(slug, language)}
                end={!slug}
                onClick={closeMenu}
                className={mobileLinkClass}
              >
                {t.nav[key]}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <nav aria-label="Social links" className="hidden lg:block fixed top-[120px] left-0 z-40">
        <ul className="list-none p-0">
          {socialLinks.map(({ id, label, href, Icon, external, railClass }) => (
            <li
              key={id}
              className={`w-[160px] h-[60px] ml-[-100px] hover:ml-[-10px] focus-within:ml-[-10px] duration-300 rounded-r-lg hover:shadow-lg ${railClass}`}
            >
              <a
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                className={`flex h-full w-full items-center justify-between px-4 text-on-brand ${FOCUS_RING}`}
              >
                {label} <Icon size={30} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
