import JavaScript from '../assets/javascript.webp';
import ReactImg from '../assets/react.webp';
import GitHub from '../assets/github.webp';
import Tailwind from '../assets/tailwind.webp';
import ReactReduxImg from '../assets/redux.webp';
import DockerImg from '../assets/docker.webp';
import WebPackImg from '../assets/webpack.webp';
import SassImg from '../assets/sass.webp';
import TypeScriptImg from '../assets/typescript.webp';
import ReactNativeImg from '../assets/reactnative.webp';
import MaterialUIImg from '../assets/materialui.webp';
import AntDesignImg from '../assets/antdesign.webp';
import NextJsImg from '../assets/nextjs.webp';
import VueImg from '../assets/vue.webp';
import ViteImg from '../assets/vite.webp';
import FirebaseImg from '../assets/firebase.webp';
import VitestImg from '../assets/vitest.webp';

export type SkillGroup = 'core' | 'frameworks' | 'tooling';

export interface Skill {
  name: string;
  icon: string;
  group: SkillGroup;
  /** Shown in the home page strip. The skills page shows everything. */
  featured?: boolean;
}

export const SKILL_GROUPS: readonly SkillGroup[] = ['core', 'frameworks', 'tooling'];

export const skills: Skill[] = [
  { name: 'REACT', icon: ReactImg, group: 'core', featured: true },
  { name: 'REACT NATIVE', icon: ReactNativeImg, group: 'core', featured: true },
  { name: 'TYPESCRIPT', icon: TypeScriptImg, group: 'core', featured: true },
  { name: 'JAVASCRIPT', icon: JavaScript, group: 'core', featured: true },

  { name: 'NEXT.JS', icon: NextJsImg, group: 'frameworks', featured: true },
  { name: 'VUE.JS', icon: VueImg, group: 'frameworks', featured: true },
  { name: 'REDUX', icon: ReactReduxImg, group: 'frameworks', featured: true },
  { name: 'TAILWIND', icon: Tailwind, group: 'frameworks', featured: true },
  { name: 'SCSS', icon: SassImg, group: 'frameworks' },
  { name: 'MATERIAL UI', icon: MaterialUIImg, group: 'frameworks' },
  { name: 'ANT DESIGN', icon: AntDesignImg, group: 'frameworks' },

  { name: 'VITE', icon: ViteImg, group: 'tooling' },
  { name: 'FIREBASE', icon: FirebaseImg, group: 'tooling' },
  { name: 'VITEST', icon: VitestImg, group: 'tooling' },
  { name: 'DOCKER', icon: DockerImg, group: 'tooling' },
  { name: 'WEBPACK', icon: WebPackImg, group: 'tooling' },
  { name: 'GITHUB', icon: GitHub, group: 'tooling' },
];

export const featuredSkills = skills.filter((skill) => skill.featured);

export const skillsByGroup = (group: SkillGroup) => skills.filter((skill) => skill.group === group);
