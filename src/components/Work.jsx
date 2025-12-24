import React from 'react';
import { useLanguage } from "../context/LanguageContext";
import { data } from "../data/data.js";

const Work = () => {
  const { t } = useLanguage();
  const project = data;

  return (
    <div className='w-full min-h-[calc(100vh-80px)] text-gray-300 bg-[#0a192f] py-16'>
      <div className='max-w-6xl mx-auto px-8'>
        <div className='text-center mb-12'>
          <h2 className='text-5xl font-bold inline border-b-4 border-pink-600 pb-2'>
            {t.projects.title}
          </h2>
          <p className='py-4 text-gray-400'>{t.projects.subtitle}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {project.map((item, index) => (
            <div
              key={item.id || index}
              className="group relative overflow-hidden rounded-xl border border-pink-600/20 hover:border-pink-600/50 transition-all duration-300"
            >
              <div
                style={{ backgroundImage: `url(${item.image})` }}
                className="h-64 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-[#0a192f]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-2xl font-bold text-white mb-4">{item.name}</h3>
                <div className="flex gap-4">
                  {item.live && (
                    <a href={item.live} target="_blank" rel="noopener noreferrer" className="flex-1">
                      <button className="w-full rounded-lg px-6 py-3 bg-white text-gray-700 font-bold hover:bg-pink-600 hover:text-white transition-all duration-300 transform hover:scale-105">
                        {t.projects.live}
                      </button>
                    </a>
                  )}
                  {item.github && (
                    <a href={item.github} target="_blank" rel="noopener noreferrer" className="flex-1">
                      <button className="w-full rounded-lg px-6 py-3 bg-gray-800 text-white font-bold hover:bg-pink-600 transition-all duration-300 transform hover:scale-105">
                        {t.projects.code}
                      </button>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
