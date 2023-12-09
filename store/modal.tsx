import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'


type modalStore = {
    state: boolean;
    setState: (state: boolean) => void;
}




export const useModalStore = create(
    persist<modalStore>(
      (set) => ({
        state: false,
        setState: (state: boolean) => set({ state }),
      }),
      {
        name: 'modal', 
      }
    )
  )

