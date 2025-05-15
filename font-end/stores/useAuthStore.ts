import { create } from 'zustand';
import {persist, devtools, createJSONStorage} from 'zustand/middleware';

interface ITokens {
    accessToken: string,
    refreshToken: string
}

interface IUser {
    _id: string,
    email: string,
    userName: string,
    fullName: string,
    avatarUrl: string,
    lastLogin: Date,
    roles: string,
    status: string,
    gender?: string,
    phone?: string,
    birthDay?: string
}

interface IAuthStore {
  //token
    tokens: ITokens | null,
    setTokens: (tokens: ITokens) => void,
    clearTokens: () => void,
  //user
    user: IUser | null,
    setUser: (user: IUser) => void,
    clearUser: () => void
}

export const useAuthStore = create<IAuthStore>()(
  devtools(
    persist(
      (set) => ({
        //token
        tokens: null,
        setTokens: (tokens) => set({tokens}),
        clearTokens: () => set({ tokens: null }),
        //user
        user: null,
        setUser: (user) => set({user}),
        clearUser: () => set({ user: null }),
      }),
      {
        name: 'auth-storage',
        storage: createJSONStorage(() => localStorage), // lưu vào local storage
      }
    )
  )
)