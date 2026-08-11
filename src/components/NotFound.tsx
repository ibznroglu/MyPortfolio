import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { localizedPath } from '../lib/navigation';

const NotFound = () => {
  const { t, language } = useLanguage();

  return (
    <section className="section-shell flex items-center justify-center bg-surface px-6 text-center">
      <div className="max-w-lg">
        <p className="text-7xl sm:text-8xl font-bold text-accent-soft">404</p>

        <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-heading">{t.notFound.title}</h1>

        <p className="mt-3 text-[15px] leading-relaxed text-body">{t.notFound.message}</p>

        <Link
          to={localizedPath('', language)}
          className="mt-8 inline-block rounded-lg bg-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft"
        >
          {t.notFound.back}
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
