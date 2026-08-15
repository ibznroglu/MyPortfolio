import HTML from '../assets/html.webp';
import CSS from '../assets/css.webp';
import JavaScript from '../assets/javascript.webp';
import ReactImg from '../assets/react.webp';
import GitHub from '../assets/github.webp';
import Tailwind from '../assets/tailwind.webp';
import ReactReduxImg from '../assets/redux.webp';
import JiraImg from '../assets/jira.webp';
import DockerImg from '../assets/docker.webp';
import WebPackImg from '../assets/webpack.webp';
import SassImg from '../assets/sass.webp';
import TypeScriptImg from '../assets/typescript.webp';
import ReactNativeImg from '../assets/reactnative.webp';
import MaterialUIImg from '../assets/materialui.webp';
import AntDesignImg from '../assets/antdesign.webp';
import NextJsImg from '../assets/nextjs.webp';
import VueImg from '../assets/vue.webp';

export interface Skill {
  name: string;
  icon: string;
  /** Shown in the home page strip. The Skills page shows everything. */
  featured?: boolean;
}

export const skills: Skill[] = [
  { name: 'REACT', icon: ReactImg, featured: true },
  { name: 'REACT NATIVE', icon: ReactNativeImg, featured: true },
  { name: 'TYPESCRIPT', icon: TypeScriptImg, featured: true },
  { name: 'JAVASCRIPT', icon: JavaScript, featured: true },
  { name: 'NEXT.JS', icon: NextJsImg, featured: true },
  { name: 'VUE.JS', icon: VueImg, featured: true },
  { name: 'REDUX', icon: ReactReduxImg, featured: true },
  { name: 'TAILWIND', icon: Tailwind, featured: true },
  { name: 'HTML', icon: HTML },
  { name: 'CSS', icon: CSS },
  { name: 'SCSS', icon: SassImg },
  { name: 'MATERIAL UI', icon: MaterialUIImg },
  { name: 'ANT DESIGN', icon: AntDesignImg },
  { name: 'GITHUB', icon: GitHub },
  { name: 'JIRA', icon: JiraImg },
  { name: 'DOCKER', icon: DockerImg },
  { name: 'WEBPACK', icon: WebPackImg },
];

export const featuredSkills = skills.filter((skill) => skill.featured);
