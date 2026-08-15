import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { localizedPath } from '../lib/navigation';
import { data } from '../data/data';
import { featuredSkills } from '../data/skills';
import { resume } from '../data/resume';
import ProjectCard from './ProjectCard';
import IsaImg from '../assets/isa.webp';

const FOCUS_RING =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft';

const PRIMARY_CTA =
  'inline-flex items-center justify-center rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover ' +
  FOCUS_RING;

const SECONDARY_CTA =
  'inline-flex items-center justify-center rounded-lg border border-hairline/25 px-6 py-3 text-sm font-semibold text-body transition-colors hover:border-accent-soft hover:text-accent-soft ' +
  FOCUS_RING;

const SECTION_LINK =
  'inline-flex items-center gap-1 rounded text-sm font-semibold text-accent-soft transition-colors hover:text-accent ' +
  FOCUS_RING;

const Home = () => {
  const { t, language } = useLanguage();
  const to = (key: Parameters<typeof localizedPath>[0]) => localizedPath(key, language);

  return (
    <div className="w-full bg-surface">
      {/* Sized by its content rather than the viewport. A forced full height
          left half the fold empty on a laptop and pushed the first preview out
          of sight, which is the opposite of what this page is for. */}
      <section className="flex w-full items-center justify-center bg-gradient-to-br from-surface via-raised to-surface py-16 lg:py-24">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-12">
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-accent opacity-20 blur-2xl"></div>
                <img
                  src={IsaImg}
                  alt="İsa Bezeniroğlu"
                  width="512"
                  height="512"
                  className="relative h-48 w-48 rounded-full border-4 border-accent object-cover shadow-2xl shadow-accent/50 sm:h-64 sm:w-64"
                  style={{ objectPosition: '50% calc(50% + 2rem)' }}
                />
                <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-4 border-surface bg-green-500 shadow-lg sm:-bottom-2 sm:-right-2 sm:h-8 sm:w-8"></div>
              </div>
            </div>

            <div className="flex-1 space-y-6 text-center lg:text-left">
              <div>
                <p className="mb-3 text-base font-semibold text-accent-soft sm:text-xl">
                  {t.home.title}
                </p>
                <h1 className="mb-4 break-words text-4xl font-bold leading-tight text-heading sm:text-5xl md:text-6xl lg:text-7xl">
                  {t.home.name}
                </h1>
              </div>

              <p className="mx-auto max-w-2xl text-[15px] leading-relaxed text-body sm:text-lg lg:mx-0">
                {t.home.description}
              </p>

              <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
                <Link to={to('projects')} className={PRIMARY_CTA}>
                  {t.home.viewProjects}
                </Link>
                <a
                  href={resume.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={SECONDARY_CTA}
                >
                  {t.home.downloadCv}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-hairline/5 bg-raised py-14">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
          <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="text-2xl font-bold text-heading sm:text-3xl">{t.skills.title}</h2>
            <Link to={to('skills')} className={SECTION_LINK}>
              {t.home.seeAllSkills} <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <ul className="grid list-none grid-cols-4 gap-4 p-0 sm:grid-cols-6 lg:grid-cols-8">
            {featuredSkills.map((skill) => (
              <li key={skill.name} className="flex flex-col items-center gap-2 text-center">
                {/* Decorative: the name is already rendered as text beside it,
                    so alt text would only repeat what a screen reader just read. */}
                <img
                  src={skill.icon}
                  alt=""
                  aria-hidden="true"
                  width="40"
                  height="40"
                  loading="lazy"
                  decoding="async"
                  className="h-10 w-10"
                />
                <span className="text-[11px] font-semibold leading-tight text-muted">
                  {skill.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-hairline/5 bg-surface py-14">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
          <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="text-2xl font-bold text-heading sm:text-3xl">{t.projects.title}</h2>
            <Link to={to('projects')} className={SECTION_LINK}>
              {t.home.seeAllProjects} <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <ul className="grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </ul>
        </div>
      </section>

      {/* beyondText rather than experienceText: the latter restates the hero
          almost word for word, which only becomes visible once the two share
          a single scroll. */}
      <section className="border-t border-hairline/5 bg-raised py-14">
        <div className="mx-auto w-full max-w-3xl px-6 sm:px-8">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="text-2xl font-bold text-heading sm:text-3xl">{t.about.title}</h2>
            <Link to={to('about')} className={SECTION_LINK}>
              {t.home.readMore} <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
          <p className="text-[15px] leading-relaxed text-body sm:text-base">{t.about.beyondText}</p>
        </div>
      </section>

      <section className="border-t border-hairline/5 bg-surface py-16">
        <div className="mx-auto w-full max-w-3xl px-6 text-center sm:px-8">
          <h2 className="text-2xl font-bold text-heading sm:text-3xl">{t.contact.title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-body sm:text-base">
            {t.home.contactCta}
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to={to('contact')} className={PRIMARY_CTA}>
              {t.home.contactAction}
            </Link>
            <a
              href={resume.href}
              target="_blank"
              rel="noopener noreferrer"
              className={SECONDARY_CTA}
            >
              {t.home.downloadCv}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
