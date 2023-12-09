/* eslint-disable @next/next/no-img-element */
import Close from "@/assets/close";
import ImgIcon from "@/assets/imgIcon";
import { BE_URL } from "@/pages/_app";
import { useUserStore } from "@/store/user";
import axios from "axios";
import React, { useState } from "react";

interface PFPModalProps {
  state: boolean;
  setState: (state: boolean) => void;
}

const PFPModal: React.FC<PFPModalProps> = ({ state, setState }) => {
  const [img, setImg] = useState<string | null>(null);
  const token = useUserStore((state) => state.token);
  const { userInfo } = useUserStore();

  const uploadImage = async () => {
    try {
      const form = new FormData();
      const blob = await (await fetch(img as string)).blob();
      form.append("image", blob);
      const res = await axios.post(`${BE_URL}user/updateProfilePicture`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.status === 200) {
        setImg(null);
        setState(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!state) return null;

  return (
    <>
      <div
        id="default-modal"
        aria-hidden="true"
        className="fixed inset-0 z-50 flex w-full h-full bg-[#ffffff1f] overflow-x-hidden overflow-y-auto outline-none focus:outline-none backdrop-blur"
      >
        <div className="relative w-auto mt-12 mx-auto max-w-3xl px-3">
          <div className="border-0 rounded-lg relative flex flex-col w-full  outline-none focus:outline-none">
            <>
              <button
                className="absolute right-0 top-0 m-4"
                onClick={() => {
                  setState(false);
                  setImg(null);
                }}
              >
                <Close />
              </button>
              <label htmlFor="fileInput">
                <div className="flex items-center justify-center">
                  <img
                    src={
                      img ||
                      (userInfo as { pfp?: string | undefined }).pfp ||
                      "/user.png"
                    }
                    alt=""
                    className="h-fit object-contain rounded-2xl border-black border-[2px] max-w-[390px] w-[100%]"
                  />
                </div>
              </label>
              <input
                type="file"
                accept="image/*"
                id="fileInput"
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      setImg(e.target?.result as string);
                    };
                    reader.readAsDataURL(e.target.files[0]);
                  }
                }}
              />
              <p className="bg-[#D6E0EA] gap-2 mt-4 border-btn h-[68px] text-[18px] font-medium bg- justify-center items-center flex">
                <ImgIcon /> Click to upload
              </p>
            </>

            <button
              className="bg-[#D6E0EA] mt-4 border-btn h-[68px] text-[18px] font-medium bg- justify-center items-center flex"
              type="button"
              onClick={uploadImage}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PFPModal;
