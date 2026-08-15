import { useLanguage } from '../hooks/useLanguage';
import { data } from '../data/data';
import ProjectCard from './ProjectCard';

const Work = () => {
  const { t } = useLanguage();

  return (
    <section className="section-shell flex w-full items-center bg-surface py-10 text-body">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
        <header className="mb-6 text-center">
          <h1 className="inline-block border-b-4 border-accent pb-2 text-3xl font-bold sm:text-4xl">
            {t.projects.title}
          </h1>
        </header>

        <ul className="grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Work;
