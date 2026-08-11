import { useLanguage } from '../hooks/useLanguage';

interface CardProps {
  title: string;
  text: string;
}

const Card = ({ title, text }: CardProps) => (
  <article className="mb-4 break-inside-avoid rounded-xl border border-white/5 bg-[#112240] p-5 transition-colors duration-300 hover:border-pink-600/50">
    <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-pink-500 sm:text-xl">
      <span className="h-2 w-2 rounded-full bg-pink-600" aria-hidden="true"></span>
      {title}
    </h3>
    <p className="text-[15px] leading-relaxed text-gray-300">{text}</p>
  </article>
);

const About = () => {
  const { t } = useLanguage();

  const cards = [
    { title: t.about.experience, text: t.about.experienceText },
    { title: t.about.beyond, text: t.about.beyondText },
    { title: t.about.howIWork, text: t.about.howIWorkText },
    { title: t.about.goals, text: t.about.goalsText },
  ];

  return (
    <div className="section-shell flex w-full items-center bg-[#0a192f] py-10 text-gray-300">
      <div className="mx-auto w-full max-w-5xl px-6 sm:px-8">
        <div className="mb-6 text-center">
          <h2 className="inline border-b-4 border-pink-600 pb-2 text-3xl font-bold sm:text-4xl">
            {t.about.title}
          </h2>
        </div>

        {/* CSS columns rather than a grid: the cards have different lengths and a
            grid row would stretch every card to the tallest one in it. */}
        <div className="columns-1 gap-4 md:columns-2">
          {cards.map((card) => (
            <Card key={card.title} title={card.title} text={card.text} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
