import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { data } from '../data/data.js';
const FOCUS_RING =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400';
const Work = () => {
  const { t } = useLanguage();

  return (
    <section className="w-full section-shell text-gray-300 bg-[#0a192f] py-12">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        <header className="text-center mb-8">
          <h2 className="text-4xl sm:text-5xl font-bold inline-block border-b-4 border-pink-600 pb-2">
            {t.projects.title}
          </h2>
          <p className="py-4 text-gray-400">{t.projects.subtitle}</p>
        </header>

        <ul className="grid gap-8 sm:grid-cols-2 list-none p-0">
          {data.map((item) => (
            <li
              key={item.id}
              className="group flex flex-col overflow-hidden rounded-xl bg-[#112240] border border-white/5 hover:border-pink-500/40 focus-within:border-pink-500/40 transition-colors duration-300"
            >
              <div className="aspect-[2/1] overflow-hidden bg-[#0a192f]">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  decoding="async"
                  width="1100"
                  height="550"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </div>

              <div className="flex flex-1 flex-col gap-3 p-5">
                <h3 className="text-lg font-bold text-[#ccd6f6]">{item.name}</h3>

                <div className="mt-auto flex flex-wrap gap-2 pt-1">
                  {item.live && (
                    <a
                      href={item.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.name + ' - ' + t.projects.live}
                      className={
                        'rounded-md px-4 py-2 text-sm font-semibold bg-pink-600 text-white hover:bg-pink-500 transition-colors ' +
                        FOCUS_RING
                      }
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
                      className={
                        'rounded-md px-4 py-2 text-sm font-semibold border border-gray-600 text-gray-300 hover:border-pink-500 hover:text-pink-500 transition-colors ' +
                        FOCUS_RING
                      }
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
