/* eslint-disable @next/next/no-img-element */
import Close from "@/assets/close";
import Image from "next/image";
import React from "react";

interface paymentModalProps {
    state: boolean;
    setState: (state: boolean) => void;
    username?: string;
}


const PaymentModal: React.FC<paymentModalProps> = ({ state, setState, username }) => {
  if (!state) return null;
  return (
    <>
      <div
        id="default-modal"
        aria-hidden="true"
        className="fixed inset-0 z-50 flex w-full h-full bg-[#ffffff1f] overflow-x-hidden overflow-y-auto outline-none focus:outline-none backdrop-blur"
      >
        <div className="flex flex-col items-center justify-center w-full h-full">

        <div className="border-0 rounded-lg relative flex flex-col w-full  outline-none focus:outline-none">
     
          <div className="flex flex-col items-center justify-center border border-1
            border-black rounded-lg
          
          bg-[#FFFFFF] w-3/2 mx-auto p-4">
            <div className="flex flex-row justify-between w-full">
            <h1 className="text-black text-2xl font-bold">
              Huddle with {username}
            </h1>
            <span 
        onClick={() => setState(false)}
        className="flex mr-4">
          <Close />
          </span>
          </div>
            <Image src={"/huddle.png"}
              alt="huddle"
              width={150}
              height={150}
            />
            <button className="text-white w-full black-btn">
             Call Now
            </button>
          </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentModal;
