import React, { useEffect, useState } from "react";

import Image from "next/image";
import { Inter, Familjen_Grotesk } from "next/font/google";
import { useUserStore } from "@/store/user";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

import { useRouter } from "next/router";
import useStore from "@/store/useStore";
import { useAccount } from "wagmi";

const inter = Inter({ subsets: ["latin"] });
const grotesk = Familjen_Grotesk({ subsets: ["latin"] });
interface indexProps {}

const BE_URL = process.env.BE_URL;
const steps = {
  SET_NAME: "set_name",
  SET_USERNAME: "set_username",
  SET_BIO: "set_bio",
};
const UserOnBoard: React.FC<indexProps> = ({}) => {
  const router = useRouter();
  const { address } = useAccount();
  const { setUserInfo } = useUserStore();
  const userInfo = useStore(useUserStore, (state) => state.userInfo) as any;

  const nameExists =
    userInfo?.firstName?.length > 0 && userInfo?.lastName.length > 0;
  const usernameExists = userInfo?.username?.length > 0;
  const [currentstep, setstep] = useState(steps.SET_BIO);
  const token = useStore(useUserStore, (state) => state.token) as string;

  const [bio, setBio] = useState<any>({
    bio: userInfo?.bio || "",
    tags: userInfo?.tags || [],
    newTag: "",
  });

  let update = false;

  useEffect(() => {
    if(!update){
    setBio({
      bio: userInfo?.bio || "",
      tags: userInfo?.tags || [],
      newTag: "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    update = true;
  }
  }, [userInfo]);
  

 

  useEffect(() => {
    if (token?.length < 1) {
      router.push("/");
    }
    if (!nameExists) {
      setstep(steps.SET_NAME);
    } else if (!usernameExists && nameExists) {
      setstep(steps.SET_USERNAME);
    } else if (usernameExists && nameExists) {
      setstep(steps.SET_BIO);
    }
  }, [nameExists, router, token?.length, usernameExists]);

  const updateUserBio = async () => {
    console.log("updating user bio",bio);
    try {
      const res = await axios.post(
        `${BE_URL}user/updateBio`,
        {
          bio: bio.bio || "",
          tags: bio.tags || [],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        toast.success("user info updated");
        router.push("/");
      }
      
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Toaster position="top-right" />
      <section
        className={`flex w-full h-screen justify-center items-center ${grotesk.className} leading-[48px]`}
      >
        {currentstep == steps.SET_NAME && <NamePick setstep={setstep} />}
        {currentstep == steps.SET_USERNAME && (
          <UsernamePick setstep={setstep} />
        )}
        {currentstep == steps.SET_BIO && (
          <BioPick updateUserInfo={updateUserBio} bio={bio} setBio={setBio} />
        )}
      </section>
    </>
  );
};

const UsernamePick = ({
  setstep,
}: {
  setstep: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const router = useRouter();
  const { setUserInfo } = useUserStore();
  const [userState, setUserState] = useState<any>("");

  const token = useStore(useUserStore, (state) => state.token) as string;

  const [usernameAvailable, setUsernameAvailable] = useState<boolean>(false);
  const updateUserInfo = async ({
    firstName,
    lastName,
    username,
  }: {
    firstName: string;
    lastName: string;
    username: string;
  }) => {
    try {
      console.log("updating user info");
      console.log(firstName, lastName, username);
      const res = await axios.post(
        `${BE_URL}user/update`,
        {
          firstName: firstName,
          lastName: lastName,
          username: username,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        setstep(steps.SET_BIO);
      }
    } catch (error) {
      toast.error("something went wrong");
      console.log(error);
    }
  };
  const userNameAvailablityCheck = async (username: string) => {
    try {
      const res = await axios.get(`${BE_URL}user/check?username=${username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 200) {
        setUsernameAvailable(true);
        return true;
      } else {
        setUsernameAvailable(false);
        return false;
      }
    } catch (error) {
      setUsernameAvailable(false);
      return false;
    }
  };

  const userInfo = useStore(useUserStore, (state) => state.userInfo) as any;

  return (
    <div className="flex flex-col w-[340px] max-[512px]:py-[4vh] max-[512px]:h-screen  items-center">
      <h1 className={"text-[48px] font-bold text-center"}>Select a username</h1>
      <p className="text-center text-[16px] leading-6 mt-[12px] text-[#575A5C]">
        This username will be used as your shareable wickycd link
      </p>
      <span className="flex flex-col mt-[48px]">
        <label
          className="flex rounded-[12px] bg-[#D6E0EA] h-[48px] w-[340px] px-[12px]"
          htmlFor=""
        >
          <input
            onChange={async (e) => {
              setUserState(e.target.value?.toLowerCase());
              if (e.target.value.length > 0) {
                await userNameAvailablityCheck(e.target.value?.toLowerCase());
              }
            }}
            value={userState}
            className="rounded-[12px] flex flex-1 bg-[#D6E0EA] h-[48px] w-[340px] px-[12px]"
            type="text"
            placeholder="Enter your username"
          />
          {/* <p className="font-bold text-red-600">.tree</p> */}
        </label>
      </span>

      {userState?.length > 0 && (
        <p
          className={`text-[14px] text-[#575A5C] mt-[12px]
        ${usernameAvailable ? "text-green-600" : "text-red-600"}
        `}
        >
          {usernameAvailable ? "username available" : "username not available"}
        </p>
      )}
      <button
        onClick={() => {
          if (userState.length > 0) {
            if (usernameAvailable) {
              setUserInfo({ ...userInfo, username: userState });
              updateUserInfo({
                firstName: userInfo.firstName,
                lastName: userInfo.lastName,
                username: userState,
              });
            } else {
              toast.error("username not available");
            }
          } else {
            if (userState.username?.length === 0) {
              toast.error("please enter your username");
            }
          }
        }}
        className="black-btn text-white w-[340px] mt-[48px] h-[68px] max-[512px]:mt-auto"
      >
        Continue
      </button>
    </div>
  );
};

const NamePick = ({
  setstep,
}: {
  setstep: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { setUserInfo, userInfo } = useUserStore();
  const [userState, setUserState] = useState<any>({
    firstName: "",
    lastName: "",
    email: "",
  });

  return (
    <div className="flex flex-col w-[340px] h-screen py-[4vh] items-center">
      <h1 className={"text-[48px] font-bold text-center"}>Enter your name</h1>
      <p className="text-center text-[16px] leading-6 mt-[12px] text-[#575A5C]">
        This username will be used as your shareable wickycd link
      </p>
      <span className="flex flex-col mt-[48px]">
        <label htmlFor="">
          <h1 className="text-[20px]">first name</h1>
          <input
            className="rounded-[12px] bg-[#D6E0EA] h-[48px] w-[340px] px-[12px]"
            type="text"
            placeholder="Enter first name"
            required
            value={userState.firstName}
            onChange={(e) =>
              setUserState({ ...userState, firstName: e.target.value })
            }
          />
        </label>

        <label className="mt-[18px]" htmlFor="">
          <h1 className="text-[20px]">last name</h1>
          <input
            className="rounded-[12px] bg-[#D6E0EA] h-[48px] w-[340px] px-[12px]"
            type="text"
            placeholder="Enter lastname"
            required
            value={userState.lastName}
            onChange={(e) =>
              setUserState({ ...userState, lastName: e.target.value })
            }
          />
        </label>
      </span>
      <button
        onClick={() => {
          if (
            userState.firstName?.length > 0 &&
            userState.lastName?.length > 0
          ) {
            setUserInfo({ ...userInfo, ...userState });
            setstep(steps.SET_USERNAME);
          } else {
            if (userState.firstName?.length === 0) {
              toast.error("please enter your first name");
            } else if (userState.lastName?.length === 0) {
              toast.error("please enter your last name");
            }
          }
        }}
        className="black-btn text-white w-[340px] mt-[48px] h-[68px] max-[512px]:mt-auto"
      >
        Continue
      </button>
    </div>
  );
};

const BioPick = ({
  updateUserInfo,
  bio,
  setBio,
}: {
  updateUserInfo: () => void;
  bio: { bio: string; tags: string[]; newTag: string };
  setBio: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const { setUserInfo, userInfo } = useUserStore();
  const router = useRouter();
  return (
    <div className="flex flex-col w-[340px] items-center">
      <h1 className={"text-[48px] font-bold text-center"}>
        Add More to your profile
      </h1>
      <p className="text-center text-[16px] leading-6 mt-[12px] text-[#575A5C]">
        Update your Profile section with your information
      </p>
      <span className="flex flex-col mt-[48px]">
        <label htmlFor="">
          <p className="text-[14px] text-[#575A5C]">
           Tell us what you do with Tags (max 4)
          </p>
          <div className="flex flex-row  mt-2  gap-2">
            <input
              className="rounded-[12px] bg-[#D6E0EA] h-[48px]  px-[12px] w-full
            "
              type="text"
              placeholder="Enter tags"
              required
              value={bio.newTag}
              onChange={(e) => setBio({ ...bio, newTag: e.target.value })}
              onKeyUp={(e) => {
                if (e.key == "Enter") {
                  if (bio.newTag?.length > 0) {
                    if (bio.tags.length < 4) {
                      setBio({
                        ...bio,
                        tags: [...bio.tags, bio.newTag],
                        newTag: "",
                      });
                    } else {
                      toast.error("you can only add upto 4 tags");
                    }
                  } else {
                    toast.error("please enter a tag");
                  }
                }
              }}
            />
            <button
          className="w-1/4 bg-black text-white rounded-[12px] h-[48px] text-[#575A5C]"
            onClick={() => {
              if (bio.newTag?.length > 0) {
                if (bio.tags.length < 4) {
                  setBio({
                    ...bio,
                    tags: [...bio.tags, bio.newTag],
                    newTag: "",
                  });
                } else {
                  toast.error("you can only add upto 4 tags");
                }
              } else {
                toast.error("please enter a tag");
              }
            }}
           
         >
            Add
          </button>
          </div>
        </label>
        <div className="flex flex-wrap  mt-2 w-fullv gap-2">
          {bio?.tags?.map((tag: string, index: number) => {
            return (
              <Tag
                key={index}
                onClick={() => {
                  setBio({
                    ...bio,
                    tags: bio.tags.filter((t: string) => t !== tag),
                  });
                }}
                title={tag}
              />
            );
          })}
        </div>
        <label htmlFor="">
          <p className="text-[14px] text-[#575A5C]">Describe Yourself!</p>
          <textarea
            rows={3}
            className="rounded-[12px] bg-[#D6E0EA]  w-[340px] px-[12px]"
            placeholder="Enter your bio"
            required
            value={bio.bio}
            onChange={(e) => setBio({ ...bio, bio: e.target.value })}
          />
        </label>
      </span>
      <p
        className="text-[18px] text-[#575A5C]
        cursor-pointer
      "
        onClick={() => {
          router.push("/");
        }}
      >
        Skip
      </p>
      <button
        onClick={async () => {
          if (bio.bio?.length > 140) {
            toast.error("bio must be less than 140 characters");
            return;
          }
          else {
            setUserInfo({
              ...userInfo,
              firstTimeLogin: false,
              bio: bio.bio,
              tags: bio.tags,
            });
            updateUserInfo();
          }
        }}
        className="black-btn text-white w-[340px] mt-[24px] h-[68px]"
      >
        Continue
      </button>
    </div>
  );
};

const Tag = ({ title, onClick }: { title: String; onClick?: () => void }) => {
  return (
    <span
      onClick={onClick}
      className="h-[39px] px-[10px] gap-2 flex border border-black rounded-[40px] justify-center items-center w-min"
    >
      <p className="w-max mb-1">{title}</p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="17"
        viewBox="0 0 16 17"
        fill="none"
      >
        <path
          d="M9.99967 6.5L5.99967 10.5M5.99967 6.5L9.99967 10.5M14.6663 8.5C14.6663 12.1819 11.6816 15.1667 7.99967 15.1667C4.31778 15.1667 1.33301 12.1819 1.33301 8.5C1.33301 4.8181 4.31778 1.83334 7.99967 1.83334C11.6816 1.83334 14.6663 4.8181 14.6663 8.5Z"
          stroke="black"
          stroke-width="1.33333"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </span>
  );
};

export default UserOnBoard;
