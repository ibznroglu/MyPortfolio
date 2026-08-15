import { useLanguage } from '../hooks/useLanguage';
import IsaImg from '../assets/isa.webp';

const Home = () => {
  const { t } = useLanguage();

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
