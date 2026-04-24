import React from "react";
import { useLanguage } from "../context/LanguageContext";
import HTML from "../assets/html.png";
import CSS from "../assets/css.png";
import JavaScript from "../assets/javascript.png";
import ReactImg from "../assets/react.png";
import GitHub from "../assets/github.png";
import Tailwind from "../assets/tailwind.png";
import ReactReduxImg from "../assets/redux.png";
import JiraImg from "../assets/jira.png";
import DockerImg from "../assets/docker.png";
import WebPackImg from "../assets/webpack.png";
import SassImg from "../assets/sass.png";
import TypeScriptImg from "../assets/typescript.png";
import ReactNativeImg from "../assets/reactnative.png";
import MaterialUIImg from "../assets/materialui.png";
import AntDesignImg from "../assets/antdesign.png";
import NextJsImg from "../assets/nextjs.png";
import VueImg from "../assets/vue.png";

const Skills = () => {
  const { t } = useLanguage();

  const skills = [
    { name: "REACT", icon: ReactImg },
    { name: "REACT NATIVE", icon: ReactNativeImg },
    { name: "TYPESCRIPT", icon: TypeScriptImg },
    { name: "JAVASCRIPT", icon: JavaScript },
    { name: "NEXT.JS", icon: NextJsImg },
    { name: "VUE.JS", icon: VueImg },
    { name: "REDUX", icon: ReactReduxImg },
    { name: "HTML", icon: HTML },
    { name: "CSS", icon: CSS },
    { name: "SCSS", icon: SassImg },
    { name: "TAILWIND", icon: Tailwind },
    { name: "MATERIAL UI", icon: MaterialUIImg },
    { name: "ANT DESIGN", icon: AntDesignImg },
    { name: "GITHUB", icon: GitHub },
    { name: "JIRA", icon: JiraImg },
    { name: "DOCKER", icon: DockerImg },
    { name: "WEBPACK", icon: WebPackImg },
  ];

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-gradient-to-b from-[#112240] to-[#0a192f] text-gray-300 py-16">
      <div className="max-w-6xl mx-auto px-8">
        <div className="text-center mb-12">
          <div className="inline-block border-b-4 border-pink-600 pb-2">
            <h2 className="text-5xl font-bold">
              {t.skills.title}
            </h2>
          </div>
          <p className="py-4 text-gray-400">{t.skills.subtitle}</p>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="bg-[#112240] p-4 rounded-xl border border-pink-600/20 hover:border-pink-600 hover:shadow-xl hover:shadow-pink-600/30 transition-all duration-300 transform hover:scale-105 text-center group flex flex-col items-center justify-between"
            >
              <img
                className="w-11 h-11 mx-auto mb-3 group-hover:scale-110 transition-transform"
                src={skill.icon}
                alt={skill.name}
              />
              <p className="text-sm font-semibold leading-tight">{skill.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;