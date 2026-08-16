import { useLanguage } from '../hooks/useLanguage';
import { SKILL_GROUPS, skillsByGroup } from '../data/skills';

const Skills = () => {
  const { t } = useLanguage();

  return (
    <div className="w-full section-shell bg-gradient-to-b from-raised to-surface py-8 text-body">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        <div className="mb-8 text-center">
          <div className="inline-block border-b-4 border-accent pb-2">
            <h1 className="text-3xl font-bold sm:text-4xl">{t.skills.title}</h1>
          </div>
        </div>

        {/* Grouped rather than one flat grid. Seventeen icons at equal weight
            said everything mattered equally; three bands put the stack first
            and let the rest support it.

            No card chrome either. A border, a fill and a glow around every
            entry drew more attention to the container than to the logo inside
            it, and the same list already reads fine on the home page as plain
            icons. The hover tint is the only surface, and it appears on the
            item you are actually pointing at. */}
        <div className="space-y-8">
          {SKILL_GROUPS.map((group) => (
            <section key={group}>
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted">
                {t.skills.groups[group]}
              </h2>
              <ul className="grid list-none grid-cols-4 gap-2 p-0 sm:grid-cols-6 lg:grid-cols-8">
                {skillsByGroup(group).map((skill) => (
                  <li
                    key={skill.name}
                    className="group flex flex-col items-center gap-2 rounded-lg p-3 text-center transition-colors hover:bg-raised"
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
