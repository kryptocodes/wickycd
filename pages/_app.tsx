import "@/styles/globals.css";
import type { AppProps } from "next/app";
import WagmiProvider from "@/lib/wagmiProvider";
import { AnonAadhaarProvider } from 'anon-aadhaar-react'

const app_id = process.env.NEXT_PUBLIC_APP_ID || "";
import { HuddleClient, HuddleProvider } from "@huddle01/react";
import { AirstackProvider } from "@airstack/airstack-react";



const huddleClient = new HuddleClient({
  projectId: "zMQHa6hH5hGrxfwYZp7z8I-1lWScI7UA",
  options: {
    activeSpeakers: {
      size: 8,
    },
  },
});


export const BE_URL = "http://localhost:5000/";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider>
      <AirstackProvider apiKey="1869b4fa73dd54ed09970cad800742cea">
       <HuddleProvider client={huddleClient}>
       <AnonAadhaarProvider _appId={app_id}>
      <Component {...pageProps} />
      </AnonAadhaarProvider>
      </HuddleProvider>
      </AirstackProvider>
    </WagmiProvider>
  );
}