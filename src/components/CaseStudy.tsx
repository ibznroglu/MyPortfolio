import { Link, useParams } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { isCaseStudySlug, type CaseStudyContent } from '../lib/caseStudies';
import { localizedPath } from '../lib/navigation';
import NotFound from './NotFound';

const FOCUS_RING =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400';

const BACK_LINK = `inline-block rounded text-sm text-gray-400 transition-colors hover:text-pink-500 ${FOCUS_RING}`;

const CaseStudy = () => {
  const { caseSlug = '' } = useParams();
  const { t, language } = useLanguage();

  // An unknown slug is a wrong URL, not an empty page.
  if (!isCaseStudySlug(caseSlug)) return <NotFound />;

  const study = (t.caseStudies as Record<string, CaseStudyContent>)[caseSlug];

  if (!study) return <NotFound />;

  const projectsPath = localizedPath('projects', language);

  return (
    <article className="w-full bg-[#0a192f] py-12 text-gray-300">
      <div className="mx-auto max-w-3xl px-6 sm:px-8">
        <Link to={projectsPath} className={BACK_LINK}>
          ← {study.backLabel}
        </Link>

        <header className="mt-6 border-b border-white/10 pb-8">
          <h1 className="text-3xl font-bold leading-tight text-[#ccd6f6] sm:text-4xl">
            {study.title}
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-400">{study.summary}</p>

          <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-gray-500">{study.roleLabel}</dt>
              <dd className="mt-1 text-gray-300">{study.role}</dd>
            </div>
            <div>
              <dt className="text-gray-500">{study.stackLabel}</dt>
              <dd className="mt-1 text-gray-300">{study.stack}</dd>
            </div>
            <div>
              <dt className="text-gray-500">{study.timelineLabel}</dt>
              <dd className="mt-1 text-gray-300">{study.timeline}</dd>
            </div>
          </dl>

          {study.liveUrl && study.liveLabel && (
            <a
              href={study.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-6 inline-block rounded-md bg-pink-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-pink-500 ${FOCUS_RING}`}
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
          <h2 className="text-sm uppercase tracking-wide text-gray-500">{study.metricsHeading}</h2>
          <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {study.metrics.map((metric) => (
              <div key={metric.label} className="rounded-lg border border-white/5 bg-[#112240] p-4">
                <dt className="text-xs text-gray-500">{metric.label}</dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums text-[#ccd6f6]">
                  {metric.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {study.sections.map((section) => (
          <section key={section.heading} className="mt-10">
            <h2 className="text-xl font-bold text-pink-500">{section.heading}</h2>

            {section.body?.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="mt-4 text-[15px] leading-relaxed">
                {paragraph}
              </p>
            ))}

            {section.items && (
              <dl className="mt-4 space-y-4">
                {section.items.map((item) => (
                  <div key={item.term}>
                    <dt className="inline font-semibold text-[#ccd6f6]">{item.term}</dt>{' '}
                    <dd className="inline text-[15px] leading-relaxed">{item.text}</dd>
                  </div>
                ))}
              </dl>
            )}
          </section>
        ))}

        <footer className="mt-12 border-t border-white/10 pt-6">
          <Link to={projectsPath} className={BACK_LINK}>
            ← {study.backLabel}
          </Link>
        </footer>
      </div>
    </article>
  );
};

export default CaseStudy;
