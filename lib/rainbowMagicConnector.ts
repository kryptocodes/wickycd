// Import the MagicAuthConnector from the wagmi-magic-connector package
import { DedicatedWalletConnector, MagicAuthConnector, } from "@magiclabs/wagmi-connector";
import { Chain } from "wagmi";
import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";
import { Web3Auth } from "@web3auth/modal";

// Define the rainbowMagicConnector function that will be used to create the Magic connector
export const rainbowMagicConnector = ({ chains }: { chains: Chain[] }) => ({
	id: "magic",
	name: "Magic Auth",
	iconUrl: "https://svgshare.com/i/pXA.svg",
	iconBackground: "white",
	createConnector: () => ({
		// This can be replaced with the MagicConnectConnector if you want to use the Magic Connect flow
		connector: new MagicAuthConnector({
			chains,
			options: {
				apiKey: process.env.NEXT_PUBLIC_MAGIC_API_KEY as string,
				oauthOptions: {
					providers: ["google"],
				},
				isDarkMode: false,
				magicSdkConfiguration: {
					network: {
						rpcUrl: "https://rpc.ankr.com/eth",
						chainId: 1,
						
					},
				},
			},
		}),
	}),
});
  