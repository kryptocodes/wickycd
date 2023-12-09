import "@/styles/globals.css";
import type { AppProps } from "next/app";
import WagmiProvider from "@/lib/wagmiProvider";
import { LightNodeProvider } from "@waku/react";

// Set the Light Node options
const NODE_OPTIONS = { defaultBootstrap: true };



export const BE_URL = "http://localhost:5000/";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider>
       <LightNodeProvider options={NODE_OPTIONS}>
      <Component {...pageProps} />
      </LightNodeProvider>
    </WagmiProvider>
  );
}