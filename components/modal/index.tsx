import React from "react";
import LinkBtn from "../LinkBtn";

interface indexProps {
  state: boolean;
  setState: (state: boolean) => void;
  providers: any[];
  links: any;
}

const Modal: React.FC<indexProps> = ({ state, setState, providers, links }) => {
  if (!state) return null;
  return (
    <>
      <div
        id="default-modal"
        aria-hidden="true"
        className="fixed inset-0 z-50 flex w-full  bg-[#00000080] overflow-x-hidden overflow-y-auto outline-none focus:outline-none 
        backdrop-blur
        "
      >
        <div
          className="w-[95%] max-w-[500px] 
        mx-auto my-auto h-[90%]
           px-8 max-[512px]:px-4 py-2 rounded-[25px] border-black border-[2px]
        items-center justify-center
        bg-white 
    "
        >
          <span className="flex w-full justify-between py-8">
            <h1 className="text-[24px] font-medium max-[512px]:text-[18px]">
              Available Providers 
            </h1>

            <p
              onClick={() => setState(false)}
              className="flex items-center justify-center gap-2
              cursor-pointer
              "
            >
              <BackBtn />
              Back
            </p>
          </span>
          {links}
          {providers?.length > 0 && (
            <h1
              className="text-md  font-bold
            text-center mt-12
            text-black
            "
            >
              
             More Data Providers Coming Soon
            </h1>
          )}
          {providers?.length === 0 && (
            <h1
              className="text-md text-black font-bold
            text-center mt-12
            "
            >
              More Data Providers Coming Soon
            </h1>
          )}
        </div>
      </div>
    </>
  );
};

const BackBtn = () => {
  return (
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
        d="M12 8l-4 4m0 0l4 4m-4-4h8m6 0c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z"
      ></path>
    </svg>
  );
};

export default Modal;
