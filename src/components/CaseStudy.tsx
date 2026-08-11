import { Link, useParams } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { isCaseStudySlug, type CaseStudyContent } from '../lib/caseStudies';
import { localizedPath } from '../lib/navigation';
import NotFound from './NotFound';

const FOCUS_RING =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft';

const BACK_LINK = `inline-block rounded text-sm text-body transition-colors hover:text-accent-soft ${FOCUS_RING}`;

const CaseStudy = () => {
  const { caseSlug = '' } = useParams();
  const { t, language } = useLanguage();

  // An unknown slug is a wrong URL, not an empty page.
  if (!isCaseStudySlug(caseSlug)) return <NotFound />;

  const study = (t.caseStudies as Record<string, CaseStudyContent>)[caseSlug];

  if (!study) return <NotFound />;

  const projectsPath = localizedPath('projects', language);

  return (
    <article className="w-full bg-surface py-12 text-body">
      <div className="mx-auto max-w-3xl px-6 sm:px-8">
        <Link to={projectsPath} className={BACK_LINK}>
          ← {study.backLabel}
        </Link>

        <header className="mt-6 border-b border-hairline/10 pb-8">
          <h1 className="text-3xl font-bold leading-tight text-heading sm:text-4xl">
            {study.title}
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-body">{study.summary}</p>

          <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-muted">{study.roleLabel}</dt>
              <dd className="mt-1 text-body">{study.role}</dd>
            </div>
            <div>
              <dt className="text-muted">{study.stackLabel}</dt>
              <dd className="mt-1 text-body">{study.stack}</dd>
            </div>
            <div>
              <dt className="text-muted">{study.timelineLabel}</dt>
              <dd className="mt-1 text-body">{study.timeline}</dd>
            </div>
          </dl>

          {study.liveUrl && study.liveLabel && (
            <a
              href={study.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-6 inline-block rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-hover ${FOCUS_RING}`}
            >
              {study.liveLabel}
            </a>
          )}

          {study.statusNote && (
            <p className="mt-6 rounded-md border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-300">
              {study.statusNote}
            </p>
          )}
        </header>

        <section aria-label={study.metricsHeading} className="mt-10">
          <h2 className="text-sm uppercase tracking-wide text-muted">{study.metricsHeading}</h2>
          <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {study.metrics.map((metric) => (
              <div key={metric.label} className="rounded-lg border border-hairline/5 bg-raised p-4">
                <dt className="text-xs text-muted">{metric.label}</dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums text-heading">
                  {metric.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {study.sections.map((section) => (
          <section key={section.heading} className="mt-10">
            <h2 className="text-xl font-bold text-accent-soft">{section.heading}</h2>

            {section.body?.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="mt-4 text-[15px] leading-relaxed">
                {paragraph}
              </p>
            ))}

            {section.items && (
              <dl className="mt-4 space-y-4">
                {section.items.map((item) => (
                  <div key={item.term}>
                    <dt className="inline font-semibold text-heading">{item.term}</dt>{' '}
                    <dd className="inline text-[15px] leading-relaxed">{item.text}</dd>
                  </div>
                ))}
              </dl>
            )}
          </section>
        ))}

        <footer className="mt-12 border-t border-hairline/10 pt-6">
          <Link to={projectsPath} className={BACK_LINK}>
            ← {study.backLabel}
          </Link>
        </footer>
      </div>
    </article>
  );
};

export default CaseStudy;
