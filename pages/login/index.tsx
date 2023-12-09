import React, { useState, useEffect } from "react";

//assets
import Wickycd from "@/assets/logo/wickycd";
import rainbowkit from "./../../assets/svg/rainbowkitsvg.svg";
import Google from "./../../assets/google";

//fonts
import { Inter, Familjen_Grotesk } from "next/font/google";
import { ConnectButton, useConnectModal, Wallet } from "@rainbow-me/rainbowkit";
const inter = Inter({ subsets: ["latin"] });
const grotesk = Familjen_Grotesk({ subsets: ["latin"] });

import { useAccount, useConnect, useSignMessage, useSignTypedData } from "wagmi";

import axios from "axios";
import { useRouter } from "next/router";
import { useUserStore } from "@/store/user";
import { BE_URL } from "@/pages/_app";
import useStore from "@/store/useStore";
import Loader from "@/components/modal/loader";
import { Connector  } from 'wagmi/connectors'
import { disconnect } from "process";


interface indexProps {}

const Login: React.FC<indexProps> = ({}) => {
  const {
    token,
    setToken,
    firtTimeLogin,
    setFirtTimeLogin,
    setUserInfo,
    userInfo,
  } = useUserStore();
  const [loader, setLoader] = useState<boolean>(false);
  const { address } = useAccount();
  const router = useRouter();
  
  

  
  // useEffect(() => {
  //   if (address && token?.length > 0) {
  //     //@ts-ignore
  //     firtTimeLogin && !userInfo?.username?.length > 0 ? router.push("/user/onboard") : router.push(`/`);
  //   }
  // }, [token, router, firtTimeLogin, address, userInfo]);

  const { data, error, isLoading, signMessage } = useSignMessage({
    onSuccess: (data, variables) => {
      createOrLogin({ sign: data, nonce: variables.message });
    },
    onError: (error) => {
      setLoader(false);
    }
  });

  const getNonce = async () => {
    try {
      const response = await axios.get(`${BE_URL}auth/nonce`);
      let message = `Click to Verify\n\nThis is a sign-in security verification for your Webtree account. This request does not trigger any transaction or cost any fees.\n\nClick to sign-in to Webtree.\n\nTechnical Data (ignore if not a power-user)\n\nWallet Address: ${address}\n\nNonce: ${response.data?.data?.nonce}`
      signMessage({ message: message });
      setLoader(true);
      // signer?.signMessage(response.data?.data?.nonce).then((data) => {
      //     createOrLogin({sign: data, nonce: response.data?.data?.nonce})
      // })
    } catch (error) {
      console.log(error);
    }
  };

  const createOrLogin = async ({
    sign,
    nonce,
  }: {
    sign: string;
    nonce: string;
  }) => {
    try {
      const response = await axios.post(`${BE_URL}auth/login`, {
        sign: sign,
        nonce: nonce,
        walletAddress: address,
      });

      setToken(response.data?.data?.token);
      setFirtTimeLogin(response.data?.data?.firstTimeLogin);
      setLoader(false);
      if (!response.data?.data?.firstTimeLogin) {
        setUserInfo(response.data?.data?.data);
      }
      if (
        !response.data?.data?.firstTimeLogin &&
        response.data?.data?.data?.username?.length > 0 &&
        response.data?.data?.data?.firstName?.length > 0 &&
        response.data?.data?.data?.lastName?.length > 0
      ) {
        router.push(`/`);
      } else {
        router.push("/user/onboard");
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  const { openConnectModal } = useConnectModal();

  return (
    <section
      className={`${grotesk.className} flex w-full min-h-screen bg-[#F6FDFF] justify-center`}
    >
      <div className="w-[340px] flex flex-col items-center mt-[135px] max-[512px]:mt-0">
        <span className="max-[512px]:hidden overflow-hidden w-[59.7px] h-[50.4px] flex  justify-center items-center">
          <Wickycd />
        </span>
        <h1
          className={`text-[48px] font-bold mt-[130px] max-[512px]:mt-[55px] max-[512px]:w-[60%] max-[512px]:text-center max-[512px]:leading-[48px]`}
        >
          Login your way
        </h1>
        <p className="text-center text-[#575A5C] mt-3">
          Use either your Google account or your preferred Wallet to Sign into
          Webtree
        </p>


        <span className="flex flex-col gap-y-4 text-[18px] font-semibold mt-[48px] max-[512px]:mt-auto mb-6">
          

          
        
          {!address ? (
            <>
            <button
              onClick={() => {
                openConnectModal && openConnectModal();
              }}
              className="cursor-pointer border-btn py-[22px]  max-w-[340px] w-[95vw] flex items-center justify-center gap-x-2"
            >
              <picture>
                <img src={rainbowkit.src} alt="" />
              </picture>
               Login
            </button>
            </>
          ) : (
            <button
              onClick={() => {
                getNonce();
              }}
              className="cursor-pointer border-btn py-[22px]  w-[340px] flex items-center justify-center gap-x-2"
            >
              <picture>
                <img src={rainbowkit.src} alt="" />
              </picture>
              Please Verify Login
            </button>
          )}
        </span>
      </div>
      {loader && <Loader/>}
    </section>
  );
};

export default Login;
