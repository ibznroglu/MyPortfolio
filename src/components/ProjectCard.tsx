import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { localizedPath } from '../lib/navigation';
import type { Project } from '../data/data';

const FOCUS_RING =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft';

const SECONDARY_ACTION =
  'rounded-md px-3 py-1.5 text-xs font-semibold border border-hairline/25 text-body hover:border-accent-soft hover:text-accent-soft transition-colors ' +
  FOCUS_RING;

interface Props {
  project: Project;
  /**
   * The card sits directly under the h1 on the projects page and under a
   * section h2 on the home page, so a fixed level would skip one in one of
   * them.
   */
  headingLevel?: 2 | 3;
}

const ProjectCard = ({ project, headingLevel = 2 }: Props) => {
  const { t, language } = useLanguage();
  const Heading = headingLevel === 3 ? 'h3' : 'h2';

  return (
    <li className="group flex flex-col overflow-hidden rounded-xl bg-raised border border-hairline/5 hover:border-accent-soft/40 focus-within:border-accent-soft/40 transition-colors duration-300">
      <div className="aspect-[2/1] overflow-hidden bg-surface">
        {/* The widest this card ever gets is about 405px, in the two-column
            range. 560w leaves a 1x screen some headroom and 900w covers 2x;
            sizes tells the browser which to take before layout is known. */}
        <img
          src={project.image}
          srcSet={`${project.imageSmall} 560w, ${project.image} 900w`}
          sizes="(min-width: 1024px) 370px, (min-width: 640px) 45vw, calc(100vw - 3rem)"
          alt={project.name}
          loading="lazy"
          decoding="async"
          width="900"
          height="450"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <Heading className="text-base font-bold text-heading">{project.name}</Heading>

        <div className="mt-auto flex flex-wrap gap-2 pt-1">
          {project.caseStudy && (
            <Link
              to={`${localizedPath('projects', language)}/${project.caseStudy}`}
              aria-label={project.name + ' - ' + t.projects.readCaseStudy}
              className={
                'rounded-md px-3 py-1.5 text-xs font-semibold bg-accent text-white hover:bg-accent-hover transition-colors ' +
                FOCUS_RING
              }
            >
              {t.projects.readCaseStudy}
            </Link>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={project.name + ' - ' + t.projects.live}
              className={SECONDARY_ACTION}
            >
              {t.projects.live}
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={project.name + ' - ' + t.projects.code}
              className={SECONDARY_ACTION}
            >
              {t.projects.code}
            </a>
          )}
        </div>
      </div>
    </li>
  );
};

export default ProjectCard;
