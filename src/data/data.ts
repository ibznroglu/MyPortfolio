import VargelogluInsaatImg from '../assets/projects/vargelogluinsaat.webp';
import RentalCarImg from '../assets/projects/rentalcar.webp';
import type { CaseStudySlug } from '../lib/caseStudies';

interface Project {
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
    name: 'Vargeloğlu İnşaat',
    image: VargelogluInsaatImg,
    github: '',
    live: 'https://www.vargelogluinsaat.com/',
    caseStudy: 'vargeloglu-insaat',
  },
  {
    id: 2,
    name: 'Rental Car',
    image: RentalCarImg,
    github: '',
    live: 'https://www.letsrentalcar.com/',
  },
];
