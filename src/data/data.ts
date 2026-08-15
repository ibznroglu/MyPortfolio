import PortfolioImg from '../assets/projects/portfolio.webp';
import PortfolioImgSmall from '../assets/projects/portfolio-560.webp';
import VargelogluInsaatImg from '../assets/projects/vargelogluinsaat.webp';
import VargelogluInsaatImgSmall from '../assets/projects/vargelogluinsaat-560.webp';
import GamingProMarketImg from '../assets/projects/gamingpromarket.webp';
import GamingProMarketImgSmall from '../assets/projects/gamingpromarket-560.webp';
import type { CaseStudySlug } from '../lib/caseStudies';

export interface Project {
  id: number;
  name: string;
  /** 900w. Paired with a 560w variant so the browser can pick. */
  image: string;
  imageSmall: string;
  github: string;
  live: string;
  /** Present only for projects that have a written case study. */
  caseStudy?: CaseStudySlug;
}

export const data: Project[] = [
  {
    id: 1,
    name: 'isabezeniroglu.com',
    image: PortfolioImg,
    imageSmall: PortfolioImgSmall,
    github: 'https://github.com/ibznroglu/MyPortfolio',
    live: 'https://isabezeniroglu.com/',
    caseStudy: 'portfolio',
  },
  {
    id: 2,
    name: 'Vargeloğlu İnşaat',
    image: VargelogluInsaatImg,
    imageSmall: VargelogluInsaatImgSmall,
    github: 'https://github.com/ibznroglu/vargeloglu-insaat-Vue',
    live: 'https://www.vargelogluinsaat.com/',
    caseStudy: 'vargeloglu-insaat',
  },
  {
    id: 3,
    name: 'Gaming Pro Market',
    image: GamingProMarketImg,
    imageSmall: GamingProMarketImgSmall,
    github: '',
    live: '',
    caseStudy: 'gaming-pro-market',
  },
];
