import "@/styles/globals.css";
import type { AppProps } from "next/app";
import WagmiProvider from "@/lib/wagmiProvider";


import { HuddleClient, HuddleProvider } from "@huddle01/react";

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
       <HuddleProvider client={huddleClient}>
      <Component {...pageProps} />
      </HuddleProvider>
    </WagmiProvider>
  );
}