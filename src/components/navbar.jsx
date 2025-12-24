import React, { useState } from "react";
import { FaBars, FaTimes, FaGithub, FaLinkedin } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { useLanguage } from "../context/LanguageContext";
import Logo from "../assets/logo.png";
import { settings } from "../helpers/functions/setting";

const Navbar = ({ activeSection, setActiveSection }) => {
  const [nav, setNav] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const handleClick = () => setNav(!nav);

  const menuItems = [
    { key: 'home', label: t.nav.home },
    { key: 'about', label: t.nav.about },
    { key: 'skills', label: t.nav.skills },
    { key: 'projects', label: t.nav.projects },
    { key: 'contact', label: t.nav.contact }
  ];

  return (
    <>
      <div className="fixed w-full h-[80px] flex justify-between items-center px-6 bg-[#0a192f]/95 backdrop-blur-sm text-gray-300 z-50 border-b border-pink-600/20">
        <div className="flex items-center">
          <img src={Logo} alt="Logo" className="w-12 h-12 hover:scale-110 transition-transform duration-300" />
        </div>

        <ul className="hidden md:flex gap-1">
          {menuItems.map((item) => (
            <li key={item.key}>
              <button
                onClick={() => {
                  setActiveSection(item.key);
                  setNav(false);
                }}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeSection === item.key
                    ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/50'
                    : 'text-gray-300 hover:text-pink-600 hover:bg-[#112240]'
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded text-sm font-semibold transition-all ${
                language === 'en' 
                  ? 'bg-pink-600 text-white' 
                  : 'bg-[#112240] text-gray-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('tr')}
              className={`px-3 py-1 rounded text-sm font-semibold transition-all ${
                language === 'tr' 
                  ? 'bg-pink-600 text-white' 
                  : 'bg-[#112240] text-gray-400 hover:text-white'
              }`}
            >
              TR
            </button>
          </div>
          <div onClick={handleClick} className="md:hidden z-10 text-2xl hover:text-pink-600 transition-colors cursor-pointer">
            {!nav ? <FaBars /> : <FaTimes />}
          </div>
        </div>
      </div>

      <ul
        className={
          !nav
            ? "hidden"
            : "fixed top-0 left-0 w-full h-screen bg-[#0a192f]/98 backdrop-blur-sm flex flex-col justify-center items-center z-40"
        }
      >
        {menuItems.map((item) => (
          <li key={item.key} className="py-4">
            <button
              onClick={() => {
                setActiveSection(item.key);
                setNav(false);
              }}
              className={`text-3xl transition-colors ${
                activeSection === item.key
                  ? 'text-pink-600'
                  : 'text-gray-300 hover:text-pink-600'
              }`}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>

      <div className="hidden lg:flex fixed flex-col top-[120px] left-0 z-40">
        <ul>
          <li className="w-[160px] h-[60px] flex justify-between items-center ml-[-100px] hover:ml-[-10px] duration-300 bg-blue-600 rounded-r-lg hover:shadow-lg hover:shadow-blue-600/50">
            <a
              className="flex justify-between items-center w-full text-gray-300 px-4"
              href="https://www.linkedin.com/in/isabezeniroglu/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Linkedin <FaLinkedin size={30} />
            </a>
          </li>
          <li className="w-[160px] h-[60px] flex justify-between items-center ml-[-100px] hover:ml-[-10px] duration-300 bg-[#333333] rounded-r-lg hover:shadow-lg hover:shadow-gray-800/50">
            <a
              className="flex justify-between items-center w-full text-gray-300 px-4"
              href="https://github.com/ibznroglu"
              target="_blank"
              rel="noopener noreferrer"
            >
              Github <FaGithub size={30} />
            </a>
          </li>
          <li className="w-[160px] h-[60px] flex justify-between items-center ml-[-100px] hover:ml-[-10px] duration-300 bg-pink-600 rounded-r-lg hover:shadow-lg hover:shadow-pink-600/50">
            <a
              className="flex justify-between items-center w-full text-gray-300 px-4"
              href={`mailto:${settings.email}`}
            >
              Email <HiOutlineMail size={30} />
            </a>
          </li>
          <li className="w-[160px] h-[60px] flex justify-between items-center ml-[-100px] hover:ml-[-10px] duration-300 bg-[#565f69] rounded-r-lg hover:shadow-lg hover:shadow-gray-600/50">
            <a
              className="flex justify-between items-center w-full text-gray-300 px-4"
              href="/MyResume.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Resume <BsFillPersonLinesFill size={30} />
            </a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
