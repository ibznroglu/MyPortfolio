import PortfolioImg from '../assets/projects/portfolio.webp';
import VargelogluInsaatImg from '../assets/projects/vargelogluinsaat.webp';
import GamingProMarketImg from '../assets/projects/gamingpromarket.webp';
import type { CaseStudySlug } from '../lib/caseStudies';

export interface Project {
  id: number;
  name: string;
  image: string;
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
    github: 'https://github.com/ibznroglu/MyPortfolio',
    live: 'https://isabezeniroglu.com/',
    caseStudy: 'portfolio',
  },
  {
    id: 2,
    name: 'Vargeloğlu İnşaat',
    image: VargelogluInsaatImg,
    github: 'https://github.com/ibznroglu/vargeloglu-insaat-Vue',
    live: 'https://www.vargelogluinsaat.com/',
    caseStudy: 'vargeloglu-insaat',
  },
  {
    id: 3,
    name: 'Gaming Pro Market',
    image: GamingProMarketImg,
    github: '',
    live: '',
    caseStudy: 'gaming-pro-market',
  },
];
