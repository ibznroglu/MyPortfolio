import React, { useState } from 'react';
import Navbar from './components/navbar';
import Home from './components/Home';
import About from './components/About';
import Skills from './components/Skills';
import Work from './components/Work';
import Contact from './components/Contact';

const SECTIONS = {
  home: Home,
  about: About,
  skills: Skills,
  projects: Work,
  contact: Contact,
};

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const ActiveSection = SECTIONS[activeSection] || Home;

  return (
    <div className="min-h-screen bg-[#0a192f]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:rounded-lg focus:bg-pink-600 focus:px-4 focus:py-2 focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />

      <main id="main-content" tabIndex={-1} className="pt-20 focus:outline-none">
        <ActiveSection setActiveSection={setActiveSection} />
      </main>
    </div>
  );
}

export default App;
