/* eslint-disable @next/next/no-img-element */
"use client";
 // eslint-disable-next-line @next/next/no-img-element

import Image from "next/image";
import { Inter, Familjen_Grotesk } from "next/font/google";
import { User } from "../components/User"

import axios from "axios";
import { useUserStore } from "@/store/user";
import { use, useEffect, useState } from "react";

import { BE_URL } from "./_app";
import toast, { Toaster } from "react-hot-toast";

import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import useStore from "@/store/useStore";
import Profile from "@/components/profile";
import { fetchSpotifyUsername } from "@/lib/spotifyUser";
import { socialIcons } from "@/components/LinkBtn";
import { FetchAllLensHandle } from "@/lib/fetchLensHandle";


const inter = Inter({ subsets: ["latin"] });
const grotesk = Familjen_Grotesk({ subsets: ["latin"] });




export default function Home() {

    const router = useRouter()
    const token = useStore(useUserStore, (state) => state.token) as string;
  const { address } = useAccount()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  
 const [userInfo, setUserInfo] = useState<any>({
  userData: {
    username: false,
    bio: false,
    wallet: false,
  },
  proofs: {
    email: false,
    isVerified: false,
    timestamp: false,
    type: false,
    name: false,
    company: false
  },
 });
 const [lensHandle, setLensHandle] = useState<any>([]);

 useEffect(() => {
    if(router.isReady){
        fetchUserInfo({username: router.query.username as string})
        }
    }
    , [router.isReady, router.query.username])



  
    const parseProofs = async(proofs: any) => {
     
      switch (proofs?.type) {
        case "google-login":
          const data = proofs?.isVerified
            ? JSON.parse(proofs?.verification?.parameters)
            : false;
          return {
            type: "email",
            id: proofs?._id,
            company: data?.emailAddress?.split("@")[1]?.split(".")[0] || false,
            name: data?.emailAddress?.split("@")[0] || false,
            email:data?.emailAddress?.split("@")[1] || false,
            timestamp: proofs?.updatedAt,
            isVerified: proofs?.isVerified,
          };
        case "spotify-username":
          const spotify = proofs?.isVerified
            ? JSON.parse(proofs?.verification?.parameters)
            : false;
          return {
            type: "spotify",
            id: proofs?._id,
            company: "spotify",
            name: spotify?.userName || false,
            email:  spotify?.userName || false, 
            timestamp: proofs?.updatedAt,
            isVerified: proofs?.isVerified,
          };
        
        default:
          return null; 
      }
    };

  const fetchUserInfo = async(
    {
        username
    }: {
        username: string
    }
  ) => {
    try{
      const response = await axios.get(`${BE_URL}user/fetch/${username}`,{
      })

    
      let dataCheck: any[] = []; // Initialize as an empty array
      await response?.data?.data?.proofs?.forEach(async(proof: any) => {
      
        if (proof?.type !== "google-login") {
          if (proof?.isVerified) {
            const parsedProof = await parseProofs(proof);
            if (parsedProof) {
              dataCheck.push(parsedProof);
            }
          }
        } else {
          const parsedProof = await parseProofs(proof);
          if (parsedProof) {
            dataCheck.push(parsedProof);
          }
        }
      });
      // check if spotify username is verified
      let spotify = await dataCheck?.find((v: any) => v?.type === "spotify" && v?.isVerified);
      if(spotify){
        console.log(spotify)
        const spotifyUsername = await fetchSpotifyUsername(spotify?.email)
        if(spotifyUsername){
          spotify = {
            ...spotify,
            name: spotifyUsername,
            email: spotifyUsername
          }
          dataCheck = dataCheck?.map((v: any) => v?.type === "spotify" ? spotify : v)
        }
      }
      await setUserInfo({
        userData: response?.data?.data?.user,
        proofs: dataCheck,
      })      
      const lensData = await FetchAllLensHandle(address as string);
     
      let handles: string[] = [];
      lensData?.data?.profiles?.items?.forEach((item: any) => {
        handles.push(item?.handle?.fullHandle);
      });
      setLensHandle(handles);
    }
    catch(error){
      setError("User not found");
      console.log(error)
    }
  }
 
 
  const requestReverification = async({wallet,id}: {
    wallet: string,
    id: string
  }) => {
    try{
     
      const response = await axios.post(`${BE_URL}reclaim/rerequest`,{
        wallet,
        id
      },{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
     
      toast.success("Requested for re-verification")
    }
    catch(error:any){
      toast.error("Already requested for re-verification")
      console.log(error)
    }
  }



  const Links = () => {
    
    return (
      <>
          {userInfo && userInfo?.proofs?.length > 0 && userInfo?.proofs
            ?.filter((v: any) => v?.isVerified)
            ?.map((proof: any) => {
              return (
                <Link
                  id={proof.id}
                  key={proof.id}
                  type={proof?.type || false}
                  name={proof?.email || false}
                  isVerified={proof?.isVerified || false}
                  timestamp={proof?.timestamp || false}
                />
              );
            })}


          {/* <Link /> */}
          
       
      </>
    );
  };
  
  const Link = (data:any) => {
    return (
      <>
      <button className="flex flex-col db-border items-center py-[12px]  w-full"
        onClick={() => 
          
          token && token?.length > 0  &&
           address !== userInfo?.userData?.wallet
          ?
          requestReverification({wallet: address as string, id: data?.id})
          : 
            address === userInfo?.userData?.wallet ? 
            alert("You cannot request re-verification for your own account") :
          alert("Please Sign in to request re-verification")
        }
      >
        
        <h1 className="flex items-center text-[18px] font-semibold">
       
        <img
            className="w-6 h-6 object-contain mr-2"
            src={socialIcons[data?.type as keyof typeof socialIcons] || socialIcons["web"]} alt="" />
          {/* <svg
            className="mr-2"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="14"
            fill="none"
            viewBox="0 0 16 14"
          >
            <path
              fill="#000"
              d="M13.829 2.786a3.135 3.135 0 001.376-1.73 6.264 6.264 0 01-1.987.758A3.135 3.135 0 007.884 4.67a8.883 8.883 0 01-6.448-3.27 3.135 3.135 0 00.968 4.178 3.118 3.118 0 01-1.416-.392v.04a3.13 3.13 0 002.51 3.067c-.46.125-.944.144-1.413.054a3.135 3.135 0 002.923 2.173 6.277 6.277 0 01-3.886 1.339c-.25 0-.5-.014-.747-.043a8.856 8.856 0 004.796 1.406 8.842 8.842 0 008.902-8.903c0-.136-.003-.27-.01-.405a6.356 6.356 0 001.563-1.62c-.571.253-1.177.42-1.797.493z"
            ></path>
          </svg> */}
          {data?.name}
        </h1>
        {data?.isVerified ? 
        <p className="text-[#18181880] text-[10px]">Verified on {new Date(data?.timestamp).toLocaleString()}</p> : "" }
      </button>
      </>
    );
  };
  return (
    <>
  <Toaster />
      

      <div className="flex flex-col w-full md:w-3/4 mx-auto min-h-screen gap-4">
            <Nav />

            {
              error.length > 0 ?
              <h1 className="text-center text-[18px] font-semibold text-red-500 mt-44">{error}</h1> : 
            <section className="flex lg:flex-row flex-col mt-[36px] gap-12 p-4 md:p-0">
              <div className="flex flex-col w-full">
                <Profile
                  name={userInfo?.userData?.firstName + " " + userInfo?.userData?.lastName || ""}
                  company={
                    (userInfo?.proofs?.length > 0 &&
                      userInfo?.proofs?.find(
                        (proof: any) =>
                          proof?.type === "email" &&
                          typeof proof?.email === "string" &&
                          !proof?.email.includes("gmail")
                      )?.company) ||
                    "Not yet verified"
                  }
                  username={userInfo?.userData?.username || ""}
                  bio={
                    userInfo?.userData?.bio?.length > 0 ? userInfo?.userData?.bio : " " 
                  }
                  tags={userInfo?.userData?.tags?.length > 0 ? userInfo?.userData?.tags : undefined}
                  pfp={userInfo?.userData?.pfp || "/user.png"}
                  edit={false}
                  lens={lensHandle?.length > 0 ? lensHandle[0] : ""}
                  wallet={userInfo?.userData?.wallet || ""}
                />
                  
                {/* <Requests /> */}
              </div>
      
              <div className="flex flex-col w-full">
                <span className="flex w-full justify-between">
                  <h1 className="font-medium text-[24px]">My Links</h1>
                  <span
                  className="flex gap-4">
                    {userInfo?.proofs && userInfo?.proofs?.length > 0 && (
                   userInfo?.proofs?.filter((proof: any) => proof?.isVerified).length)
                }     
                    <p
                    
                     onClick={() => {
                      toast.success("Link copied to clipboard")
                      window.navigator.clipboard.writeText(window.location.href)
                    }}
                    className="flex gap-1
                    cursor-pointer
                    ">
                    <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="25"
                fill="none"
                viewBox="0 0 24 25"
              >
                <path
                  stroke="#000"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8.59 14.01l6.83 3.98m-.01-10.98l-6.82 3.98M21 5.5a3 3 0 11-6 0 3 3 0 016 0zm-12 7a3 3 0 11-6 0 3 3 0 016 0zm12 7a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
                      Share
                    </p>
                    {/* <p className="flex gap-1">
                      <Hide />
                      Hide
                    </p> */}
                  </span>
                </span>
                <span className="flex flex-col mt-6 gap-3">
                {userInfo?.proofs && (
                   userInfo?.proofs?.length === 0 ?
                  <h1
                  className="text-md text-black font-bold
                text-center mt-12
                "
                >
                 {'None Added Yet :('}
                </h1> : "")
                }     

                  <Links />
                 
                </span>
              </div>
             
            </section> }
            {
          !token &&
         
         <button className="flex items-center justify-center text-white rounded-full px-12 py-4 
          absolute bottom-0 left-0 right-0 mx-auto mb-2 w-[fit-content]
          bg-black
         "
        onClick={() =>{
          window.localStorage.clear();
          window.location.href = "/"
        } }
        >
          Create your own Webtree
        </button> }
                  </div>
    </>
  );
}

const Nav = () => {
  return (
    <span className="flex w-full md:p-14 p-2 md:-mt-12">
      <span className="flex justify-between w-full items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="126"
          height="31"
          fill="none"
          viewBox="0 0 126 31"
          className="mt-[25px]"
        >
          <path
            fill="#181818"
            d="M18.677 1.11a.387.387 0 01.736 0l1.96 5.914a9.688 9.688 0 006.148 6.148l5.914 1.96a.387.387 0 010 .736l-5.914 1.96a9.688 9.688 0 00-6.149 6.148l-1.96 5.914a.387.387 0 01-.735 0l-1.96-5.914a9.688 9.688 0 00-6.148-6.148l-5.914-1.96a.387.387 0 010-.736l5.914-1.96a9.688 9.688 0 006.148-6.148l1.96-5.914z"
          ></path>
          <path
            fill="#181818"
            d="M37.451 15.984c0 4.548-8.24 8.235-18.406 8.235-10.166 0-18.406-3.687-18.406-8.235 0-4.547 8.24-8.234 18.406-8.234 10.165 0 18.406 3.687 18.406 8.234zm-33.585 0c0 3.75 6.796 6.791 15.179 6.791s15.179-3.04 15.179-6.79c0-3.751-6.796-6.791-15.18-6.791-8.382 0-15.178 3.04-15.178 6.79zM44.594 1.49h2.882l1.67 18.633.131 6.632h.23l.294-6.631 1.67-18.635h4.258l1.769 18.634.196 6.632h.23l.196-6.631 1.605-18.635h2.882l-2.882 28.022h-4.061L53.6 4.105 51.57 29.51h-4.094L44.594 1.489zM72.78 27.316v2.195h-5.928c-2.194 0-3.668-.911-3.668-2.499V7.607c0-1.564 1.54-2.615 3.766-2.615h2.751c1.573 0 2.85.7 2.85 2.242v14.991L68.162 24.7l-1.768.21v2.242c0 .63.59.981 1.44.888l4.455-.981c.295-.047.491.047.491.257zm-3.275-5.208V8.004c0-.98-.491-1.448-1.572-1.448-1.048 0-1.54.468-1.54 1.448V23.37l1.343-.093 1.769-1.168zM74.189 29.51V1.49h3.21v6h.229c.49-1.377 1.473-2.732 3.439-2.732 1.473 0 2.685.724 2.685 2.733v18.704l-3.635 3.316h-5.928zm3.21-19.334v17.653h2.128l1.016-.887V8.845c0-1.354-.688-1.821-1.376-1.821-1.277 0-1.638 1.704-1.769 3.152zM86.535 1.49h3.373c.197 0 .295.093.23.233l-1.343 3.035c-.066.14 0 .234.196.234h3.505v1.705h-2.752v20.362c0 .56.426.817.95.817.164 0 .295-.023.426-.047l1.9-.84c.261-.094.425 0 .425.21v2.312h-3.242c-2.195 0-3.668-1.051-3.668-2.616V6.697h-1.867V4.992h1.867V1.489zM94.626 4.992h3.21V7.49h.197c.49-1.378 1.506-2.733 3.471-2.733 1.441 0 2.653.818 2.653 2.943v2.078l-2.948 2.592c-.163.117-.262.07-.262-.094V8.845c0-1.354-.687-1.821-1.375-1.821-1.376 0-1.638 1.844-1.736 3.152V29.51h-3.21V4.99zM114.455 27.316v2.195h-5.928c-2.194 0-3.668-.911-3.668-2.499V7.607c0-1.564 1.539-2.615 3.766-2.615h2.751c1.572 0 2.85.7 2.85 2.242v14.991l-4.389 2.475-1.769.21v2.242c0 .63.59.981 1.442.888l4.454-.981c.294-.047.491.047.491.257zm-3.275-5.208V8.004c0-.98-.491-1.448-1.572-1.448-1.048 0-1.54.468-1.54 1.448V23.37l1.343-.093 1.769-1.168zM125.361 27.316v2.195h-5.928c-2.194 0-3.668-.911-3.668-2.499V7.607c0-1.564 1.54-2.615 3.767-2.615h2.751c1.572 0 2.849.7 2.849 2.242v14.991l-4.388 2.475-1.769.21v2.242c0 .63.589.981 1.441.888l4.454-.981c.295-.047.491.047.491.257zm-3.275-5.208V8.004c0-.98-.491-1.448-1.572-1.448-1.048 0-1.539.468-1.539 1.448V23.37l1.343-.093 1.768-1.168z"
          ></path>
        </svg>
      
      </span>
    </span>
  );
};