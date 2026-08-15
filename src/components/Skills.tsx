import { useLanguage } from '../hooks/useLanguage';
import { skills } from '../data/skills';

const Skills = () => {
  const { t } = useLanguage();

  return (
    <div className="w-full section-shell bg-gradient-to-b from-raised to-surface text-body py-12">
      <div className="max-w-6xl mx-auto px-8">
        <div className="text-center mb-12">
          <div className="inline-block border-b-4 border-accent pb-2">
            <h2 className="text-3xl font-bold sm:text-4xl">{t.skills.title}</h2>
          </div>
          <p className="py-4 text-body">{t.skills.subtitle}</p>
        </div>
        <ul className="grid list-none grid-cols-3 gap-4 p-0 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {skills.map((skill) => (
            <li
              key={skill.name}
              className="bg-raised p-4 rounded-xl border border-accent/20 hover:border-accent hover:shadow-xl hover:shadow-accent/30 transition-all duration-300 transform hover:scale-105 text-center group flex flex-col items-center justify-between"
            >
              <img
                className="w-11 h-11 mx-auto mb-3 group-hover:scale-110 transition-transform"
                src={skill.icon}
                alt={skill.name}
                width="44"
                height="44"
                loading="lazy"
                decoding="async"
              />
              <p className="text-sm font-semibold leading-tight">{skill.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Skills;
