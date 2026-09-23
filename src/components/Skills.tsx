import { useLanguage } from '../hooks/useLanguage';
import { SKILL_GROUPS, skillsByGroup } from '../data/skills';

const Skills = () => {
  const { t } = useLanguage();

  return (
    <div className="w-full section-shell bg-gradient-to-b from-raised to-surface py-8 text-body lg:py-6">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="mb-8 text-center lg:mb-6">
          <div className="inline-block border-b-4 border-accent pb-2">
            <h1 className="text-3xl font-bold sm:text-4xl">{t.skills.title}</h1>
          </div>
        </div>

        {/* Pair the four groups on desktop, keeping every skill visible without
            stacking four full-width bands. Smaller screens retain a single column. */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-x-10 lg:gap-y-6">
          {SKILL_GROUPS.map((group) => (
            <section key={group}>
              <h2 className="mb-4 text-xs lg:mb-3 font-semibold uppercase tracking-widest text-muted">
                {t.skills.groups[group]}
              </h2>
              <ul className="grid list-none grid-cols-4 gap-2 p-0 sm:grid-cols-6 lg:grid-cols-4">
                {skillsByGroup(group).map((skill) => (
                  <li
                    key={skill.name}
                    className="group flex flex-col items-center gap-2 rounded-lg p-3 text-center lg:p-2 transition-colors hover:bg-raised"
                  >
                    {/* Decorative: the name follows as text directly beneath. */}
                    <img
                      className={`h-10 w-10 transition-transform group-hover:scale-110 ${skill.monochrome ? 'icon-monochrome' : ''}`}
                      src={skill.icon}
                      alt=""
                      aria-hidden="true"
                      width="40"
                      height="40"
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="text-xs font-semibold leading-tight">{skill.name}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;
