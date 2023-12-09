import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

interface UserProps {
  wallet: string;
}

export const User = ({
   username,
   wallet,
   company,
   name,
   email,
   bio,
}: {
  username: string;
  wallet: string;
  company: string | false,
  name: string | false
  email: string | false,
  bio: string | false
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <>
    <Toaster />
    <div className="flex w-full gap-[16px] justify-center mt-[36px] border-b-[1px] pb-[19px] border-[#181818]">
      <picture>
        <img
          className="w-[120px] h-[120px] rounded-2xl"
          src="/user.png"
          alt=""
        />
      </picture>
      <span>
        <h1 className="text-[24px] font-semibold leading-[24px]">
          {name }
        </h1>
        <p className="text-[#575A5C] ">{
          email
}
        </p>
        <p className="text-[#575A5C] ">
        {wallet?.slice(0, 6)}...{wallet?.slice(-4)}
        </p>
        <span className="flex flex-col border-t-[1px] border-[#18181833] pt-[4px] mt-1">
          <h3 className="flex items-center">
            <svg
              className="mr-[8px]"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="17"
              fill="none"
              viewBox="0 0 16 17"
            >
              <path
                stroke="#181818"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.333"
                d="M5.333 14.5V5.167c0-.62 0-.93.069-1.185a2 2 0 011.414-1.414C7.07 2.5 7.38 2.5 8 2.5s.93 0 1.184.068A2 2 0 0110.6 3.982c.068.255.068.565.068 1.185V14.5m-7.2 0h9.066c.747 0 1.12 0 1.406-.145.25-.128.455-.332.582-.583.146-.285.146-.659.146-1.405V7.3c0-.747 0-1.12-.146-1.405a1.333 1.333 0 00-.582-.583c-.286-.145-.659-.145-1.406-.145H3.467c-.747 0-1.12 0-1.406.145-.25.128-.454.332-.582.583-.146.285-.146.658-.146 1.405v5.067c0 .746 0 1.12.146 1.405.128.25.331.455.582.583.286.145.659.145 1.406.145z"
              ></path>
            </svg>
            Company: {company}
          </h3>
          <h3 className="flex items-center">
           
            {bio}
          </h3>
        </span>

        {isClient &&
          
        
        <button 
        className="flex justify-center items-center bg-black text-white rounded-full px-12 py-1 mt-4 "
        onClick={() => {
          
         window?.navigator.clipboard.writeText(
          window?.location.href.includes(username) ? window?.location.href :
          window?.location.href + username
         )
         toast.success('Copied to clipboard')
        }}
      >
    {window?.location?.href.includes(username) ? 'Share this profile' : 'Share my profile'}
      </button> }
      </span>
      
    </div>
    </>
  );
};
