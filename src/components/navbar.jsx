import React, { useEffect, useRef, useState } from 'react';
import { FaBars, FaTimes, FaGithub, FaLinkedin } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
import { BsFillPersonLinesFill } from 'react-icons/bs';
import { useLanguage } from '../context/LanguageContext';
import Logo from '../assets/logo.webp';
import { settings } from '../helpers/functions/settings';

const FOCUS_RING =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400';

const Navbar = ({ activeSection, setActiveSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const toggleRef = useRef(null);
  const panelRef = useRef(null);

  const menuItems = [
    { key: 'home', label: t.nav.home },
    { key: 'about', label: t.nav.about },
    { key: 'skills', label: t.nav.skills },
    { key: 'projects', label: t.nav.projects },
    { key: 'contact', label: t.nav.contact },
  ];

  const goTo = (key) => {
    setActiveSection(key);
    setIsMenuOpen(false);
  };

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
    panelRef.current?.querySelector('button')?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      toggleButton?.focus();
    };
  }, [isMenuOpen]);

  const navButtonClass = (key) =>
    `px-4 py-2 rounded-lg transition-colors duration-300 ${FOCUS_RING} ${
      activeSection === key
        ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/50'
        : 'text-gray-300 hover:text-pink-500 hover:bg-[#112240]'
    }`;

  const langButtonClass = (code) =>
    `px-3 py-1 rounded text-sm font-semibold transition-colors ${FOCUS_RING} ${
      language === code ? 'bg-pink-600 text-white' : 'bg-[#112240] text-gray-400 hover:text-white'
    }`;

  return (
    <>
      <header className="fixed top-0 w-full h-[80px] flex justify-between items-center px-4 sm:px-6 bg-[#0a192f]/95 backdrop-blur-sm text-gray-300 z-50 border-b border-pink-600/20">
        <button
          type="button"
          onClick={() => goTo('home')}
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
        </button>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-1 list-none p-0">
            {menuItems.map((item) => (
              <li key={item.key}>
                <button
                  type="button"
                  onClick={() => goTo(item.key)}
                  aria-current={activeSection === item.key ? 'page' : undefined}
                  className={navButtonClass(item.key)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex gap-2" role="group" aria-label="Language">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              aria-pressed={language === 'en'}
              className={langButtonClass('en')}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('tr')}
              aria-pressed={language === 'tr'}
              className={langButtonClass('tr')}
            >
              TR
            </button>
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
          {menuItems.map((item) => (
            <li key={item.key} className="py-4">
              <button
                type="button"
                onClick={() => goTo(item.key)}
                aria-current={activeSection === item.key ? 'page' : undefined}
                className={`text-3xl px-4 py-2 rounded-lg transition-colors ${FOCUS_RING} ${activeSection === item.key ? 'text-pink-500' : 'text-gray-300 hover:text-pink-500'}`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <nav aria-label="Social links" className="hidden lg:block fixed top-[120px] left-0 z-40">
        <ul className="list-none p-0">
          <li className="w-[160px] h-[60px] ml-[-100px] hover:ml-[-10px] focus-within:ml-[-10px] duration-300 bg-blue-600 rounded-r-lg hover:shadow-lg hover:shadow-blue-600/50">
            <a
              href={settings.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex justify-between items-center w-full h-full text-gray-100 px-4 ${FOCUS_RING}`}
            >
              LinkedIn <FaLinkedin size={30} aria-hidden="true" />
            </a>
          </li>
          <li className="w-[160px] h-[60px] ml-[-100px] hover:ml-[-10px] focus-within:ml-[-10px] duration-300 bg-[#333333] rounded-r-lg hover:shadow-lg hover:shadow-gray-800/50">
            <a
              href={settings.github}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex justify-between items-center w-full h-full text-gray-100 px-4 ${FOCUS_RING}`}
            >
              GitHub <FaGithub size={30} aria-hidden="true" />
            </a>
          </li>
          <li className="w-[160px] h-[60px] ml-[-100px] hover:ml-[-10px] focus-within:ml-[-10px] duration-300 bg-pink-600 rounded-r-lg hover:shadow-lg hover:shadow-pink-600/50">
            <a
              href={`mailto:${settings.email}`}
              className={`flex justify-between items-center w-full h-full text-gray-100 px-4 ${FOCUS_RING}`}
            >
              Email <HiOutlineMail size={30} aria-hidden="true" />
            </a>
          </li>
          <li className="w-[160px] h-[60px] ml-[-100px] hover:ml-[-10px] focus-within:ml-[-10px] duration-300 bg-[#565f69] rounded-r-lg hover:shadow-lg hover:shadow-gray-600/50">
            <a
              href="/isa_bezeniroglu_resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex justify-between items-center w-full h-full text-gray-100 px-4 ${FOCUS_RING}`}
            >
              Resume <BsFillPersonLinesFill size={30} aria-hidden="true" />
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
