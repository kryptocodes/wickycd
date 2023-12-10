import Image from "next/image";
import { Inter, Familjen_Grotesk } from "next/font/google";
import { User } from "../../User";

import Profile from "@/components/profile";

//assets
import Delete from "@/assets/delete";
import Hide from "@/assets/hide";
import mail from "@/assets/svg/platformIcons/mail.svg";

import React from "react";

//component
import LinkBtn, { AddMore, socialIcons } from "@/components/LinkBtn";
import { Requests } from "../../Requests";

import axios from "axios";
import { useUserStore } from "@/store/user";
import { useEffect, useState } from "react";
const BE_URL = process.env.BE_URL;
import toast, { Toaster } from "react-hot-toast";
import { useAccount, useDisconnect } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Modal from "@/components/modal";
import { fetchSpotifyUsername } from "@/lib/spotifyUser";
import { FetchAllLensHandle } from "@/lib/fetchLensHandle";

const inter = Inter({ subsets: ["latin"] });
const grotesk = Familjen_Grotesk({ subsets: ["latin"] });

export default function Main() {
  const { token, wallet, setUserInfo: localStore } = useUserStore();
  const { address } = useAccount();

  const [userInfo, setUserInfo] = useState<any>({
    userData: false,
    proofs: [],
  });
  const [modal, setModal] = useState(false);
  const [lensHandle, setLensHandle] = useState<any>([]);
  const parseProofs = (proofs: any) => {
    switch (proofs?.type) {
      case "google-login":
        const data = proofs?.isVerified
          ? JSON.parse(proofs?.verification?.parameters)
          : false;
        return {
          id: proofs?._id,
          type: "email",
          company: data?.emailAddress?.split("@")[1]?.split(".")[0] || false,
          name: data?.emailAddress?.split("@")[0] || false,
          email: data?.emailAddress || false,
          timestamp: proofs?.updatedAt,
          isVerified: proofs?.isVerified,
          reVerifyRequest: proofs?.reVerifyRequest,
        };
      case "spotify-username":
        const spotify = proofs?.isVerified
          ? JSON.parse(proofs?.verification?.parameters)
          : false;

        return {
          id: proofs?._id,
          type: "spotify",
          company: "spotify",
          name: spotify?.userName || false,
          email: spotify?.userName || false,
          timestamp: proofs?.updatedAt,
          isVerified: proofs?.isVerified,
          reVerifyRequest: proofs?.reVerifyRequest,
        };

      default:
        return null;
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`${BE_URL}user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (
        response?.data?.data?.user?.username?.length === 0 ||
        !response?.data?.data?.user?.username
      ) {
        window.location.href = "/user/onboard";
      }

      let dataCheck: any[] = []; // Initialize as an empty array
      response?.data?.data?.proofs?.forEach((proof: any) => {
        if (proof?.type !== "google-login") {
          if (proof?.isVerified) {
            const parsedProof = parseProofs(proof);
            if (parsedProof) {
              dataCheck.push(parsedProof);
            }
          }
        } else {
          const parsedProof = parseProofs(proof);
          if (parsedProof) {
            dataCheck.push(parsedProof);
          }
        }
      });

      let spotify = await dataCheck?.find((v: any) => v?.type === "spotify" && v?.isVerified);
      if(spotify){
        console.log(spotify)
        const spotifyUsername = await fetchSpotifyUsername(spotify?.email)
        if(spotifyUsername){
          spotify = {
            ...spotify,
            name: spotifyUsername,
          }
          dataCheck = dataCheck?.map((v: any) => v?.type === "spotify" ? spotify : v)
        }
      }

      setUserInfo({
        userData: response?.data?.data?.user,
        proofs: dataCheck,
      });
      localStore({
        ...response?.data?.data?.user,
        pfp: response?.data?.data?.user?.pfp || false,
      });
      const lensData = await FetchAllLensHandle(address as string);
     
      let handles: string[] = [];
      lensData?.data?.profiles?.items?.forEach((item: any) => {
        handles.push(item?.handle?.fullHandle);
      });
      setLensHandle(handles);


    } catch (error:any) {
      console.error(error); // Use console.error to log errors
      if(error?.response?.status === 401){
        window.localStorage.clear();
        window.location.href = "/";
      }
    }
  };

  const GetVerificationLink = async (type: string) => {
    try {
      const response = await axios.post(
        `${BE_URL}reclaim/request`,
        {
          type: type,
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

  useEffect(() => {
    fetchUserInfo();
    return () => {};
  }, [token]);

  useEffect(() => {
    
    const interval = setInterval(() => {
      fetchUserInfo();
    }, 5000);
    return () => clearInterval(interval);

  }, [fetchUserInfo, token]);



  const Links = () => {
    const emailProofs = userInfo?.proofs?.filter((proof: any) => {
      return (
        proof?.type === "email" &&
        typeof proof?.email === "string" &&
        !proof?.email.includes("gmail")
      );
    });
    const emailProofsLength = emailProofs?.length || 0;

    return (
      <>
        {userInfo?.proofs
          ?.filter((v: any) => v?.isVerified)
          ?.map((proof: any) => {
            return (
              <Link
                key={proof?.company || false}
                type={proof?.type || false}
                name={proof?.name || false}
                email={proof?.email || false}
                isVerified={proof?.isVerified || false}
                timestamp={proof?.timestamp || false}
              />
            );
          })}

        {emailProofsLength > 0 ? (
          ""
        ) : (
          <Link
            name={"Verify your work email"}
            isVerified={false}
            timestamp={false}
            type={"email"}
          />
        )}

        {/* <Link /> */}
      </>
    );
  };

  const Link = (data: any) => {
    return (
      <button
        className="flex flex-col db-border items-center justify-center h-[72px]  w-full"
        onClick={async () => {
          const url = data?.isVerified
            ? false
            : await GetVerificationLink("google-login");

          if (url) {
            window?.innerWidth > 768
              ? window.open(window.location + "/user/qr?code=" + url, "_blank")
              : navigator.userAgent.match(/(iPod|iPhone|iPad)/)
              ? window.open(url, "_top")
              : window.open(url, "_blank");
          } else {
            if(data?.type === "spotify"){
              window.open(`https://open.spotify.com/user/${data?.email}`, "_top")
            } else{
            toast.success("You are already verified");
            }
          }
        }}
      >
        <span className="flex gap-2">
        <img
            className="w-6 h-6 object-contain"
            src={socialIcons[data?.type as keyof typeof socialIcons] || socialIcons["web"]} alt="" />
          <h1 className="flex items-center text-[18px] font-semibold">
            {data?.name}
          </h1>
        </span>
        {data?.isVerified ? (
          <p className="text-[#18181880] text-[10px]">
            Verified on {new Date(data?.timestamp).toLocaleDateString()}
          </p>
        ) : (
          ""
        )}
      </button>
    );
  };

  const spotifyProof = userInfo?.proofs?.filter((proof: any) => {
    return proof?.type === "spotify" && proof?.isVerified;
  });

  const spotifyProofCheck = spotifyProof?.length || 0;

  const instagramProof = userInfo?.proofs?.filter((proof: any) => {
    return proof?.type === "instagram" && proof?.isVerified;
  });

  const instagramProofCheck = instagramProof?.length || 0;
  return (
    <>
      <Toaster />

      <div className="flex flex-col min-h-screen ">
        <Nav />
        <section className="flex w-full  justify-center gap-12 max-[512px]:gap-6 max-[1070px]:flex-col max-[1070px]:items-center">
          <div className="flex">
            <Profile
              name={
                userInfo?.userData?.firstName + " " + userInfo?.userData?.lastName ||
                ""
              }
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
              bio={userInfo?.userData?.bio || false}
              tags={userInfo?.userData?.tags || undefined}
              pfp={userInfo?.userData?.pfp || false}
              edit={true}
              lens={lensHandle?.length > 0 ? lensHandle[0] : ""}
              wallet={userInfo?.userData?.wallet || false}
              userPaid={[]}
            />
            <span className="flex left-0 right-0 fixed w-[1048px]  max-[512px]:px-2 max-[1070px]:w-full max-[1070px]:max-w-[500px] mx-auto bottom-0 ">
              {/* {userInfo?.proofs?.length > 0 &&
                userInfo?.proofs?.filter((proof: any) => proof?.isVerified)?.
                map((proof: any) => (
                  <Requests data={proof} key={proof} />
                ))} */}
              <Requests
              data={userInfo?.proofs?.filter((proof: any) => proof?.isVerified && proof?.reVerifyRequest?.length > 0 && proof?.reVerifyRequest?.filter((req: any) => req?.status === "pending"))} key={userInfo?.proofs?.filter((proof: any) => proof?.isVerified)}
              />
            </span>
          </div>

          <div className="flex flex-col w-[500px] max-[512px]:border-t-[1.5px] pt-4 pb-2 border-black  max-[512px]:w-[95vw]">
            <span className="flex w-full justify-between">
              <h1 className="font-medium text-[24px]">My Links   
              </h1>
              
              
              <span className="flex gap-4">
              {userInfo?.proofs && userInfo?.proofs?.length > 0 && (
                   userInfo?.proofs?.filter((proof: any) => proof?.isVerified).length)
                }     
                
                <p
                  onClick={() => {
                    toast.success("Link copied to clipboard");
                    window.navigator.clipboard.writeText(
                      window.location.href + userInfo?.userData?.username ?? ""
                    );
                  }}
                  className="flex gap-1
              cursor-pointer
              "
                >
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
              <Links />
              <AddMore setModal={() => setModal(true)} />
            </span>
          </div>
        </section>

        {/* <LinkBtn platform={ele.name} link={ele.link} key={key} /> */}
        <Modal
          state={modal}
          setState={setModal}
          providers={[spotifyProofCheck + instagramProofCheck]}
          links={
            <>
              {!spotifyProofCheck && (
                <LinkBtn
                  platform={"spotify"}
                  link={async () => {
                    const url = await GetVerificationLink("spotify-username");

                    if (url) {
                      window?.innerWidth > 768
                        ? window.open(
                            window.location + "/user/qr?code=" + url,
                            "_blank"
                          )
                        : navigator.userAgent.match(/(iPod|iPhone|iPad)/)
                        ? window.open(url, "_top")
                        : window.open(url, "_blank");
                    } else {
                      toast.success("You are already verified");
                    }
                  }}
                />
              )}{" "}
              {!instagramProofCheck && (
                <LinkBtn
                  platform={"instagram"}
                  link={async () => {
                    const url = await GetVerificationLink("instagram-user");

                    if (url) {
                      window?.innerWidth > 768
                        ? window.open(
                            window.location + "/user/qr?code=" + url,
                            "_blank"
                          )
                        : navigator.userAgent.match(/(iPod|iPhone|iPad)/)
                        ? window.open(url, "_top")
                        : window.open(url, "_blank");
                    } else {
                      toast.success("You are already verified");
                    }
                  }}
                />
              )}
            </>
          }
        />
      </div>
    </>
  );
}

