import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { data } from '../data/data.js';

const Work = () => {
  const { t } = useLanguage();

  return (
    <section className="w-full min-h-[calc(100vh-80px)] text-gray-300 bg-[#0a192f] py-16">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <header className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold inline-block border-b-4 border-pink-600 pb-2">
            {t.projects.title}
          </h2>
          <p className="py-4 text-gray-400">{t.projects.subtitle}</p>
        </header>

        <ul className="grid gap-8 sm:grid-cols-2 list-none p-0">
          {data.map((item) => (
            <li
              key={item.id}
              className="group flex flex-col overflow-hidden rounded-xl bg-[#112240] border border-pink-600/20 hover:border-pink-600/50 focus-within:border-pink-600/50 transition-colors duration-300"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#0a192f]">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-[#ccd6f6]">{item.name}</h3>

                <div className="mt-auto flex flex-wrap gap-3">
                  {item.live && (
                    <a
                      href={item.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.name + ' - ' + t.projects.live}
                      className="flex-1 min-w-[120px] rounded-lg px-5 py-3 text-center font-bold bg-pink-600 text-white hover:bg-pink-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400 transition-colors duration-300"
                    >
                      {t.projects.live}
                    </a>
                  )}

                  {item.github && (
                    <a
                      href={item.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.name + ' - ' + t.projects.code}
                      className="flex-1 min-w-[120px] rounded-lg px-5 py-3 text-center font-bold border border-gray-500 text-gray-200 hover:border-pink-500 hover:text-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400 transition-colors duration-300"
                    >
                      {t.projects.code}
                    </a>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Work;
