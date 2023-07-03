import React from "react";
import { HiArrowNarrowRight } from "react-icons/hi";
import IsaImg from "../assets/isa.png";

const Home = () => {
  return (
    <div name="home" className="w-full h-screen bg-[#0a192f]">
      {/* Container */}
      <div className="max-w-[1000px] mx-auto px-8 flex flex-col justify-center h-full">
      <img src={IsaImg} alt="Isa Image" style={{ width: "200px" }} />
        <p className="text-pink-600">Hi, my name is</p>
        <h1 className="text-4xl sm:text-4xl font-bold text-[#ccd6f6]">
          İSA BEZENİROĞLU
        </h1>
        <h2 className="text-4xl sm:text-7xl font-bold text-[#8892b0]">
          I'm a Front-End Developer.
        </h2>
        <p className="text-[#8892b0] py-4 max-w-[700px]">
          At the same time, I'm a Computer Education and
          Instructional Technology (CEIT) Teacher. I enthusiastic about in
          building (and occasionally designing) digital experiences. Currently,
          I’m focused on building responsive web applications.
        </p>
        <div>
          <button className="text-white group border-2 px-6 py-3 my-2 flex items-center hover:bg-pink-600 hover:border-pink-600">
            View Work
            <span className="group-hover:rotate-90 duration-300">
              <HiArrowNarrowRight className="ml-3 " />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