const Nav = () => {
 const { disconnect } = useDisconnect();

  return (
    <span className="flex mt-[25px] w-[1048px]  max-[512px]:px-2 max-[1070px]:w-full max-[1070px]:max-w-[500px] mx-auto mb-[36px]">
      <span className="flex justify-between w-full items-center">
      <svg
      xmlns="http://www.w3.org/2000/svg"
      width="112"
      height="26"
      fill="none"
      viewBox="0 0 112 26"
    >
      <path
        fill="#000"
        d="M97.967 25.596V0h8.118v3.532h2.519v3.492h2.547v11.508h-2.547v3.532h-2.519v3.532h-8.118zm3.079-4.445h4.507V17.58h2.491V7.976h-2.491V4.484h-4.507v16.667zM83.922 25.596v-3.532h-2.519V3.532h2.52V0h8.116v3.532h2.547v7.937H91.48V4.484h-6.997v16.667h6.997v-7.103h3.107v8.016H92.04v3.532h-8.117zM70.724 25.596V11.469h-2.52V7.976h-2.518V0h3.079v7.024h2.49v3.571h2.016V7.024h2.491V0h3.107v7.976h-2.547v3.493h-2.52v14.127h-3.078zM49.969 25.596V3.532h2.519V0h3.05v4.484h-2.49v6.111h1.959V7.024h2.547V3.532h2.491V0h3.107v4.484h-2.547v3.492h-2.52v3.493H55.54v2.579h2.547v3.532h2.519v3.571h2.547v4.445h-3.107v-3.532h-2.49v-3.532h-2.548V15h-1.96v10.596H49.97zM35.923 25.596v-3.532h-2.519V3.532h2.52V0h8.117v3.532h2.547v7.937H43.48V4.484h-6.998v16.667h6.998v-7.103h3.107v8.016H44.04v3.532h-8.118zM22.443 25.596V21.15h2.52V4.484h-2.52V0h8.117v4.484h-2.547v16.667h2.547v4.445h-8.117zM3.368 25.596v-3.532H.85V0h3.08v21.151h1.959v-7.103h2.547V3.532h3.05v10.516h2.548v7.103h1.959V0h3.05v22.064h-2.49v3.532h-3.08v-3.532h-2.546V15h-1.96v7.064H6.42v3.532H3.37z"
      ></path>
    </svg>
        <button
          className="black-btn text-white h-9 px-4"
          onClick={() => {
            disconnect();
            window.localStorage.clear();
            // wait for one second
            setTimeout(() => {
           
              window.location.href = "/";
            }, 1000);
          }}
        >
          Logout
        </button>
      </span>
    </span>
  );
};
