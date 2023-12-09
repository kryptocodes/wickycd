import React, { useEffect } from 'react'
import { BE_URL } from '../_app';
import axios from 'axios';

import { useAccount, useConnect, useSignMessage, useSignTypedData } from "wagmi";
import { useRouter } from 'next/router';
import { ConnectButton, useConnectModal, Wallet } from "@rainbow-me/rainbowkit";
import toast, { Toaster } from 'react-hot-toast';

interface verifyProps {

}


const Verify: React.FC<verifyProps> = () => {
    const router = useRouter()
    const { address,isConnected } = useAccount()
    const [state, setState] = React.useState<boolean>(false)
    const { openConnectModal } = useConnectModal();
    useEffect(() => {
        console.log(router.query.verify)
    }, [router.isReady, router.query.verify])
    const { data, error, isLoading, signMessage } = useSignMessage({
        onSuccess: (data, variables) => {
            console.log(data,variables)
            verify(data,variables.message)
        },
        onError: (error) => {
          console.log(error)
        }
      });
       const verify = async (data: string, nonce: string) => {
        try{
            const res = await axios.post(`${BE_URL}user/verify/request`, {
                wallet: address,
                sign: data,
                nonce: nonce
            })
            if(res.status === 200){
                toast.success('successfully verified ! you can close this tab now')
                setState(true)
            }
        }
        catch(error){
            console.error(error)
        }
       }
        
       const signMessageVerify = async(nonce:string) => {
        try{
            let message = `Click to Verify\n\nThis is a KYC Request verification for your account. This request does not trigger any transaction or cost any fees.\n\nTechnical Data (ignore if not a power-user)\n\nWallet Address: ${address}\n\nid: ${nonce}`
            await signMessage({ message: message });
        }
        catch(error){
            console.log(error)
        }
       }

        return (
            <>
            <Toaster position='top-right' /> 
            <div className='flex flex-col items-center justify-center h-screen'>
            <button 
            className='bg-black text-white p-2 rounded-md'
            onClick={
                () => {
                    if(state){
                        return
                    }
                    if(isConnected && !state){
                        signMessageVerify(router.query.verify as string)
                    } else {
                        openConnectModal && openConnectModal();
                    
                    }  } 
            }>{state ? "Verified" : "Verify"}</button>
            
            </div>
            </>
        );
}

export default Verify