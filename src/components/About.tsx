import { useLanguage } from '../hooks/useLanguage';

interface CardProps {
  title: string;
  text: string;
}

const Card = ({ title, text }: CardProps) => (
  <article className="mb-4 break-inside-avoid rounded-xl border border-hairline/5 bg-raised p-5 transition-colors duration-300 hover:border-accent/50">
    <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-accent-soft sm:text-xl">
      <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true"></span>
      {title}
    </h2>
    <p className="text-[15px] leading-relaxed text-body">{text}</p>
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
    <div className="section-shell flex w-full items-center bg-surface py-10 text-body">
      <div className="mx-auto w-full max-w-5xl px-6 sm:px-8">
        <div className="mb-6 text-center">
          <h1 className="inline border-b-4 border-accent pb-2 text-3xl font-bold sm:text-4xl">
            {t.about.title}
          </h1>
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
