import "@/styles/globals.css";
import type { AppProps } from "next/app";
import WagmiProvider from "@/lib/wagmiProvider";
import { AnonAadhaarProvider } from 'anon-aadhaar-react'

const app_id = process.env.NEXT_PUBLIC_APP_ID || "";
import { HuddleClient, HuddleProvider } from "@huddle01/react";
import { AirstackProvider } from "@airstack/airstack-react";
import { XMTPProvider } from "@xmtp/react-sdk";



const huddleClient = new HuddleClient({
  projectId: "zMQHa6hH5hGrxfwYZp7z8I-1lWScI7UA",
  options: {
    activeSpeakers: {
      size: 8,
    },
  },
});


export const BE_URL = "https://reclaim-test.onrender.com/";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider>
      <XMTPProvider>
      <AirstackProvider apiKey="GWBJbZ82VpiCyFusb89d40BaU05t8atG">
       <HuddleProvider client={huddleClient}>
       <AnonAadhaarProvider _appId={app_id}>
      <Component {...pageProps} />
      </AnonAadhaarProvider>
      </HuddleProvider>
      </AirstackProvider>
      </XMTPProvider>
    </WagmiProvider>
  );
}