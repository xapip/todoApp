import { create } from "zustand"
import type { User } from "@supabase/supabase-js"

type storeType = {
  user: User | undefined

  setUserData: (data: User) => void
}

export const useUserStore = create<storeType>((set) => {
  return {
    user: undefined,

    setUserData(data) {
      set({ user: data })
    },
  }
})
