import React from "react";

import Image from "next/image";

import logobg from "../../../assets/svg/logobg.svg";
import WebtreeLogo from "../../../assets/logo/webtree";

import { Inter, Familjen_Grotesk } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const grotesk = Familjen_Grotesk({ subsets: ["latin"] });

const Intro = ({}) => {
  return (
    <section>
      <span className="flex overflow-hidden justify-center items-center w-full h-screen">
        <picture className="absolute left-0 top-0 w-full">
          <img
            className="
          object-cover
          w-full  h-screen      
          "
            src={logobg.src}
            alt=""
          />
        </picture>
        <div
          className={`${grotesk.className} h-full  flex w-96 text-center flex-col items-center z-10`}
        >
          <h1
            className={`text-[64px] max-[512px]:text-[48px] font-bold mt-[8vh] leading-[64px]`}
          >
            Welcome to Webtree
          </h1>
          <p className="text-[24px] mt-3 max-[512px]:text-[18px]">
            Your Verified Linktree
          </p>
          <WebtreeLogo className="w-[200px]" />
          <button
            onClick={() => {
              window.location.href = "/login";
            }}
            className="text-[20px] black-btn text-white py-[23px] w-[90%] max-w-[340px] mt-auto"
          >
            Get Started
          </button>
          <p className="text-[#A5BCB0] py-4">
            Built by OWNOS. Remember the Name.
          </p>
        </div>
      </span>
    </section>
  );
};


export default Intro;