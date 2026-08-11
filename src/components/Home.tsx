import { useLanguage } from '../hooks/useLanguage';
import { useVisitorTracking } from '../hooks/useVisitorTracking';
import { HiUsers, HiUserGroup } from 'react-icons/hi';
import IsaImg from '../assets/isa.webp';

const Home = () => {
  const { t } = useLanguage();
  const { totalVisitors, activeUsers, status } = useVisitorTracking();

  return (
    <div className="w-full section-shell flex items-center justify-center bg-gradient-to-br from-surface via-raised to-surface">
      <div className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-8">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-12">
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-accent rounded-full blur-2xl opacity-20 animate-pulse"></div>
              <img
                src={IsaImg}
                alt="İsa Bezeniroğlu"
                width="512"
                height="512"
                className="relative h-48 w-48 rounded-full border-4 border-accent object-cover shadow-2xl shadow-accent/50 sm:h-64 sm:w-64"
                style={{ objectPosition: '50% calc(50% + 2rem)' }}
              />
              <div className="absolute -bottom-1 -right-1 h-6 w-6 animate-pulse rounded-full border-4 border-surface bg-green-500 shadow-lg sm:-bottom-2 sm:-right-2 sm:h-8 sm:w-8"></div>
            </div>
          </div>
          <div className="flex-1 text-center lg:text-left space-y-6">
            <div>
              <p className="mb-3 text-base font-semibold text-accent-soft sm:text-xl">
                {t.home.title}
              </p>
              <h1 className="mb-4 break-words text-4xl font-bold leading-tight text-heading sm:text-5xl md:text-6xl lg:text-7xl">
                {t.home.name}
              </h1>
            </div>
            <p className="mx-auto max-w-2xl text-[15px] leading-relaxed text-body sm:text-lg lg:mx-0">
              {t.home.description}
            </p>

            {/* Hidden entirely when the database is unreachable: showing 0 would
                be a wrong number, and a spinner that never resolves is worse. */}
            {status !== 'unavailable' && (
              <div className="mt-8 flex flex-wrap justify-center gap-3 sm:gap-4 lg:justify-start">
                <div className="flex min-w-[140px] flex-1 items-center gap-3 rounded-lg border border-accent/30 bg-raised px-4 py-3 shadow-lg sm:flex-none">
                  <div className="bg-accent/20 p-2 rounded-lg">
                    <HiUsers className="text-accent-soft text-xl" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-body text-sm">{t.visitor.total}</p>
                    {status === 'loading' ? (
                      <div
                        className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin mt-1"
                        role="status"
                        aria-label={t.visitor.total}
                      />
                    ) : (
                      <p className="text-heading text-xl font-bold">
                        {totalVisitors.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex min-w-[140px] flex-1 items-center gap-3 rounded-lg border border-green-500/30 bg-raised px-4 py-3 shadow-lg sm:flex-none">
                  <div className="bg-green-500/20 p-2 rounded-lg">
                    <HiUserGroup className="text-green-500 text-xl" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-body text-sm">{t.visitor.active}</p>
                    {status === 'loading' ? (
                      <div
                        className="w-5 h-5 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin mt-1"
                        role="status"
                        aria-label={t.visitor.active}
                      />
                    ) : (
                      <p className="flex items-center justify-center gap-2 text-xl font-bold tabular-nums text-heading lg:justify-start">
                        {activeUsers}
                        <span
                          className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                          aria-hidden="true"
                        ></span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
