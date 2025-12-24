import React from "react";
import { useLanguage } from "../context/LanguageContext";

const About = () => {
  const { t } = useLanguage();

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-[#0a192f] text-gray-300 py-16">
      <div className="max-w-6xl mx-auto px-8">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold inline border-b-4 border-pink-600 pb-2">
            {t.about.title}
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-[#112240] p-8 rounded-xl border border-pink-600/20 hover:border-pink-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-pink-600/20">
            <h3 className="text-2xl font-bold text-pink-600 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-pink-600 rounded-full"></span>
              {t.about.experience}
            </h3>
            <p className="text-gray-300 leading-relaxed">
              {t.about.experienceText}
            </p>
          </div>
          <div className="bg-[#112240] p-8 rounded-xl border border-pink-600/20 hover:border-pink-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-pink-600/20">
            <h3 className="text-2xl font-bold text-pink-600 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-pink-600 rounded-full"></span>
              {t.about.approach}
            </h3>
            <p className="text-gray-300 leading-relaxed">
              {t.about.approachText}
            </p>
          </div>
          <div className="bg-[#112240] p-8 rounded-xl border border-pink-600/20 hover:border-pink-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-pink-600/20">
            <h3 className="text-2xl font-bold text-pink-600 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-pink-600 rounded-full"></span>
              {t.about.tech}
            </h3>
            <p className="text-gray-300 leading-relaxed">
              {t.about.techText}
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              {t.about.toolsText}
            </p>
          </div>
          <div className="bg-[#112240] p-8 rounded-xl border border-pink-600/20 hover:border-pink-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-pink-600/20">
            <h3 className="text-2xl font-bold text-pink-600 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-pink-600 rounded-full"></span>
              {t.about.goals}
            </h3>
            <p className="text-gray-300 leading-relaxed">
              {t.about.goalsText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
