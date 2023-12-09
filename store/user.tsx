import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'


type userStore = {
    wallet: string;
    setWallet: (wallet: string) => void;
    token: string;
    setToken: (token: string) => void;
    userInfo: {
        firstName: string;
        lastName: string;
        username: string;
        bio?: string;
        tags?: string[];
        pfp?: string;
    } | object;
    setUserInfo: (userInfo: object) => void;
    firtTimeLogin: boolean;
    setFirtTimeLogin: (firtTimeLogin: boolean) => void;
}




export const useUserStore = create(
    persist<userStore>(
      (set) => ({
        wallet: "",
        setWallet: (wallet: string) => set({ wallet }),
        token: "",
        setToken: (token: string) => set({ token }),
        userInfo: {
            firstName: "",
            lastName: "",
            username: "",
            bio: "",
            tags: [],
            pfp: "",
        },
        setUserInfo: (userInfo: object) => set({ userInfo }),
        firtTimeLogin: false,
        setFirtTimeLogin: (firtTimeLogin: boolean) => set({ firtTimeLogin }),
      }),
      {
        name: 'webtree', 
        storage: createJSONStorage(() => localStorage), 
       
      }
    )
  )

