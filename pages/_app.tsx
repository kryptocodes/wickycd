import "@/styles/globals.css";
import type { AppProps } from "next/app";
import WagmiProvider from "@/lib/wagmiProvider";

export const BE_URL = "http://localhost:3000";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider>
      <Component {...pageProps} />
    </WagmiProvider>
  );
}