import type { ReactNode } from 'react';
import { useLanguage } from '../hooks/useLanguage';

interface CardProps {
  title: string;
  children: ReactNode;
}

const Card = ({ title, children }: CardProps) => (
  <div className="break-inside-avoid mb-5 bg-[#112240] p-6 rounded-xl border border-white/5 hover:border-pink-600/50 transition-colors duration-300">
    <h3 className="text-xl font-bold text-pink-500 mb-3 flex items-center gap-2">
      <span className="w-2 h-2 bg-pink-600 rounded-full" aria-hidden="true"></span>
      {title}
    </h3>
    {children}
  </div>
);

const About = () => {
  const { t } = useLanguage();

  // Both languages store these as comma-separated lists, so they render as tags.
  const stack = [t.about.techText, t.about.toolsText]
    .join(', ')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <div className="w-full section-shell bg-[#0a192f] text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold inline border-b-4 border-pink-600 pb-2">
            {t.about.title}
          </h2>
        </div>

        <div className="columns-1 md:columns-2 gap-5">
          <Card title={t.about.experience}>
            <p className="text-[15px] leading-relaxed text-gray-300">{t.about.experienceText}</p>
          </Card>

          <Card title={t.about.approach}>
            <p className="text-[15px] leading-relaxed text-gray-300">{t.about.approachText}</p>
          </Card>

          <Card title={t.about.tech}>
            <ul className="flex flex-wrap gap-2 list-none p-0">
              {stack.map((item) => (
                <li
                  key={item}
                  className="rounded-md bg-[#0a192f] border border-white/10 px-2.5 py-1 text-sm text-gray-300"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          <Card title={t.about.goals}>
            <p className="text-[15px] leading-relaxed text-gray-300">{t.about.goalsText}</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
