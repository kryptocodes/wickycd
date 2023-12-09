import React from "react";

import twitter from "./../../assets/svg/platformIcons/twitter.svg";
import mail from "./../../assets/svg/platformIcons/mail.svg";
import web from "./../../assets/svg/platformIcons/web.svg";
import phone from "./../../assets/svg/platformIcons/phone.svg";
import wallet from "./../../assets/svg/platformIcons/wallet.svg";
import discord from "./../../assets/svg/platformIcons/discord.svg";
import github from "./../../assets/svg/platformIcons/github.svg";
import linkedin from "./../../assets/svg/platformIcons/linkedin.svg";
import youtube from "./../../assets/svg/platformIcons/youtube.svg";
import instagram from "./../../assets/svg/platformIcons/instagram.svg";
import spotify from "./../../assets/svg/platformIcons/spotify.svg";

type platformType =
  | "twitter"
  | "mail"
  | "web"
  | "phone"
  | "wallet"
  | "discord"
  | "github"
  | "linkedin"
  | "youtube"
  | "instagram"
  | "spotify";

export const socialIcons = {
  twitter: twitter.src,
  mail: mail.src,
  web: web.src,
  phone: phone.src,
  wallet: wallet.src,
  discord: discord.src,
  github: github.src,
  linkedin: linkedin.src,
  youtube: youtube.src,
  instagram: instagram.src,
  spotify: spotify.src,
  email: mail.src,
};

function LinkBtn({
  platform,
  link,
  color = "#D6E0EA",
}: {
  platform: platformType;
  link: () => void;
  color?: string;
}) {
  return (
    <div
      style={{ background: color }}
      className="border-btn h-[72px] w-full flex flex-col justify-center items-center mt-2 "
      onClick={link}
    >
      <span className="flex gap-3 items-center">
        <picture>
          <img
            className="w-6 h-6 object-contain"
            src={socialIcons[platform]}
            alt=""
          />
        </picture>
        <h3 className="text-[18px] font-semibold">{platform?.charAt(0)?.toLocaleUpperCase() + platform?.slice(1)}</h3>
      </span>

      {/* <p className="text-[10px] mt-1 text-[#18181880]">Verified on 12.09.23</p> */}
    </div>
  );
}

export const AddMore = ({
  setModal,
}: {
  setModal: (modal: boolean) => void;
}) => {
  return (
    <div
      style={{ background: "#E4EAD6" }}
      className="border-btn h-[72px] w-full flex flex-col justify-center items-center "
      onClick={() => setModal(true)}
    >
      <span className="flex gap-3 items-center">
        <picture>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="#000"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v8m-4-4h8m6 0c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z"
            ></path>
          </svg>
        </picture>
        <h3 className="text-[18px] font-semibold">Add More</h3>
      </span>
    </div>
  );
};

export default LinkBtn;
