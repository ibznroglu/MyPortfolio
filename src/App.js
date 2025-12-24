import React, { useState } from "react";
import Navbar from "./components/navbar";
import Home from "./components/Home";
import About from "./components/About";
import Skills from "./components/Skills";
import Work from "./components/Work";
import Contact from "./components/Contact";

function App() {
  const [activeSection, setActiveSection] = useState('home');

  const sections = {
    home: <Home setActiveSection={setActiveSection} />,
    about: <About />,
    skills: <Skills />,
    projects: <Work />,
    contact: <Contact />
  };

  return (
    <div className="min-h-screen bg-[#0a192f]">
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="pt-20">
        {sections[activeSection]}
      </div>
    </div>
  );
}

export default App;
