import EditIcon from "@/assets/edit";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import PFPModal from "../modal/pfpModal";
import useStore from "@/store/useStore";
import { useUserStore } from "@/store/user";
import { useAccount } from "wagmi";
import { providers } from "ethers";
import VideoIcon from "@/assets/svg/videoIcon";
import ChatIcon from "@/assets/svg/chatIcon";
import PaymentModal from "../modal/payment";
import { ConnectButton, useConnectModal, Wallet } from "@rainbow-me/rainbowkit";


import { useGetWalletENS, useGetWalletENSAndSocial } from "@airstack/airstack-react";



interface profileType {
  name: string;
  username: string;
  bio: string;
  company: string;
  tags: string[];
  pfp: string | boolean;
  edit: boolean;
  lens: string;
  wallet: string;
  userPaid?: string[];
}

function Profile({
  name,
  username,
  bio,
  company,
  tags,
  pfp = false,
  edit = false,
  lens,
  wallet,
  userPaid,
}: profileType) {
  const router = useRouter();
  const [modal, setModal] = React.useState(false);
  const token = useStore(useUserStore, (state) => state.token);
  const [Ens, setEns] = React.useState("");
  const [paymentModal, setPaymentModal] = React.useState({
    state: false,
    type: false,
    payment: false,
  });
  const { isConnected, address } = useAccount();
  const {data} = useGetWalletENS({
    identity: wallet,
    blockchain: "ethereum"
  });

  console.log("ens", data)

  
  const ens = async () => {
    const provider = new providers.JsonRpcProvider("https://eth.llamarpc.com");
    const ens = await provider.lookupAddress(wallet);
    // setEns(ens || "");
    setEns(data?.primaryDomain?.name || ens || "")
    // return ens;
    return ens;
    
  };
  useEffect(() => {
    if (wallet) {
      ens().then((ens) => {
        console.log(ens);
      });
    }
  }, [wallet]);

  const [isClient, setIsClient] = React.useState(false);

  console.log(userPaid, "userPaid");
  useEffect(() => {
    setIsClient(true);
    updateUserPaidStatus()
  }, []);

  const updateUserPaidStatus = async() => {
    if(userPaid && userPaid?.length > 0){
       // find the address in the array
        const index = userPaid.indexOf(address as string);
        if(index > -1){
          setPaymentModal({
            state: paymentModal.state,
            type: paymentModal.type,
            payment: true,
          })
        }
  }
}
  
  return (
    <>
      <div className="flex w-full h-max">
        <div className="relative flex flex-col rounded-[23.5px] p-[14.7px] w-[500px]  max-[512px]:w-[95vw] bg-[#D6E0EA]">
          {/* Profile Img */}
          <picture className="absolute right-[14.7px] top-[14.7px]">
            <img
              className="h-[79.4px] w-[79.4px]  max-[512px]:h-[54px]  max-[512px]:w-[54px] rounded-md border-[1.5px] border-black"
              src={pfp ? (pfp as string) : "/user.png"}
              alt=""
            />
            {token && token?.length > 0 && edit ? (
              <button
                onClick={() => {
                  setModal(true);
                }}
                className="max-[512px]:w-[14px] max-[512px]:h-[14px] w-[24px]  h-[24px] bg-[#d6e0ea93] p-[4px] rounded-[50%] cursor-pointer absolute right-0 bottom-0"
              >
                <EditIcon />
              </button>
            ) : (
              ""
            )}
          </picture>

          {/* Name */}
          <h1 className="text-[28px] max-[512px]:text-[20px] font-semibold leading-7">
            {name}
          </h1>
          {/* username */}
          <p className="mt-4 flex justify-center items-center w-min text-[20px]  max-[512px]:text-[14px] px-3 py-[6px] font-semibold rounded-[235px] text-[#6E0BAB] bg-[#FFFFFF80]">
            @{username}
            {lens.length > 0 ? (
              <span className="flex items-center gap-2 ml-2">
                |<span className="max-[512px]:text-[12px]">@{lens}</span>
              </span>
            ) : (
              ""
            )}
            {Ens.length > 0 ? (
              <span className="flex items-center gap-2 ml-2">
                |<span className="max-[512px]:text-[12px]">@{Ens}</span>
              </span>
            ) : (
              ""
            )}
          </p>
          {/* bio */}
          <span className="flex gap-2 mt-[20px]  max-[512px]:mt-[18px]">
            {bio ? (
              <>
                <p>{bio}</p>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    router.push("/user/onboard");
                  }}
                  className="bg-white p-[6px] max-[512px]:text-[12px] max-[512px]:py-2 min-w-max rounded-[24px] text-[#575A5C] px-3"
                >
                  + Add Bio
                </button>
                <Placeholder />
              </>
            )}
          </span>
          <span className="flex items-center gap-2 mt-[18.8px]  max-[512px]:mt-[13px]">
            <h3 className="text-[#575A5C] text-[24px]  max-[512px]:text-[16px] font-semibold">
              Works
            </h3>
            <h2 className="font-semibold text-[24px]  max-[512px]:text-[16px]">
              {company ? `@ ${company}` : "@Add your company"}
            </h2>
          </span>
          {tags?.length > 0 ? (
            <span className="flex  flex-wrap gap-1 mt-3">
              {tags.map((ele, key) => {
                return <Tag title={ele} key={key + "tag"} />;
              })}
            </span>
          ) : tags !== undefined ? (
            <button
              onClick={() => {
                router.push("/user/onboard");
              }}
              className="mt-[12px] bg-white p-[6px] rounded-[24px] w-fit text-[#575A5C] px-3 border border-[#A5BCB0]"
            >
              + Add Tags
            </button>
          ) : (
            ""
          )}

          {isClient && (isConnected && address && address !== wallet) ? (
            <div className="flex flex-row">
              <button
                className="blue-btn text-white h-12 px-4 flex flex-row gap-4 p-2"
                onClick={() =>
                  isConnected
                    ? setPaymentModal({
                        state: !paymentModal.state,
                        type: true,
                        payment: paymentModal?.payment,
                      })
                    : router.push("/")
                }
              >
                <VideoIcon className="w-5 h-5" />
                Huddle
              </button>
              <button
                className="black-btn text-white h-12 px-4 flex flex-row gap-4 p-2"
                onClick={() =>
                  isConnected
                    ? setPaymentModal({
                        state: !paymentModal.state,
                        type: false,
                        payment: true,
                      })
                    : router.push("/")
                }
              >
                <ChatIcon className="w-5 h-5" />
                Chat
              </button>
            </div>
          ) : null}
        </div>

        <PFPModal state={modal} setState={setModal} />
        <PaymentModal
          state={paymentModal}
          setState={setPaymentModal}
          username={username}
          address={wallet}
          type={paymentModal?.type}
          payment={paymentModal?.payment}
        />
      </div>
    </>
  );
}

const Tag = ({ title }: { title: string }) => {
  return (
    <span className="text-[18px]  max-[512px]:text-[14px] w-fit text-[#575A5C] font-medium bg-white p-[11.5px] px-[14px] rounded-[23.4px] border-[#A5BCB0] border-[1.5px]  max-[512px]:p-2">
      {title}
    </span>
  );
};

const Placeholder = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="352"
      height="39"
      fill="none"
      viewBox="0 0 352 39"
    >
      <rect
        width="351.471"
        height="5.882"
        x="0.471"
        y="0.143"
        fill="#39779D"
        fillOpacity="0.2"
        rx="2.941"
      ></rect>
      <rect
        width="322.059"
        height="5.882"
        x="0.471"
        y="11.067"
        fill="#39779D"
        fillOpacity="0.2"
        rx="2.941"
      ></rect>
      <rect
        width="342.647"
        height="5.882"
        x="0.471"
        y="21.992"
        fill="#39779D"
        fillOpacity="0.2"
        rx="2.941"
      ></rect>
      <rect
        width="282.353"
        height="5.882"
        x="0.471"
        y="32.916"
        fill="#39779D"
        fillOpacity="0.2"
        rx="2.941"
      ></rect>
    </svg>
  );
};

export default Profile;
