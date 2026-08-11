import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { data } from '../data/data.js';
import { localizedPath } from '../lib/navigation';
const FOCUS_RING =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft';
const Work = () => {
  const { t, language } = useLanguage();

  return (
    <section className="section-shell flex w-full items-center bg-surface py-10 text-body">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
        <header className="mb-6 text-center">
          <h2 className="inline-block border-b-4 border-accent pb-2 text-3xl font-bold sm:text-4xl">
            {t.projects.title}
          </h2>
          <p className="mt-3 text-body">{t.projects.subtitle}</p>
        </header>

        <ul className="grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((item) => (
            <li
              key={item.id}
              className="group flex flex-col overflow-hidden rounded-xl bg-raised border border-hairline/5 hover:border-accent-soft/40 focus-within:border-accent-soft/40 transition-colors duration-300"
            >
              <div className="aspect-[2/1] overflow-hidden bg-surface">
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

              <div className="flex flex-1 flex-col gap-3 p-4">
                <h3 className="text-base font-bold text-heading">{item.name}</h3>

                <div className="mt-auto flex flex-wrap gap-2 pt-1">
                  {item.caseStudy && (
                    <Link
                      to={`${localizedPath('projects', language)}/${item.caseStudy}`}
                      aria-label={item.name + ' - ' + t.projects.readCaseStudy}
                      className={
                        'rounded-md px-3 py-1.5 text-xs font-semibold bg-accent text-white hover:bg-accent-hover transition-colors ' +
                        FOCUS_RING
                      }
                    >
                      {t.projects.readCaseStudy}
                    </Link>
                  )}
                  {item.live && (
                    <a
                      href={item.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.name + ' - ' + t.projects.live}
                      className={
                        'rounded-md px-3 py-1.5 text-xs font-semibold border border-hairline/25 text-body hover:border-accent-soft hover:text-accent-soft transition-colors ' +
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
                        'rounded-md px-3 py-1.5 text-xs font-semibold border border-hairline/25 text-body hover:border-accent-soft hover:text-accent-soft transition-colors ' +
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
