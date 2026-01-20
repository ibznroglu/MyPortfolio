import React from "react";
import { HiArrowNarrowRight } from "react-icons/hi";
import { useLanguage } from "../context/LanguageContext";
import { useVisitorTracking } from "../hooks/useVisitorTracking";
import { HiUsers, HiUserGroup } from "react-icons/hi";
import IsaImg from "../assets/isa.png";

const Home = ({ setActiveSection }) => {
  const { t } = useLanguage();
  const { totalVisitors, activeUsers } = useVisitorTracking();

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-[#0a192f] via-[#112240] to-[#0a192f]">
      <div className="max-w-6xl mx-auto px-8 py-16">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-pink-600 rounded-full blur-2xl opacity-20 animate-pulse"></div>
              <img 
  src={IsaImg} 
  alt="İsa Bezeniroğlu" 
  className="relative w-64 h-64 rounded-full object-cover border-4 border-pink-600 shadow-2xl shadow-pink-600/50" 
  style={{ objectPosition: "50% calc(50% + 2rem)" }} 
/>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-[#0a192f] animate-pulse shadow-lg"></div>
            </div>
          </div>
          <div className="flex-1 text-center lg:text-left space-y-6">
            <div>
              <p className="text-pink-600 text-xl font-semibold mb-3">{t.home.title}</p>
              <h1 className="text-6xl lg:text-7xl font-bold text-[#ccd6f6] mb-4 leading-tight">
                {t.home.name}
              </h1>
            </div>
            <p className="text-[#8892b0] text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {t.home.description}
            </p>
            
            {/* Ziyaretçi İstatistikleri */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mt-8">
              <div className="flex items-center gap-3 bg-[#112240] px-4 py-3 rounded-lg border border-pink-600/30 shadow-lg">
                <div className="bg-pink-600/20 p-2 rounded-lg">
                  <HiUsers className="text-pink-600 text-xl" />
                </div>
                <div>
                  <p className="text-[#8892b0] text-sm">{t.visitor.total}</p>
                  <p className="text-[#ccd6f6] text-xl font-bold">{totalVisitors.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-[#112240] px-4 py-3 rounded-lg border border-green-500/30 shadow-lg">
                <div className="bg-green-500/20 p-2 rounded-lg">
                  <HiUserGroup className="text-green-500 text-xl" />
                </div>
                <div>
                  <p className="text-[#8892b0] text-sm">{t.visitor.active}</p>
                  <p className="text-[#ccd6f6] text-xl font-bold flex items-center gap-2">
                    {activeUsers}
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
