import Tick from "@/assets/tick";
import Close from "@/assets/close";
import React from "react";
import axios from "axios";
import { BE_URL } from "@/pages/_app";
import { useUserStore } from "@/store/user";
import useStore from "@/store/useStore";
import toast, { Toaster } from "react-hot-toast";

export const Requests = ({data}: {data:any}) => {
  let noOfReq = data?.map((item:any) => 
    item?.reVerifyRequest?.filter((req:any) => req?.status === "pending").length 
    )
  console.log(noOfReq);
  return (
    <div className="pt-3 absolute bottom-0 left-0 flex flex-col w-full max-w-[500px] bg-[#FCFFF7] border border-black rounded-t-[24px]">
      <span className="w-12 mx-auto h-2 bg-black rounded-xl"></span>
      <span className="flex justify-between items-center px-6 py-4">
        <h1 className="text-[30px]  max-[512px]:text-[24px] font-bold">
          Verification Requests
        </h1>
        <p className="text-[18px]  max-[512px]:text-[14px] font-bold">
          {noOfReq}
        </p>
      </span>
      <div>
      {
        data?.map((item:any) => 
          item?.reVerifyRequest?.map((req:any) =>
            req?.status === "pending" &&
            <Req data={req} id={item?.id} key={item?.id} name={item?.type} />
          )
        )
      }
      </div>
    </div>
  );
};

function Req({ data, id, name }: { data: any; id: string, name: string }) {
  
  const token = useStore(useUserStore, (state) => state.token);
  const GetVerificationLink = async ({
    id,
    wallet,
    status,
  }: {
    id: string;
    wallet: string;
    status: string;
  }) => {
    try {
      const response = await axios.post(
        `${BE_URL}reclaim/reverify`,
        {
          id: id,
          requestedWallet: wallet,
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data?.data?.redirectURL;
    } catch (error) {
      console.log(error);
    }
  };
  return (
   <>
   
   <Toaster />
    <span className="flex items-center px-6 pb-2 border-b-2 mt-[20px]">
      <p className="max-[512px]:text-[14px]">
        <strong>
          {data?.username ? `@${data?.username}` : data?.wallet?.slice(0, 4) + "..." + data?.wallet?.slice(-2)}
        </strong>{" "}
        wants to verify your {name} account
      </p>
      <span className="flex ml-auto gap-[30px]  max-[512px]:gap-3 ml-2">
        <button
          onClick={async () => {
            const url = await GetVerificationLink({
              id: id,
              wallet: data?.wallet,
              status: "accept",
            });
            if (url) {
              window?.innerWidth > 768
                ? window.open(
                    window.location + "/user/qr?code=" + url,
                    "_blank"
                  )
                : navigator.userAgent.match(/(iPod|iPhone|iPad)/)
                ? window.open(url, "_top")
                : window.open(url, "_blank");
            }
          }}
        >
          <Tick />
        </button>
        <button
          onClick={async () => {
            await GetVerificationLink({
              id: id,
              wallet: data?.wallet,
              status: "declined",
            })
            toast.success("Declined");
            // remove the id from the list
            delete data.id; 

          }
          }
        >
          <Close />
        </button>
      </span>
    </span>
    </>
  );
}
