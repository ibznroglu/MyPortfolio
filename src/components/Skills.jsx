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

const Skills = () => {
  const { t } = useLanguage();

  const skills = [
    { name: "REACT", icon: ReactImg, type: "image" },
    { name: "REACT NATIVE", icon: null, type: "text", bg: "#61dafb", text: "RN", textColor: "#0a192f" },
    { name: "TYPESCRIPT", icon: null, type: "text", bg: "#3178c6", text: "TS", textColor: "white" },
    { name: "JAVASCRIPT", icon: JavaScript, type: "image" },
    { name: "REDUX", icon: ReactReduxImg, type: "image" },
    { name: "HTML", icon: HTML, type: "image" },
    { name: "CSS", icon: CSS, type: "image" },
    { name: "SCSS", icon: SassImg, type: "image" },
    { name: "TAILWIND", icon: Tailwind, type: "image" },
    { name: "MATERIAL UI", icon: null, type: "text", bg: "#007fff", text: "MUI", textColor: "white" },
    { name: "ANT DESIGN", icon: null, type: "text", bg: "#0170fe", text: "ANT", textColor: "white" },
    { name: "GITHUB", icon: GitHub, type: "image" },
    { name: "JIRA", icon: JiraImg, type: "image" },
    { name: "DOCKER", icon: DockerImg, type: "image" },
    { name: "WEBPACK", icon: WebPackImg, type: "image" },
  ];

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-gradient-to-b from-[#112240] to-[#0a192f] text-gray-300 py-16">
      <div className="max-w-6xl mx-auto px-8">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold inline border-b-4 border-pink-600 pb-2">
            {t.skills.title}
          </h2>
          <p className="py-4 text-gray-400">{t.skills.subtitle}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="bg-[#112240] p-6 rounded-xl border border-pink-600/20 hover:border-pink-600 hover:shadow-xl hover:shadow-pink-600/30 transition-all duration-300 transform hover:scale-105 text-center group"
            >
              {skill.type === "image" ? (
                <img className="w-16 h-16 mx-auto mb-3 group-hover:scale-110 transition-transform" src={skill.icon} alt={skill.name} />
              ) : (
                <div
                  className="w-16 h-16 mx-auto mb-3 flex items-center justify-center rounded-lg"
                  style={{ backgroundColor: skill.bg }}
                >
                  <span className="font-bold text-xs" style={{ color: skill.textColor }}>
                    {skill.text}
                  </span>
                </div>
              )}
              <p className="text-sm font-semibold">{skill.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;
