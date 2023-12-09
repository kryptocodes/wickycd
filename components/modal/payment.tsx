/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @next/next/no-img-element */
import Close from "@/assets/close";
import Image from "next/image";
import React from "react";
import { useAccount, usePrepareSendTransaction, useSendTransaction, useWaitForTransaction } from 'wagmi'
import { parseEther } from 'viem'
import { BE_URL } from "@/pages/_app";
import { useUserStore } from "@/store/user";
import useStore from "@/store/useStore";



interface paymentModalProps {
    state: {
        state: boolean;
        type: boolean;
        payment: boolean;
    }
    setState: React.Dispatch<React.SetStateAction<{
        state: boolean;
        type: boolean;
        payment: boolean;
    }>>;
    username?: string;
    type?: boolean
    payment?: boolean
    address: string
}


const PaymentModal: React.FC<paymentModalProps> = ({ state, setState, username, type, payment, address }) => {
  if (!state?.state) return null;
  console.log(state)
  const token = useStore(useUserStore, (state) => state.token) as string;
  const { isConnected } = useAccount()

  console.log(isConnected)

  const { config, error:errorState, } = usePrepareSendTransaction({
    to: address,
    value: parseEther('0.01')
  })

  const { sendTransaction,error,status,data } = useSendTransaction(config)

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash
  })

  


  const updateStatus = async() => {
    try{
      const res = await fetch(`${BE_URL}user/user/paid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userAddress: address,
        }),
      });
      const data = await res.json();
      console.log(data);
    }
    catch(error){
      console.error(error)
    }
  }
  
  console.log(isSuccess,data)

  if(isSuccess && data?.hash){
    updateStatus()
  }

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
            <h1 className="text-black text-xl font-bold mb-4 mt-2">
              {
                type ? `Huddle with ${username}` : `Chat as ${username} with waku`
              }
            </h1>
            <span 
        onClick={() => setState({ state: false, type: state?.type, payment: state?.payment })}
        className="flex mr-auto">
          <Close />
          </span>
          </div>
            <Image src={
              type ? "/huddle.png" : "/waku.png" }
              alt="huddle"
              width={50}
              height={50}
            />
            {!payment ? 
            <button className="text-white w-full black-btn mb-4 mt-2"
              onClick={() => sendTransaction?.() }
            >
              Pay 0.01 ETH
            </button>
            :
            <button 
            onClick={() => type ? window.open("/video", "_blank") : window.open('/chat', '_blank') }
            className="text-white w-full black-btn">
             { type ? "call" : "Chat" }
            </button> }
          </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentModal;
