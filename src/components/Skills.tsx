import { useLanguage } from '../hooks/useLanguage';
import { SKILL_GROUPS, skillsByGroup } from '../data/skills';

const Skills = () => {
  const { t } = useLanguage();

  return (
    <div className="section-shell flex w-full items-center bg-gradient-to-b from-raised to-surface py-8 text-body lg:py-5">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-16 2xl:px-8">
        <div className="mb-6 text-center">
          <div className="inline-block border-b-4 border-accent pb-2">
            <h1 className="text-3xl font-bold sm:text-4xl">{t.skills.title}</h1>
          </div>
        </div>

        {/* Each group owns a row; a shared icon grid keeps the categories aligned.
            On smaller screens the heading sits above a wrapping grid. */}
        <div className="grid gap-3">
          {SKILL_GROUPS.map((group) => (
            <section
              key={group}
              aria-labelledby={`skills-${group}`}
              className="rounded-xl border border-hairline/10 bg-surface/60 p-3 sm:p-4 lg:grid lg:grid-cols-[11rem_minmax(0,1fr)] lg:items-center lg:gap-4 lg:p-3"
            >
              <h2
                id={`skills-${group}`}
                className="mb-4 border-l-2 border-accent pl-3 text-sm font-semibold leading-relaxed text-heading lg:mb-0"
              >
                {t.skills.groups[group]}
              </h2>
              <ul className="grid list-none grid-cols-3 gap-2 p-0 sm:grid-cols-4 lg:grid-cols-7">
                {skillsByGroup(group).map((skill) => (
                  <li
                    key={skill.name}
                    className="group flex min-w-0 flex-col items-center gap-1.5 rounded-lg p-1.5 text-center transition-colors hover:bg-raised"
                  >
                    <img
                      className={`h-9 w-9 transition-transform group-hover:scale-110 ${skill.monochrome ? 'icon-monochrome' : ''}`}
                      src={skill.icon}
                      alt=""
                      aria-hidden="true"
                      width="36"
                      height="36"
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
