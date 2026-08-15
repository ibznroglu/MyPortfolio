import { useLanguage } from '../hooks/useLanguage';
import { SKILL_GROUPS, skillsByGroup } from '../data/skills';

const Skills = () => {
  const { t } = useLanguage();

  return (
    <div className="w-full section-shell bg-gradient-to-b from-raised to-surface py-8 text-body">
      <div className="mx-auto max-w-6xl px-8">
        <div className="mb-8 text-center">
          <div className="inline-block border-b-4 border-accent pb-2">
            <h1 className="text-3xl font-bold sm:text-4xl">{t.skills.title}</h1>
          </div>
        </div>

        {/* Grouped rather than one flat grid. Seventeen icons at equal weight
            said everything mattered equally; three bands put the stack first
            and let the rest support it. */}
        <div className="space-y-8">
          {SKILL_GROUPS.map((group) => (
            <section key={group}>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
                {t.skills.groups[group]}
              </h2>
              <ul className="grid list-none grid-cols-3 gap-4 p-0 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                {skillsByGroup(group).map((skill) => (
                  <li
                    key={skill.name}
                    className="group flex flex-col items-center justify-between rounded-xl border border-accent/20 bg-raised p-4 text-center transition-all duration-300 hover:scale-105 hover:border-accent hover:shadow-xl hover:shadow-accent/30"
                  >
                    {/* Decorative: the name follows as text in the same card. */}
                    <img
                      className="mx-auto mb-3 h-11 w-11 transition-transform group-hover:scale-110"
                      src={skill.icon}
                      alt=""
                      aria-hidden="true"
                      width="44"
                      height="44"
                      loading="lazy"
                      decoding="async"
                    />
                    <p className="text-sm font-semibold leading-tight">{skill.name}</p>
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
