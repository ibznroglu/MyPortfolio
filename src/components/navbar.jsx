import { useEffect, useRef, useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import Logo from '../assets/logo.webp';
import { socialLinks } from '../data/socialLinks';
import { NAV_ITEMS, localizedPath, swapLanguage } from '../lib/navigation';

const FOCUS_RING =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, t } = useLanguage();
  const { pathname } = useLocation();
  const toggleRef = useRef(null);
  const panelRef = useRef(null);

  // Close on Escape and lock background scroll while the overlay is open.
  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setIsMenuOpen(false);
    };

    // Captured now so cleanup never reads a ref that may have changed since.
    const toggleButton = toggleRef.current;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    panelRef.current?.querySelector('a')?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      toggleButton?.focus();
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg transition-colors duration-300 ${FOCUS_RING} ${
      isActive
        ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/50'
        : 'text-gray-300 hover:text-pink-500 hover:bg-[#112240]'
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `text-3xl px-4 py-2 rounded-lg transition-colors ${FOCUS_RING} ${
      isActive ? 'text-pink-500' : 'text-gray-300 hover:text-pink-500'
    }`;

  const langLinkClass = (code) =>
    `px-3 py-1 rounded text-sm font-semibold transition-colors ${FOCUS_RING} ${
      language === code ? 'bg-pink-600 text-white' : 'bg-[#112240] text-gray-400 hover:text-white'
    }`;

  return (
    <>
      <header className="fixed top-0 w-full h-[80px] flex justify-between items-center px-4 sm:px-6 bg-[#0a192f]/95 backdrop-blur-sm text-gray-300 z-50 border-b border-pink-600/20">
        <Link
          to={localizedPath('', language)}
          aria-label={t.nav.home}
          className={`rounded-lg ${FOCUS_RING}`}
        >
          <img
            src={Logo}
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
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            className={`md:hidden p-2 -mr-2 text-2xl rounded-lg hover:text-pink-500 transition-colors ${FOCUS_RING}`}
          >
            {isMenuOpen ? <FaTimes aria-hidden="true" /> : <FaBars aria-hidden="true" />}
          </button>
        </div>
      </header>

      <nav
        id="mobile-menu"
        ref={panelRef}
        aria-label="Mobile"
        hidden={!isMenuOpen}
        className="md:hidden fixed inset-0 bg-[#0a192f]/98 backdrop-blur-sm z-40 flex flex-col justify-center items-center"
      >
        <ul className="list-none p-0 text-center">
          {NAV_ITEMS.map(({ key, slug }) => (
            <li key={key} className="py-4">
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
                className={`flex justify-between items-center w-full h-full text-gray-100 px-4 ${FOCUS_RING}`}
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
